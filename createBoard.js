/*
    File Scope Variables
*/

var table = document.getElementById('crosswordTable');

isBlackout = false;
areHidden = false;
typingDirection = 0; // 0 = across, 1 = down
size = 15;

// Create hidden input for mobile users
var hiddenInput = document.createElement('input');
hiddenInput.style.position = 'absolute';
hiddenInput.style.opacity = '0';
document.body.appendChild(hiddenInput);

/*
    End of File Scope Variables
*/

function createEditableTable() {
    for(var y=0; y<size; y++){
        var tr = document.createElement('tr');
        for(var x=0; x<size; x++){
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

function cellOnClick( event ) {
   shouldFindNext = false;
   shouldFindPrevious = false;
   shouldFindSelf = false;
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
           if ( topLeftText.textContent.length == 1) {
               topLeftText.textContent = topLeftText.textContent + String.fromCharCode(e.which);
           } else {
               topLeftText.textContent = String.fromCharCode(e.which);
               shouldFindSelf = true;
           }
       } else if (e.which == 8) {
           centerText.textContent = "";
           topLeftText.textContent = "";
           self.setAttribute('key', "");
           shouldFindPrevious = true;
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
       else if (shouldFindPrevious) {
           findNextCell( self, true );
       }
       else if (shouldFindSelf) {
           findCurrentCell( self );
       }
   });
}

function findCurrentCell( currentCell ) {
    var selectEvent = new CustomEvent('select');
    currentCell.dispatchEvent(selectEvent);
}

function findNextCell( currentCell, backwards = false ) {
    x = parseInt(currentCell.getAttribute('col'));
    y = parseInt(currentCell.getAttribute('row'));
    if (typingDirection == 0) {
        var cells = Array.from(document.getElementsByClassName("cell"));
        var currentRowCells = cells.filter(cell => parseInt(cell.getAttribute('row')) == y);
        if (!backwards) {
            var nextCellIndex = currentRowCells.findIndex(cell => cell == currentCell) + 1;
        } else {
            var nextCellIndex = currentRowCells.findIndex(cell => cell == currentCell) - 1;
        }
        
        if (nextCellIndex < currentRowCells.length) {
            var nextCell = currentRowCells[nextCellIndex];
            var selectEvent = new CustomEvent('select');
            nextCell.dispatchEvent(selectEvent);
        }
    } else {
        var cells = Array.from(document.getElementsByClassName("cell"));
        var currentColCells = cells.filter(cell => parseInt(cell.getAttribute('col')) == x);
        if (!backwards) {
            var nextCellIndex = currentColCells.findIndex(cell => cell == currentCell) + 1;
        } else {
            var nextCellIndex = currentColCells.findIndex(cell => cell == currentCell) - 1;
        }
        if (nextCellIndex < currentColCells.length) {
            var nextCell = currentColCells[nextCellIndex];
            var selectEvent = new CustomEvent('select');
            nextCell.dispatchEvent(selectEvent);
        }
    }
}

function saveTableAsImage() {
    console.log("Saving");

    answerKeyButton = document.getElementById("answerKeySave");
    logoButton = document.getElementById("logoSave");

    // Create a new parent div
    let parentDiv = document.createElement('div');
    parentDiv.id = 'captureParent'; // Give it a unique ID
    parentDiv.style.width = 'fit-content';

    let flexDescriptionContainer = document.createElement('div');
    flexDescriptionContainer.style.display = 'flex';
    flexDescriptionContainer.style.justifyContent = 'flex-start';
    flexDescriptionContainer.style.gap = '200px';

    let flexListContainer = document.createElement('div');
    flexListContainer.style.display = 'flex';
    flexListContainer.style.justifyContent = 'flex-start';
    flexListContainer.style.gap = '200px';

    let flexTitleContainer = document.createElement('div');
    /*
    flexTitleContainer.style.display = 'flex';
    flexTitleContainer.style.justifyContent = 'flex-start';
    flexTitleContainer.style.gap = '200px';
    */

    let flexAnswerDescriptionContainer = document.createElement('div');
    flexAnswerDescriptionContainer.style.display = 'flex';
    flexAnswerDescriptionContainer.style.justifyContent = 'flex-start';
    flexAnswerDescriptionContainer.style.gap = '200px';

    let flexAnswerContainer = document.createElement('div');
    flexAnswerContainer.style.display = 'flex';
    flexAnswerContainer.style.justifyContent = 'flex-start';
    flexAnswerContainer.style.gap = '200px';

    if ( logoButton.checked ) {
        let img = document.createElement('img');

        // Set the source of the image
        img.src = './assets/crossword.png'; // replace with your image path

        // Set other attributes if needed
        img.alt = 'Image Description';
        img.width = 150; // 3:2 ratio
        img.height = 100;
        
        parentDiv.appendChild(img);
        console.log("Adding logo");
    }

    let elementsToCapture = ['#crosswordTable'];
    elementsToCapture.forEach((selector) => {
        let element = document.querySelector(selector);
        if (element) {
            let clonedElement = element.cloneNode(true);
            clonedElement.style.marginLeft = '0px';
            clonedElement.style.marginRight = 'auto';
            parentDiv.appendChild(clonedElement);
        }
    });

    let descriptionsToCapture = ['#acrossDescription','#downDescription'];
    descriptionsToCapture.forEach((selector) => {
        let element = document.querySelector(selector);
        if (element) {
            let clonedElement = element.cloneNode(true);
            flexDescriptionContainer.appendChild(clonedElement);
        }
    });

    let listsToCapture = ['#acrossHintList','#downHintList'];
    listsToCapture.forEach((selector) => {
        let element = document.querySelector(selector);
        if (element) {
            let clonedElement = element.cloneNode(true);
            flexListContainer.appendChild(clonedElement);
        }
    });

    let answerTitleToCapture = ['#answerTitle'];
    answerTitleToCapture.forEach((selector) => {
        let element = document.querySelector(selector);
        if (element) {
            let clonedElement = element.cloneNode(true);
            flexTitleContainer.appendChild(clonedElement);
        }
    });

    let answersDescriptionsToCapture = ['#acrossAnswerDescription','#downAnswerDescription'];
    answersDescriptionsToCapture.forEach((selector) => {
        let element = document.querySelector(selector);
        if (element) {
            let clonedElement = element.cloneNode(true);
            flexAnswerDescriptionContainer.appendChild(clonedElement);
        }
    });

    let answersToCapture = ['#acrossAnswerList','#downAnswerList'];
    answersToCapture.forEach((selector) => {
        let element = document.querySelector(selector);
        if (element) {
            let clonedElement = element.cloneNode(true);
            flexAnswerContainer.appendChild(clonedElement);
        }
    });

    parentDiv.appendChild(flexDescriptionContainer);

    parentDiv.appendChild(flexListContainer);

    if ( answerKeyButton.checked ) {
        parentDiv.appendChild(flexTitleContainer);
        parentDiv.appendChild(flexAnswerDescriptionContainer);
        parentDiv.appendChild(flexAnswerContainer);
        console.log("Adding answer key");
    }

    // Append the parent div to the body
    document.body.appendChild(parentDiv);

    // Select the parent div
    let tableElement = document.querySelector('#captureParent'); // Select it using its unique ID

    html2canvas(tableElement).then(function(canvas) {
        // Convert the canvas to a base64 string
        let dataUrl = canvas.toDataURL();

        // Create a link element
        let link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'crossword.png';

        // Create and simulate link click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Remove the parent div from the body
        document.body.removeChild(parentDiv);
        }).catch(function(error) {
            console.error('An error occurred while capturing the table:', error);
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
    var cells = document.getElementsByClassName("selected");
    for(var i = 0; i < cells.length; i++) {
       cells[i].setAttribute('selected', false);
       cells[i].classList.remove("selected");
   }
}

/*
    Create buttons 
*/

function createKeyButtonEvent() {
    button = document.getElementById('keyButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',toggleShow);
}

function createBlackoutButtonEvent() {
    button = document.getElementById('blackoutButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',toggleBlackout);
}

function createDirectionButtonEvent() {
    button = document.getElementById('directionButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',toggleDirection);
}

function createSaveButtonEvent() {
    button = document.getElementById('saveButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',saveTableAsImage);
}
/*
    Input Functions
*/

function initAllInputs() {
    createKeyButtonEvent();
    createBlackoutButtonEvent();
    createDirectionButtonEvent();
    createSaveButtonEvent();
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
        button.textContent = "Type Across";
        typingDirection = 1;
    } else {
        button = document.getElementById('directionButton');
        button.textContent = "Type Down";
        typingDirection = 0;
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