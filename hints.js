function initDownHints() {
    downHintButton = document.getElementById('downHintButton');
    downHintButton.addEventListener('click', createDownHint);
    downHintClearButton = document.getElementById('clearDownList');
    downHintClearButton.addEventListener('click', clearDownList);
    downNumberButton = document.getElementById('numberDownList');
    downNumberButton.addEventListener('click', changeDownNumbering);
    downDeleteButton = document.getElementById('deleteDownList');
    downDeleteButton.addEventListener('click',removeLastDownItem);
}

function initAcrossHints() {
    acrossHintButton = document.getElementById('acrossHintButton');
    acrossHintButton.addEventListener('click', createAcrossHint);
    acrossHintClearButton = document.getElementById('clearAcrossList');
    acrossHintClearButton.addEventListener('click', clearAcrossList);
    acrossNumberButton = document.getElementById('numberAcrossList');
    acrossNumberButton.addEventListener('click', changeAcrossNumbering);
    acrossDeleteButton = document.getElementById('deleteAcrossList');
    acrossDeleteButton.addEventListener('click',removeLastAcrossItem);
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

function changeDownNumbering() {
    downHintList = document.getElementById('downHintList');
    downNumberButton = document.getElementById('numberDownList');
    if (downHintList.classList.contains("noBullets") ) {
        downHintList.classList.remove("noBullets");
        downNumberButton.textContent = "Remove automatic numbering";
    } else {
        downHintList.classList.add("noBullets");
        downNumberButton.textContent = "Add numbers automatically";
    }
}

function changeAcrossNumbering() {
    acrossHintList = document.getElementById('acrossHintList');
    acrossNumberButton = document.getElementById('numberAcrossList');
    if (acrossHintList.classList.contains("noBullets") ) {
        acrossHintList.classList.remove("noBullets");
        acrossNumberButton.textContent = "Remove automatic numbering";
    } else {
        acrossHintList.classList.add("noBullets");
        acrossNumberButton.textContent = "Add numbers automatically";
        
    }
}

function removeLastAcrossItem() {
    acrossHintList = document.getElementById('acrossHintList');
    var lastListItem = acrossHintList.lastElementChild;
    if (lastListItem) {
        acrossHintList.removeChild(lastListItem);
    }
}

function removeLastDownItem() {
    downHintList = document.getElementById('downHintList');
    var lastListItem = downHintList.lastElementChild;
    if (lastListItem) {
        downHintList.removeChild(lastListItem);
    }
}

function initInputBoxes() {
    downHintInput = document.getElementById('downHint');
    downHintInput.addEventListener('focus', function() {
        deSelectAll();
    });
    downHintInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("downHintButton").click();
        }
    });
    acrossHintInput = document.getElementById('acrossHint');
    acrossHintInput.addEventListener('focus', function() {
        deSelectAll();
    });
    acrossHintInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("acrossHintButton").click();
        }
    });
}

initDownHints();
initAcrossHints();
initInputBoxes();