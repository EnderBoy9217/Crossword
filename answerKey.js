function initDownAnswers() {
    downAnswerButton = document.getElementById('downAnswerButton');
    downAnswerButton.addEventListener('click', createDownAnswer);
    downAnswerClearButton = document.getElementById('clearDownAnswerList');
    downAnswerClearButton.addEventListener('click', clearDownList)
    downNumberButton = document.getElementById('numberDownAnswers');
    downNumberButton.addEventListener('click', changeDownAnswerNumbering);
}

function initAcrossAnswers() {
    acrossAnswerButton = document.getElementById('acrossAnswerButton');
    acrossAnswerButton.addEventListener('click', createAcrossAnswer);
    acrossAnswerClearButton = document.getElementById('clearAcrossAnswerList');
    acrossAnswerClearButton.addEventListener('click', clearAcrossList);
    acrossNumberButton = document.getElementById('numberAcrossAnswers');
    acrossNumberButton.addEventListener('click', changeAcrossAnswerNumbering);
}

function createDownAnswer() {
    downAnswerList = document.getElementById('downAnswerList');
    downAnswerInput = document.getElementById('downAnswer');
    var textValue = downAnswerInput.value;
    var newItem = document.createElement("li");
    newItem.textContent = textValue;
    downAnswerList.appendChild(newItem);
    downAnswerInput.value = '';
}

function createAcrossAnswer() {
    acrossAnswerList = document.getElementById('acrossAnswerList');
    acrossAnswerInput = document.getElementById('acrossAnswer');
    var textValue = acrossAnswerInput.value;
    var newItem = document.createElement("li");
    newItem.textContent = textValue;
    acrossAnswerList.appendChild(newItem);
    acrossAnswerInput.value = '';
}

function clearDownList() {
    downAnswerList = document.getElementById('downAnswerList');
    downAnswerList.innerHTML = '';
}

function clearAcrossList() {
    acrossAnswerList = document.getElementById('acrossAnswerList');
    acrossAnswerList.innerHTML = '';
}

function changeDownAnswerNumbering() {
    downHintList = document.getElementById('downAnswerList');
    downNumberButton = document.getElementById('numberDownAnswers');
    if (downHintList.classList.contains("noBullets") ) {
        downHintList.classList.remove("noBullets");
        downNumberButton.textContent = "Remove automatic numbering";
    } else {
        downHintList.classList.add("noBullets");
        downNumberButton.textContent = "Add numbers automatically";
    }
}

function changeAcrossAnswerNumbering() {
    acrossHintList = document.getElementById('acrossAnswerList');
    acrossNumberButton = document.getElementById('numberAcrossAnswers');
    if (acrossHintList.classList.contains("noBullets") ) {
        acrossHintList.classList.remove("noBullets");
        acrossNumberButton.textContent = "Remove automatic numbering";
    } else {
        acrossHintList.classList.add("noBullets");
        acrossNumberButton.textContent = "Add numbers automatically";
        
    }
}

function initAnswerInputBoxes() {
    acrossAnswerInput = document.getElementById('acrossAnswer');
    acrossAnswerInput.addEventListener('focus', function() {
        deSelectAll();
    });
    acrossAnswerInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("acrossAnswerButton").click();
        }
    });
    downAnswerInput = document.getElementById('downAnswer');
    downAnswerInput.addEventListener('focus', function() {
        deSelectAll();
    });
    downAnswerInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("downAnswerButton").click();
        }
    });
}

initDownAnswers();
initAcrossAnswers();
initAnswerInputBoxes();