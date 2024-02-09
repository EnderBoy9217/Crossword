/*
    File Scope Variables
*/

/*
    Most recent changelog:
*/
var table = document.getElementById('crosswordTable');

var isBlackout = false; // If all unused squares are currently blacked out
var areHidden = false; // If the answers are currently hidden
var typingDirection = 0; // Current typing direction (0 = across, 1 = down)
var highestAcross = 0; // Current highest down number
var highestDown = 0; // Current highest across number

/*
    End of File Scope Variables
*/

function createEditableTable() {
    length = 15;
    width = 15;
    table.setAttribute('rows', 15);
    table.setAttribute('cols',15);
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
    table.setAttribute('rows', length );
    table.setAttribute('cols', width );
    for(var y=0; y<length; y++){
        var tr = document.createElement('tr');
        for(var x=0; x<width; x++){
            var td = document.createElement('td');
            td.setAttribute('row', y);
            td.setAttribute('col', x);
            td.setAttribute('class', "cell");
            td.setAttribute('selected', false);
            td.setAttribute('key', "");
            td.setAttribute('found', false);
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

function createNewTableWithSize( length, width ) {
    table.innerHTML = '';
    table.setAttribute('rows', length );
    table.setAttribute('cols', width );
    for(var y=0; y<length; y++){
        var tr = document.createElement('tr');
        for(var x=0; x<width; x++){
            var td = document.createElement('td');
            td.setAttribute('row', y);
            td.setAttribute('col', x);
            td.setAttribute('class', "cell");
            td.setAttribute('selected', false);
            td.setAttribute('key', "");
            td.setAttribute('found', false);
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
    if ( areHidden ) {
        showTableKey();
    }
    self.classList.add("selected");
    self.setAttribute('selected', true);
    document.getElementById("hiddenInput").focus();
    var centerText = self.querySelector('.innerCellText');
    var topLeftText = self.querySelector('.topLeftText');
    var isTyping = false;
    window.addEventListener('keydown', function(e) { 
        if ( isTyping ) { //Prevent double-input (#2)
            return;
        }
        isTyping = true;
        if (self.getAttribute('selected') == "false") return; 
        e.preventDefault();
        if ( isAlphabetic(String.fromCharCode(e.which) ) ) {  // Letter
            centerText.textContent = String.fromCharCode(e.which); 
            self.setAttribute('key', String.fromCharCode(e.which));
            if ( findNextCell( self, true, typingDirection, false ) == undefined || ( findNextCell( self, true, typingDirection, false ).getAttribute('key') == '' && topLeftText.textContent.length == 0 ) ) { // Previous cell is empty and no number on this cell
                if ( topLeftText.textContent == "" ) {
                    if ( typingDirection == 0 ) {
                        highestAcross += 1;
                        topLeftText.textContent = highestAcross;
                    } else {
                        highestDown += 1;
                        topLeftText.textContent = highestDown;
                    }
                }
            }
            shouldFindNext = true;
        } else if ( isDigit(String.fromCharCode(e.which) ) ) { // Number
            if ( topLeftText.textContent.length == 1) {
                topLeftText.textContent = topLeftText.textContent + String.fromCharCode(e.which);
            } else {
                topLeftText.textContent = String.fromCharCode(e.which);
                if ( parseInt(topLeftText.textContent) == 0) {
                    topLeftText.textContent = "";
                }
            }
            if ( typingDirection == 0 ) { // Across
                if ( parseInt(topLeftText.textContent) > highestAcross ) {
                    highestAcross = parseInt(topLeftText.textContent);
                }
            } else {
                if ( parseInt(topLeftText.textContent) > highestDown ) {
                    highestDown = parseInt(topLeftText.textContent);
                }
            }
            shouldFindSelf = true;
        } else if (e.which == 8) { // Backspace
            if ( parseInt(topLeftText.textContent) == highestAcross && typingDirection == 0 ) {
                highestAcross -= 1;
            } else if ( parseInt(topLeftText.textContent) == highestDown && typingDirection == 1 ) {
                highestDown -= 1;
            }
            centerText.textContent = "";
            topLeftText.textContent = "";
            self.setAttribute('key', "");
            shouldFindPrevious = true;
        } else if (e.which == 32) { // Space
            if ( parseInt(topLeftText.textContent) == highestAcross && typingDirection == 0 ) {
                highestAcross -= 1;
            } else if ( parseInt(topLeftText.textContent) == highestDown && typingDirection == 1 ) {
                highestDown -= 1;
            }
            centerText.textContent = "";
            topLeftText.textContent = "";
            self.setAttribute('key', "");
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
            if ( parseInt(topLeftText.textContent) == highestAcross && typingDirection == 0 ) {
                highestAcross -= 1;
            } else if ( parseInt(topLeftText.textContent) == highestDown && typingDirection == 1 ) {
                highestDown -= 1;
            }
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
    length = parseInt( table.getAttribute('rows') );
    width = parseInt( table.getAttribute('cols') );
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
            if ( select && nextCell != undefined ) {
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
            if ( select && nextCell != undefined ) {
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

function saveTableAsImage() {
    deSelectAll();
    console.log("Saving");
    generateAnswers();

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
        img.src = './assets/logo.png'; // replace with your image path

        // Set other attributes if needed
        img.alt = 'Image Description';
        img.width = 150; // 3:2 ratio
        img.height = 100;
        img.classList.add("flex");
        
        parentDiv.appendChild(img);
        console.log("Adding logo");
    }

    var titleElement = document.getElementById('cswdTitle');
    let clonedTitle = titleElement.cloneNode(true);
    parentDiv.appendChild(clonedTitle);

    var authorText = document.getElementById('authorText');
    let clonedAuthor = authorText.cloneNode(true);
    clonedAuthor.innerHTML = "Created By: " + authorText.innerHTML;
    parentDiv.appendChild(clonedAuthor);

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
        var fileName = titleElement.innerHTML;
        link.download = fileName + '.png';

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

function saveTableAsFile() {
    deSelectAll();
    console.log("Saving as file");
    var parentDiv = document.createElement('div');
    var table = document.getElementById('crosswordTable');
    var authorText = document.getElementById("authorText");
    table.setAttribute("author", authorText.innerHTML);
    var clonedTable = table.cloneNode(true);
    var clonedAcrossHints = document.getElementById("acrossHintList").cloneNode(true);
    var clonedDownHints = document.getElementById("downHintList").cloneNode(true);

    parentDiv.appendChild(clonedTable);
    parentDiv.appendChild(clonedAcrossHints);
    parentDiv.appendChild(clonedDownHints);
    var blob = new Blob([parentDiv.outerHTML], { type: 'text/plain' });
    var titleElement = document.getElementById('cswdTitle');
    var fileName = titleElement.innerHTML;
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".cswd";
    link.click();
    URL.revokeObjectURL(link.href);
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
            console.error('Not a valid file! No table element was found!');
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
        authorText.innerHTML = tableElement.getAttribute("author");

        // Re-add Event listeners to cells
        var cells = Array.from(document.getElementsByClassName("cell"));
        cells.forEach(function(cell) {
            cell.addEventListener('click',cellOnClick);
            cell.addEventListener('select',cellOnClick);
        })
        generateAnswers();
    }
    
    reader.readAsText(file);

    if ( isBlackout ) {
        toggleBlackout()
    }

    if ( areHidden ) {
        showTableKey();
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
    var cells = document.getElementsByClassName("selected");
    while (cells.length >  0) {
        cells[0].setAttribute('selected', false);
        cells[0].classList.remove("selected");
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

function createFileButtonEvent() {
    button = document.getElementById('fileButton');
    button.className = 'spreadButton'; // CSS Styling
    button.addEventListener('click',saveTableAsFile);
}

function createUploadEvent() {
    button = document.getElementById('cswdUpload');
    button.addEventListener('change', uploadFileEvent );
}

function createSizesEvent() {
    select = document.getElementById('sizes');
    select.addEventListener('change',createNewTable);
}

/*
    Input Functions
*/

function initAllInputs() { // Fires after table is created
    createKeyButtonEvent();
    createBlackoutButtonEvent();
    createDirectionButtonEvent();
    createSaveButtonEvent();
    createFileButtonEvent();
    createSizesEvent();
    createUploadEvent();
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
    if ( areHidden ) {
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

createEditableTable();