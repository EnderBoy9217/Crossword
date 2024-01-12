# main.py
from js import document

class CrossWordCreator:

    def cellClick(self,event):
        x = int(event.target.getAttribute('row'))
        y = int(event.target.getAttribute('col'))
        key = event.target.getAttribute('key')
        print("Clicked " + str(x) + ", " + str(y) + " Key: " + key)
        
    

def toggle_terminal(event):
    terminal = document.getElementById('terminal')
    if terminal.style.display == 'none':
        terminal.style.display = 'block'  # Show the terminal
        event.target.textContent = 'Hide terminal'
    else:
        terminal.style.display = 'none'  # Hide the terminal
        event.target.textContent = 'Show terminal'


def main():
    print("Python didn't crash (yay)")
    
main()
CC = CrossWordCreator()
