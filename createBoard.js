/*
    File Scope Variables
*/

var table = document.createElement('table');
table.id = 'board'; // Assign the id here

isBlackout = false;
areHidden = false;
typingDirection = 0; // 0 = across, 1 = down

/*
    End of File Scope Variables
*/

// Create hidden input for mobile users
var hiddenInput = document.createElement('input');
hiddenInput.style.position = 'absolute';
hiddenInput.style.opacity = '0';
document.body.appendChild(hiddenInput);

function createEditableTable() {
    for(var y=0; y<15; y++){
        var tr = document.createElement('tr');
        for(var x=0; x<15; x++){
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
}

function cellOnClick(event) {
   shouldFindNext = false;
   var self = event.target;
   if ( self.tagName === 'SPAN') {
       self = self.parentNode;
   }
   deSelectAll();
   if (areHidden) {
       showTableKey();
   }
   self.classList.add("selected");
   self.setAttribute('selected', true);
   hiddenInput.focus();
   var centerText = self.querySelector('.innerCellText');
   var topLeftText = self.querySelector('.topLeftText');
   window.addEventListener('keydown', function(e) { 
       if (self.getAttribute('selected') == "false") return; 
       e.preventDefault();
       if( isAlphabetic(String.fromCharCode(e.which) ) ) { 
           centerText.textContent = String.fromCharCode(e.which); 
           self.setAttribute('key', String.fromCharCode(e.which));
           shouldFindNext = true;
       } else if ( isDigit(String.fromCharCode(e.which) ) ) {
           if ( topLeftText.textContent.length == 0) {
               topLeftText.textContent = String.fromCharCode(e.which);
           } else {
               topLeftText.textContent = topLeftText.textContent + String.fromCharCode(e.which);
           }
       } else {
           centerText.textContent = "";
           topLeftText.textContent = "";
           self.setAttribute('key', "");
       }
       self.classList.remove("selected");
       self.setAttribute('selected', false);
       window.removeEventListener('keydown', arguments.callee);
       if (shouldFindNext) {
           findNextCell( self ); // JS doesn't support multithreading, however tables shouldnt be big enough to cause huge memory issues
       }
   });
}

function findNextCell( currentCell ) {
    x = parseInt(currentCell.getAttribute('col'));
    y = parseInt(currentCell.getAttribute('row'));
    if (typingDirection == 0) {
        console.log("Finding horizontal cell");
        var cells = Array.from(document.getElementsByClassName("cell"));
        var currentRowCells = cells.filter(cell => parseInt(cell.getAttribute('row')) == y);
        var nextCellIndex = currentRowCells.findIndex(cell => cell == currentCell) + 1;
    
        if (nextCellIndex < currentRowCells.length) {
            var nextCell = currentRowCells[nextCellIndex];
            var selectEvent = new CustomEvent('select');
            nextCell.dispatchEvent(selectEvent);
        }
    } else {
        console.log("Finding vertical cell");
        var cells = Array.from(document.getElementsByClassName("cell"));
        var currentColCells = cells.filter(cell => parseInt(cell.getAttribute('col')) == x);
        var nextCellIndex = currentColCells.findIndex(cell => cell == currentCell) + 1;
    
        if (nextCellIndex < currentColCells.length) {
            var nextCell = currentColCells[nextCellIndex];
            var selectEvent = new CustomEvent('select');
            nextCell.dispatchEvent(selectEvent);
        }
    }
}

function saveTableAsImage() {
    console.log("Saving");
    let tableElement = document.querySelector('table'); // Select the table element
    html2canvas(tableElement).then(function(canvas) {
       // Convert the canvas to a base64 string
       let dataUrl = canvas.toDataURL();
       
       // Create a link element
       let link = document.createElement('a');
       
       // Set the href attribute of the link element to the base64 string
       link.href = dataUrl;
       
       // Set the download attribute of the link element to the desired filename
       link.download = 'crossword.png';
       
       // Create and simulate link click
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
    });
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
    var cells = document.getElementsByClassName("cell");
    for(var i = 0; i < cells.length; i++) {
       cells[i].setAttribute('selected', false);
       cells[i].classList.remove("selected");
   }
}

/*
    Create buttons 
*/

function createKeyButton() {
    // Create the button
   var button = document.createElement('button');
   button.id = 'keyButton';
   button.textContent = 'Hide characters';
   document.body.appendChild(button);
   button.addEventListener('click', toggleShow);
}

function createBlackoutButton() {
    var button = document.createElement('button');
    button.id = 'blackoutButton';
    button.textContent = 'Blackout unused squares';

    document.body.appendChild(button);

    button.addEventListener('click',toggleBlackout);
}

function createDirectionButtonEvent() {
    button = document.getElementById('directionButton');
    button.addEventListener('click',toggleDirection);
}

function createSaveButtonEvent() {
    button = document.getElementById('saveButton');
    button.addEventListener('click',saveTableAsImage);
}
/*
    Input Functions
*/

function initAllInputs() {
    createKeyButton();
    createBlackoutButton();
    createDirectionButtonEvent();
}

/*
    Button Functions
*/

function showKey( cell ) {
    var centerText = cell.querySelector('.innerCellText');
    centerText.textContent = cell.getAttribute('key');  
}

function showTableKey() {
    button = document.getElementById('keyButton');
    button.textContent = "Hide characters";
    areHidden = true;
    var cells = document.getElementsByClassName("cell");
    for(var i = 0; i < cells.length; i++) {
       showKey( cells[i] );
   }
}

function toggleShow() {
    if (areHidden) {
        clearTable();
        button = document.getElementById('keyButton');
        button.textContent = "Show key";
        areHidden = false;
    } else {
        showTableKey(); // Other things are defined within function
    }
}

function toggleDirection() {
    if (typingDirection == 0) {
        button = document.getElementById('directionButton');
        button.textContent = "Toggle to vertical direction";
        typingDirection = 1;
        console.log("Changed direction to vertical");
    } else {
        button = document.getElementById('directionButton');
        button.textContent = "Toggle to horizontal direction";
        typingDirection = 0;
        console.log("Changed direction to horizontal");
    }
}

function toggleBlackout() {
    if (isBlackout) {
        unBlackoutAll();
        button = document.getElementById('blackoutButton');
        button.textContent = "Blackout unused squares";
        isBlackout = false;
    } else {
        blackoutUnusedSquares();
        button = document.getElementById('blackoutButton');
        button.textContent = "Remove blackout";
        isBlackout = true;
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

createEditableTable();

window.onload = function () {
    createSaveButtonEvent();
    console.log("Creating event");
}
