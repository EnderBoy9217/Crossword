/*
    File Scope Variables
*/

var table = document.getElementById('crosswordTable');

var isBlackout = false; // If all unused squares are currently blacked out
var areHidden = false; // If the answers are currently hidden
var typingDirection = 0; // Current typing direction (0 = across, 1 = down)

/*
    End of File Scope Variables
*/

function createEditableTable() {
    length = 15;
    width = 15;
    for(var y=0; y<length; y++){
        var tr = document.createElement('tr');
        for(var x=0; x<width; x++){
            var td = document.createElement('td');
            td.setAttribute('row', y);
            td.setAttribute('col', x);
            td.setAttribute('class', "cell");
            td.setAttribute('selected', false);
            td.setAttribute('key', "");
            var topLeftText = document.createElement('span');
            topLeftText.className = 'topLeftText'; // CSS Styling
            var centerText = document.createElement('span');
            centerText.className = 'innerCellText'; // CSS Styling
            td.addEventListener('click',cellOnClick);
            td.addEventListener('select',cellOnClick);
            td.appendChild(centerText);
            td.appendChild(topLeftText);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);
    initAllInputs();
    populateSelect();
}

function createNewTable( event ) {
    length = 15;
    width = 15;
    selector = event.target;
    switch(selector.value) {
        case 'standard':
            length = 15;
            width = 15;
            break;
        case 'magazine':
            length = 17;
            width = 17;
            break;
        case 'largeMagazine':
            length = 19;
            width = 19;
            break;
        case 'sunday':
            length = 21;
            width = 21;
            break;
        case 'mini':
            length = 5;
            width = 5;
            break;
        case 'weekendSmall':
            length = 23;
            width = 23;
            break;
        case 'weekendLarge':
            length = 25;
            width = 25;
            break;
        case 'french':
            length = 9;
            width = 9;
            break;
        case 'italian':
            length = 13;
            width = 21;
            break;
    }
    table.innerHTML = '';
    for(var y=0; y<length; y++){
        var tr = document.createElement('tr');
        for(var x=0; x<width; x++){
            var td = document.createElement('td');
            td.setAttribute('row', y);
            td.setAttribute('col', x);
            td.setAttribute('class', "cell");
            td.setAttribute('selected', false);
            td.setAttribute('key', "");
            var topLeftText = document.createElement('span');
            topLeftText.className = 'topLeftText'; // CSS Styling
            var centerText = document.createElement('span');
            centerText.className = 'innerCellText'; // CSS Styling
            td.addEventListener('click',cellOnClick);
            td.addEventListener('select',cellOnClick);
            td.appendChild(centerText);
            td.appendChild(topLeftText);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function checkAnswers() {
    var allCorrect = true;
    crosswordTable = document.getElementById('crosswordTable');
    var cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(function(cell) {
        var centerText = cell.querySelector('.innerCellText');
        if ( centerText.textContent != "" ) {
            if ( centerText.textContent === cell.getAttribute('key') ) {
                centerText.classList.add("correct");
            }
            else {
                centerText.classList.add("incorrect");
                allCorrect = false;
            }
        } else if ( cell.getAttribute('key') != "" ) {
                allCorrect = false;
        }
    })
    if ( allCorrect ) {
        openModal();
    }
}

function cellOnClick( event ) {
    shouldFindNext = false;
    shouldFindPrevious = false;
    shouldFindSelf = false;
    shouldFindParams = 0;
    var self = event.target;
    if ( self.tagName === 'SPAN') {
        self = self.parentNode;
    }
    deSelectAll();
    self.classList.add("selected");
    self.setAttribute('selected', true);
    highlightSelected( self );
    document.getElementById("hiddenInput").focus();
    var centerText = self.querySelector('.innerCellText');
    var isCorrect = centerText.classList.contains("correct");
    var isTyping = false;
    window.addEventListener('keydown', function(e) { 
        if ( isTyping ) {
            return;
        }
        isTyping = true;
        if (self.getAttribute('selected') == "false") return;
        e.preventDefault();
        if ( isAlphabetic(String.fromCharCode(e.which) ) ) {  // Letter
            if ( !isCorrect ) {
                centerText.textContent = String.fromCharCode(e.which);
            }
            if ( centerText.classList.contains("incorrect") ) {
                centerText.classList.remove("incorrect");
            }
            shouldFindNext = true;
        } else if (e.which == 8) { // Backspace
            if ( !isCorrect ) {
                centerText.textContent = "";
            }
            shouldFindPrevious = true;
        } else if (e.which == 32) { // Space
            if ( !isCorrect ) {
                centerText.textContent = "";
            }
            shouldFindNext = true;
        } else if ( e.which == 9 ) { // Tab
            toggleDirection();
            shouldFindSelf = true;
        } else if ( e.which == 37 ) { // Left Arrow Key
            shouldFindParams = 2;
        } else if ( e.which == 38 ) { // Up Arrow Key
            shouldFindParams = 3;
        } else if ( e.which == 39 ) { // Right Arrow Key
            shouldFindParams = 1;
        } else if ( e.which == 40 ) { // Down Arrow Key
            shouldFindParams = 4;
        } else { // Other unrecognized input
            if ( !isCorrect ) {
                centerText.textContent = "";
            }
        }
        self.classList.remove("selected");
        self.setAttribute('selected', false);
        deHighlightAll();
        window.removeEventListener('keydown', arguments.callee);
        if (shouldFindNext) {
            findNextCell( self ); // JS doesn't support multithreading, however tables shouldnt be big enough to cause huge memory issues
        }
        else if (shouldFindPrevious) {
            if ( findNextCell( self, true, typingDirection, false ) != undefined) { //Prevents console throwing error, does not impact user experience
                findNextCell( self, true );
            }
        }
        else if (shouldFindSelf) {
            findCurrentCell( self );
        }
        else if (shouldFindParams != 0) { // Arrow Keys
            if (shouldFindParams == 1) { // Right Arrow Key
                findNextCell ( self, false, 0); // Across forwards
            }
            else if ( shouldFindParams == 2 ) { // Left Arrow Key
                findNextCell ( self, true, 0); // Across backwards
            }
            else if ( shouldFindParams == 3 ) { // Up Arrow Key
                findNextCell ( self, true, 1); // Down backwards
            }
            else if ( shouldFindParams == 4 ) { // Down Arrow Key
                findNextCell ( self, false, 1); // Down forwards
            }
        }
    });
}

function findCurrentCell( currentCell ) {
    var selectEvent = new CustomEvent('select');
    currentCell.dispatchEvent(selectEvent);
}

function findNextCell( currentCell, backwards = false, direction = -1, select = true, triedOther = false ) {
    x = parseInt(currentCell.getAttribute('col'));
    y = parseInt(currentCell.getAttribute('row'));
    if ( direction == -1 ) {
        direction = typingDirection;
    }
    if (direction == 0) { // Across
        var cells = Array.from(document.getElementsByClassName("cell"));
        var currentRowCells = cells.filter(cell => parseInt(cell.getAttribute('row')) == y);
        if (!backwards) {
            var nextCellIndex = currentRowCells.findIndex(cell => cell == currentCell) + 1;
        } else {
            var nextCellIndex = currentRowCells.findIndex(cell => cell == currentCell) - 1;
        }
        
        if (nextCellIndex < currentRowCells.length) {
            var nextCell = currentRowCells[nextCellIndex];
            if ( select ) {
                if ( nextCell.classList.contains("blackout") ) {
                    if ( triedOther ) {
                        return undefined;
                    }
                    else {
                        return findNextCell( currentCell, backwards, 1, select, true);
                    }
                }
                var selectEvent = new CustomEvent('select');
                nextCell.dispatchEvent(selectEvent);
                if ( triedOther ) {
                    toggleDirection();
                }
                return undefined;
            }
            else {
                return nextCell;
            }
        }
    } else { // Down
        var cells = Array.from(document.getElementsByClassName("cell"));
        var currentColCells = cells.filter(cell => parseInt(cell.getAttribute('col')) == x);
        if (!backwards) {
            var nextCellIndex = currentColCells.findIndex(cell => cell == currentCell) + 1;
        } else {
            var nextCellIndex = currentColCells.findIndex(cell => cell == currentCell) - 1;
        }
        if (nextCellIndex < currentColCells.length) {
            var nextCell = currentColCells[nextCellIndex];
            if ( select ) {
                if ( nextCell.classList.contains("blackout") ) {
                    if ( triedOther ) {
                        return undefined;
                    }
                    else {
                        return findNextCell( currentCell, backwards, 0, select, true);
                    }
                }
                var selectEvent = new CustomEvent('select');
                nextCell.dispatchEvent(selectEvent);
                if ( triedOther ) {
                    toggleDirection();
                }
                return undefined;
            }
            else {
                return nextCell;
            }
        }
    }
}

function populateSelect() {
    var items = returnPreMadeFiles();
    const selectElement = document.getElementById('cswdSelect');
    selectElement.addEventListener('change', handleSelectionChange);
  
    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.name; // Set the value attribute to the name
      option.textContent = item.name; // Set the display text to the name
      selectElement.appendChild(option);
    });
}

function handleSelectionChange(event) {
    var items = returnPreMadeFiles();
    const selectedValue = event.target.value;
    const selectedObject = items.find(item => item.name === selectedValue);
    
    if (selectedObject) {
      // Call your function with the selected object
      loadPreFile(selectedObject);
    } else {
      console.log('No matching object found for the selected value.');
    }
}

function loadSelectionButton() {
    var items = returnPreMadeFiles();
    const selectElement = document.getElementById('cswdSelect');
    const selectedValue = selectElement.value;
    const selectedObject = items.find(item => item.name === selectedValue);
    
    if (selectedObject) {
      // Call your function with the selected object
      loadPreFile(selectedObject);
    } else {
      console.log('No matching object found for the selected value.');
    }
}

function loadPreFile( file ) {

    var parser = new DOMParser();
    const sanitizedHTML = DOMPurify.sanitize(file.content);
    var doc = parser.parseFromString(sanitizedHTML, 'text/html') ;
    var name = file.name;
    var titleElement = document.getElementById('cswdTitle');
    titleElement.innerText = name;

    // Select the table element from the parsed object
    var tableElement = doc.querySelector('table');
    var acrossHintList = doc.getElementById("acrossHintList");
    var downHintList = doc.getElementById("downHintList");

    // Check if the table element exists
    if (!tableElement) {
        console.error('Not a valid file! Could not find the table element!');
        return;
    }

    // Create a new table element from the string
    // Replace the existing table with the loaded table
    var existingTable = document.getElementById('crosswordTable');
    existingTable.parentNode.replaceChild(tableElement, existingTable);
    var existingAcrossHints = document.getElementById("acrossHintList");
    var existingDownHints = document.getElementById("downHintList");
    existingAcrossHints.parentNode.replaceChild(acrossHintList, existingAcrossHints);
    existingDownHints.parentNode.replaceChild(downHintList,existingDownHints);

    // Add author name
    var authorText = document.getElementById("authorText");
    authorText.textContent = "Created By: " + tableElement.getAttribute("author");

    // Re-add Event listeners to cells
    var cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(function(cell) {
        cell.addEventListener('click',cellOnClick);
        cell.addEventListener('select',cellOnClick);
    })
    blackoutUnusedSquares();
    clearTable();

    if ( isBlackout ) {
        toggleBlackout()
    }
}

function uploadFileEvent( event ) {
console.log("Checking file:");
var file = event.target.files[0];
console.log(file);

// Check for valid file type
if (file) {
    var filePath = file.name;
    var allowedExtensions = /(\.cswd)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Invalid file type. Please select a .cswd file.');
        event.target.value = '';
        console.log("Invalid file type");
        return false;
    }
} else {
    return false; // Do not continue if it is not a valid file
}

// Set the title to the name of the uploaded file
var titleElement = document.getElementById('cswdTitle');
var fileNameWithoutExtension = file.name.replace('.cswd', '');
titleElement.innerText = fileNameWithoutExtension;

var reader = new FileReader();

reader.onload = function(e) {
    
    var parser = new DOMParser();
    var doc = parser.parseFromString(e.target.result, 'text/html');

    // Select the table element from the parsed object
    var tableElement = doc.querySelector('table');
    var acrossHintList = doc.getElementById("acrossHintList");
    var downHintList = doc.getElementById("downHintList");

    // Check if the table element exists
    if (!tableElement) {
        console.error('Not a valid file! Could not find the table element!');
        return;
    }

    // Create a new table element from the string
    // Replace the existing table with the loaded table
    var existingTable = document.getElementById('crosswordTable');
    existingTable.parentNode.replaceChild(tableElement, existingTable);
    var existingAcrossHints = document.getElementById("acrossHintList");
    var existingDownHints = document.getElementById("downHintList");
    existingAcrossHints.parentNode.replaceChild(acrossHintList, existingAcrossHints);
    existingDownHints.parentNode.replaceChild(downHintList,existingDownHints);

    // Add author name
    var authorText = document.getElementById("authorText");
    authorText.innerHTML = "Created By: " + tableElement.getAttribute("author");

    // Re-add Event listeners to cells
    var cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(function(cell) {
        cell.addEventListener('click',cellOnClick);
        cell.addEventListener('select',cellOnClick);
    })
    blackoutUnusedSquares();
    clearTable();
    }
    
    reader.readAsText(file);

    if ( isBlackout ) {
        toggleBlackout()
    }
}

function isAlphabetic(char) {
    if (char.length !== 1) {
        return false;
    }
    var code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function isDigit(char) {
    var code = char.charCodeAt(0);
    return code >= 48 && code <= 57;
}

function deSelectAll() {
    deHighlightAll();
    var cells = document.getElementsByClassName("selected");
    while (cells.length >  0) {
        cells[0].setAttribute('selected', false);
        cells[0].classList.remove("selected");
    }
}

/* Create buttons */

function createDirectionButtonEvent() {
    button = document.getElementById('directionButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',toggleDirection);
}

function createCheckButtonEvent() {
    button = document.getElementById('checkButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',checkAnswers);
}

function createUploadEvent() {
    button = document.getElementById('cswdUpload');
    button.addEventListener('change', uploadFileEvent );
}

function initSelectButton() {
    var button = document.getElementById("selectCrosswordButton");
    button.addEventListener("click",loadSelectionButton);
}
function initModalButton() {
    var button = document.getElementById("closeModalButton");
    button.addEventListener("click",closeModal);
}

function createDeSelectListener() {
    document.addEventListener('click', function(event) {
        if (!table.contains(event.target)) {
            deSelectAll();
        }
    });
}

/*
    Input Functions
*/

function initAllInputs() { // Fires after table is created
    createUploadEvent();
    createDirectionButtonEvent();
    createCheckButtonEvent();
    initModalButton();
    initSelectButton();
    //createDeSelectListener();
}

/* Button Functions */

function toggleDirection() {
    if (typingDirection == 0) {
        button = document.getElementById('directionButton');
        button.textContent = "Type Across";
        typingDirection = 1;
    } else {
        button = document.getElementById('directionButton');
        button.textContent = "Type Down";
        typingDirection = 0;
    }
}

function toggleBlackout() {
    if ( isBlackout ) {
        unBlackoutAll();
        button = document.getElementById('blackoutButton');
        button.textContent = "Blackout unused squares";
        isBlackout = false;
        console.log("Unblackout");
    } else {
        blackoutUnusedSquares();
        button = document.getElementById('blackoutButton');
        button.textContent = "Remove blackout";
        isBlackout = true;
        console.log("blackout");
    }
}

function blackoutUnusedSquares() {
    deSelectAll();
    var cells = document.getElementsByClassName("cell");
    for(var i = 0; i < cells.length; i++) {
        if ( cells[i].getAttribute('key') == "") {
            cells[i].classList.remove();
            cells[i].classList.add("blackout");
        }
    }
}

function unBlackoutAll() {
    var cells = document.getElementsByClassName("cell");
    for(var i = 0; i < cells.length; i++) {
        if ( cells[i].classList.contains("blackout") ) {
            cells[i].classList.remove("blackout");
        }
    }
}

function clearTable() {
   var cells = document.getElementsByClassName("cell");
   for(var i = 0; i < cells.length; i++) {
       var centerText = cells[i].querySelector('.innerCellText');
       centerText.textContent = "";
   }
}

function highlightSelected( selectedCell, tried = false ) {
    var currentCell = selectedCell;
    var length = 0;
    for (var i = 0; i < 2; i++ ) {
        var backwards = false;
        if ( i == 1 ) {
            backwards = true;
        }
        var endOfWord = false;
        while ( !endOfWord ) {
            var newCell = findNextCell(currentCell, backwards, typingDirection, false)
            if ( newCell == undefined ) { // End of board
                endOfWord = true;
            } else if (newCell.classList.contains("blackout") ) { // Next cell is blacked out
                endOfWord = true;
            } else {
                currentCell = newCell;
                if ( newCell != selectedCell ) {
                    newCell.classList.add("highlighted");
                }
                length++;
            }
        }
    }
    if ( length < 2 ) { // Less than 3 letter word? Change direction
        deHighlightAll();
        toggleDirection();
        if ( !tried ) { // Failsafe to prevent infinite loop
            highlightSelected( selectedCell, true );
        }
    }
}

function deHighlightAll() {
    var cells = Array.from(document.getElementsByClassName("highlighted"));
    for(var i = 0; i < cells.length; i++) {
       cells[i].classList.remove("highlighted");
   }
}

function openModal() {
    var modal = document.getElementById("winModal");
    var overlay = document.getElementById("winOverlay");
    modal.style.display = "block";
    overlay.style.display = "block";
    var completedNumber = document.getElementById("completedNumber");
    var streakNumber = document.getElementById("streakNumber");
    checkStreak();
    var [lastVisitedDate, currentStreak] = getCookie("streak").split(',');
    streakNumber.textContent = currentStreak;

    var crosswordName = document.getElementById('cswdTitle').innerText;
    if ( getArrayCookie("completedNames") != null ) {
        var completedArray = getArrayCookie("completedNames");

        if ( completedArray.includes(crosswordName) ) {
            var completed = getCookie("totalCorrect");
            completedNumber.textContent = completed;
        } else {
            var completed = increaseNumberCookie();
            completedNumber.textContent = completed;
            addToCompletedArray();
        }
    } else {
        var completed = increaseNumberCookie();
        completedNumber.textContent = completed;
        addToCompletedArray();
    }

}
  

function closeModal() {
    var modal = document.getElementById("winModal");
    var overlay = document.getElementById("winOverlay");
    modal.style.display = "none";
    overlay.style.display = "none";
}

createEditableTable();