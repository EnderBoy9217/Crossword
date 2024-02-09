var minLength = 2;

function loadAcrossKey() {
    console.log("Loading across key");
    var acrossArray = [];
    var table = document.getElementById('crosswordTable');
    var cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(function(cell) {
        var currentAnswer = "";
        var topLeftText = cell.querySelector('.topLeftText').textContent;
        var centerText = cell.querySelector('.innerCellText').textContent;
        if ( topLeftText != "" ) {
            var number = parseInt(topLeftText);
            currentAnswer = centerText.toUpperCase();
            var endOfWord = false;
            var validWord = true;
            var currentCell = cell;
            while ( !endOfWord ) {
                var newCell = findNextCell(currentCell, false, 0, false)
                if ( newCell == undefined ) { // End of board
                    endOfWord = true;
                } else if (newCell.classList.contains("blackout") ) { // Next cell is blacked out
                    endOfWord = true;
                } else if ( newCell.querySelector('.innerCellText').textContent == "" ) { // Empty Cell
                    endOfWord = true;
                } else if ( newCell.classList.contains("used0") ) {
                    endOfWord = true;
                    validWord = false;
                } else {
                    var newText = newCell.querySelector('.innerCellText').textContent;
                    newCell.classList.add("used0");
                    currentAnswer += newText.toLowerCase();
                    currentCell = newCell;
                }
            }
            if ( currentAnswer.length >= minLength && validWord) { // All words must be greater than 2 characters
                acrossArray.push({ index: number, answer: currentAnswer } );
            }
        }
    })
    sortedAcrossArray = sortByIndex(acrossArray);
    console.log(sortedAcrossArray);
    return sortedAcrossArray;
}

function changeMinLength( length ) {
    minLength = length;
}

function loadDownKey() {
    console.log("Loading down key");
    var downArray = [];
    var cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(function(cell) {
        var currentAnswer = "";
        var topLeftText = cell.querySelector('.topLeftText').textContent;
        var centerText = cell.querySelector('.innerCellText').textContent;
        if ( topLeftText != "" ) {
            var number = parseInt(topLeftText);
            currentAnswer = centerText.toUpperCase();
            var endOfWord = false;
            var validWord = true;
            var currentCell = cell;
            while ( !endOfWord ) {
                var newCell = findNextCell(currentCell, false, 1, false)
                if ( newCell == undefined ) { // End of board
                    endOfWord = true;
                } else if (newCell.classList.contains("blackout") ) { // Next cell is blacked out
                    endOfWord = true;
                } else if ( newCell.querySelector('.innerCellText').textContent == "" ) { // Empty Cell
                    endOfWord = true;
                } else if ( newCell.classList.contains("used1") ) {
                    endOfWord = true;
                    validWord = false;
                } else {
                    var newText = newCell.querySelector('.innerCellText').textContent;
                    newCell.classList.add("used1");
                    currentAnswer += newText.toLowerCase();
                    currentCell = newCell;
                }
            }
            if ( currentAnswer.length >= minLength && validWord ) { // All words must be greater than 2 characters
                downArray.push( { index: number, answer: currentAnswer } );
            }
        }
    })
    sortedDownArray = sortByIndex(downArray);
    console.log(sortedDownArray);
    return sortedDownArray;
}

function arrayToListItems(array, list) {

    // Clear existing list items
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    // Create new list items for each object in the array
    array.forEach((item) => {
        var li = document.createElement('li');
        li.textContent = `${item.index}: ${item.answer}`;
        list.appendChild(li);
    });
}

function resetUsed0() {
    var cells = document.getElementsByClassName("used0");
    while (cells.length >  0) {
        cells[0].classList.remove("used0");
    }
}

function resetUsed1() {
    var cells = document.getElementsByClassName("used1");
    while (cells.length >  0) {
        cells[0].classList.remove("used1");
    }
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.index - b.index);
}

function generateAnswers() {
    var acrossList = document.getElementById("acrossAnswerList");
    var downList = document.getElementById("downAnswerList")
    var acrossAnswers = loadAcrossKey();
    var downAnswers = loadDownKey();
    resetUsed0();
    resetUsed1();
    arrayToListItems( acrossAnswers, acrossList );
    arrayToListItems( downAnswers, downList );
}

function initAnswerKeyGeneration() {
    generateAnswerButton = document.getElementById('generateAnswersButton');
    generateAnswerButton.addEventListener('click', generateAnswers);
}

function initAnswerKeySave() {
    saveAnswerButton = document.getElementById('saveAnswersButton');
    saveAnswerButton.addEventListener('click', saveKeyAsImage);
}

function initAnswerKeyButtons() {
    initAnswerKeyGeneration();
    initAnswerKeySave();
}

function saveKeyAsImage() {
    console.log("Saving");

    // Create a new parent div
    let parentDiv = document.createElement('div');
    parentDiv.id = 'captureParent'; // Give it a unique ID
    parentDiv.style.width = 'fit-content';

    let flexTitleContainer = document.createElement('div');

    let flexAnswerDescriptionContainer = document.createElement('div');
    flexAnswerDescriptionContainer.style.display = 'flex';
    flexAnswerDescriptionContainer.style.justifyContent = 'flex-start';
    flexAnswerDescriptionContainer.style.gap = '200px';

    let flexAnswerContainer = document.createElement('div');
    flexAnswerContainer.style.display = 'flex';
    flexAnswerContainer.style.justifyContent = 'flex-start';
    flexAnswerContainer.style.gap = '200px';

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


    parentDiv.appendChild(flexTitleContainer);
    parentDiv.appendChild(flexAnswerDescriptionContainer);
    parentDiv.appendChild(flexAnswerContainer);

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
        var titleElement = document.getElementById('cswdTitle');
        var fileName = titleElement.innerHTML + " Key";
        link.download = fileName + '.png';

        // Create and simulate link click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Remove the parent div from the body
        document.body.removeChild(parentDiv);
        }).catch(function(error) {
            console.error('An error occurred while capturing the answer key:', error);
        });
}

initAnswerKeyButtons();