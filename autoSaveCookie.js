function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days *  24 *  60 *  60 *  1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function saveBoard() {
    if ( getCookie("autoCreatedBoard") == null ) {
        setCookie("autoCreatedBoard", null, 1460); // 4 Year Cookie
    } else {
        var currentValue = getCookie("autoCreatedBoard");
        setCookie("autoCreatedBoard", board, 1460);
    }
    return parseInt( getCookie("autoCreatedBoard") );
}