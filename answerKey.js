function initDownAnswers() {
    downAnswerButton = document.getElementById('downAnswerButton');
    downAnswerButton.addEventListener('click', createDownAnswer);
    downAnswerClearButton = document.getElementById('clearDownAnswerList');
    downAnswerClearButton.addEventListener('click', clearDownList)
}

function initAcrossAnswers() {
    acrossAnswerButton = document.getElementById('acrossAnswerButton');
    acrossAnswerButton.addEventListener('click', createAcrossAnswer);
    acrossAnswerClearButton = document.getElementById('clearAcrossAnswerList');
    acrossAnswerClearButton.addEventListener('click', clearAcrossList)
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

initDownAnswers();
initAcrossAnswers();
