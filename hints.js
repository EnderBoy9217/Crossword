function initDownHints() {
    downHintButton = document.getElementById('downHintButton');
    downHintButton.addEventListener('click', createDownHint);
    downHintClearButton = document.getElementById('clearDownList');
    downHintClearButton.addEventListener('click', clearDownList)
}

function initAcrossHints() {
    acrossHintButton = document.getElementById('acrossHintButton');
    acrossHintButton.addEventListener('click', createAcrossHint);
    acrossHintClearButton = document.getElementById('clearAcrossList');
    acrossHintClearButton.addEventListener('click', clearAcrossList)
}

function createDownHint() {
    downHintList = document.getElementById('downHintList');
    downHintInput = document.getElementById('downHint');
    var textValue = downHintInput.value;
    var newItem = document.createElement("li");
    newItem.textContent = textValue;
    downHintList.appendChild(newItem);
    downHintInput.value = '';
}

function createAcrossHint() {
    acrossHintList = document.getElementById('acrossHintList');
    acrossHintInput = document.getElementById('acrossHint');
    var textValue = acrossHintInput.value;
    var newItem = document.createElement("li");
    newItem.textContent = textValue;
    acrossHintList.appendChild(newItem);
    acrossHintInput.value = '';
}

function clearDownList() {
    downHintList = document.getElementById('downHintList');
    downHintList.innerHTML = '';
}

function clearAcrossList() {
    acrossHintList = document.getElementById('acrossHintList');
    acrossHintList.innerHTML = '';
}

initDownHints();
initAcrossHints();
