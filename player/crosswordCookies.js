/* General Cookie Functions*/

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days *  24 *  60 *  60 *  1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function setArrayCookie(name, array, days) {
    var jsonStr = JSON.stringify(array);
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days *  24 *  60 *  60 *  1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + jsonStr + expires + "; path=/";
}

function getArrayCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i =  0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) ==  0) return JSON.parse(c.substring(nameEQ.length));
    }
    return null;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i =  0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) ==  0) return c.substring(nameEQ.length);
    }
    return null;
}

function checkStreak() {
    const streakCookie = getCookie('streak');
    if (streakCookie) {
        const [lastVisitedDate, currentStreak] = streakCookie.split(',');
        const now = new Date();
        const lastVisit = new Date(lastVisitedDate);

        // Calculate the difference in weeks between the current date and the last visited date
        const diffWeeks = Math.floor((now - lastVisit) / (1000 *   60 *   60 *   24 *   7));

        // Update the streak based on the time difference
        if (diffWeeks ===   1) {
            setCookie('streak', `${now.toISOString()},${parseInt(currentStreak) +   1}`,   365);
        } else if (diffWeeks >=   2) {
            setCookie('streak', `${now.toISOString()},1`,   365);
        }
    } else {
        // Create the streak cookie if it doesn't exist
        setCookie('streak', `${new Date().toISOString()},1`,   365);
    }
}

function increaseNumberCookie() {
    if ( getCookie("totalCorrect") == null ) {
        setCookie("totalCorrect", 1, 1460); // 4 Year Cookie
    } else {
        var currentValue = parseInt( getCookie("totalCorrect") );
        setCookie("totalCorrect", currentValue+1, 1460);
    }
    return parseInt( getCookie("totalCorrect") );
}

function addToCompletedArray() {
    var crosswordName = document.getElementById('cswdTitle').innerText;
    var array;
    if ( getArrayCookie("completedNames") == null) {
        array = [crosswordName];
        setArrayCookie("completedNames", array, 1460); // 4 Year Cookie
    } else {
        array = getArrayCookie("completedNames");
        array.push(crosswordName);
        setArrayCookie("completedNames", array, 1460);
    }
    console.log("List of Completed Crosswords: ")
    console.log( getArrayCookie("completedNames") );
}