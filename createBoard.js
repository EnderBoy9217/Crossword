var table = document.createElement('table');
table.id = 'board'; // Assign the id here

var hiddenInput = document.createElement('input');
hiddenInput.style.position = 'absolute';
hiddenInput.style.opacity = '0';
document.body.appendChild(hiddenInput);

function createEditableTable() {
    for(var y=0; y<15; y++){
     var tr = document.createElement('tr');
     for(var x=0; x<15; x++){
      var td = document.createElement('td');
      td.setAttribute('row', x);
      td.setAttribute('col', y);
      td.setAttribute('class', "cell");
      td.setAttribute('selected', false);
      td.setAttribute('key', "");
      td.setAttribute('py-click', "CC.cellClick"); // Executes python function
      td.addEventListener('click', function() {
          var self = this;
          deSelectAll();
          self.classList.add("selected");
          self.setAttribute('selected', true);
          hiddenInput.focus();
          window.addEventListener('keydown', function(e) { //
              if (self.getAttribute('selected') == "false") return; //Prevents the cell from accepting a value if it is no longer selected
              
              e.preventDefault(); // Prevents other keyboard inputs
              if( isAlphabetic(String.fromCharCode(e.which)) ) { 
                  self.innerHTML = String.fromCharCode(e.which); // Inserts character
                  self.setAttribute('key', String.fromCharCode(e.which));
                  
              } else {
                  self.innerHTML = ""; // Clears cell on non-alphabetic character
                  self.setAttribute('key', "");
              }
              self.classList.remove("selected");
              self.setAttribute('selected', false);
              window.removeEventListener('keydown', arguments.callee);
          });
      });
      tr.appendChild(td);
     }
     table.appendChild(tr);
    }
    document.body.appendChild(table);
    createHideButton();
    createKeyButton();
}

function isAlphabetic(char) {
   return char.toLowerCase() !== char.toUpperCase();
}

function deSelectAll() {
    var cells = document.getElementsByClassName("cell");
    for(var i = 0; i < cells.length; i++) {
       cells[i].setAttribute('selected', false);
       cells[i].classList.remove("selected");
   }
}

function createHideButton() {
    // Create the button
   var button = document.createElement('button');
   button.id = 'hideButton';
   button.textContent = 'Hide characters';

   // Append the button to the body
   document.body.appendChild(button);

   // Add the event listener to the button
   button.addEventListener('click', clearTable);
}

function createKeyButton() {
    // Create the button
   var button = document.createElement('button');
   button.id = 'keyButton';
   button.textContent = 'Show key';

   // Append the button to the body
   document.body.appendChild(button);

   // Add the event listener to the button
   button.addEventListener('click', showTableKey);
}

function showTableKey() {
    var cells = document.getElementsByClassName("cell");
    for(var i = 0; i < cells.length; i++) {
       showKey( cells[i] );
   }
}

function showKey( cell ) {
    cell.innerHTML = cell.getAttribute('key');
    
}

function clearTable() {
   var cells = document.getElementsByClassName("cell");
   for(var i = 0; i < cells.length; i++) {
       cells[i].innerHTML = "";
   }
}

createEditableTable();
