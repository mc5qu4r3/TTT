winCounter = {'X': 0, 'O': 0}; //Count number of wins for each player.
winCombination = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

chooseForNewGameButtons = [{text:'X', func: () => { newGame('X'); closeModal(); }},
                           {text:'O', func: () => { newGame('O'); closeModal(); }}];

function startGame() { openModal("Starting a new game!", "Who should start?", "information", chooseForNewGameButtons); }

function newGame(startPlayer) {

    //Reset logic.
    turn = startPlayer;
    clickedCell = 0; //Number of clicked cell (to know when all cell were clicked).
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']; //Logic state of the game board.
    gameEnded = false; //Indicate wether current round of the game has ended or not (to know if clicks on cells has meaning).

    //Reset view.
    document.getElementById("turn").innerHTML = turn; //Curent turn on the view.

    //Visual state of the board on the view.
    for(var i=0; i < board.length; i++)
        document.getElementById("c"+i).innerHTML = '';
}

function clickCell(num) {

    //Check if the game is still being played.
    if(!gameEnded) {

        //Check if current clicked cell is not available.
        if(board[num] != ' ')
            openModal("Oops!", "Clicked cell is already taken", "error", [{text:"OK", func: closeModal}]);
        else {

            board[num] = turn; //Update clicked cell on the logic board.
            document.getElementById("c"+num).innerText = turn; //Set clicked cell on the visual board.

            //Check if player won the game this turn.
            if(hasWon() == true) {

                gameEnded = true; //Player won - the game has ended.
                winCounter[turn]++; //Increase winning player logic wins counter.
                document.getElementById(turn+"Wins").innerText = winCounter[turn]; //Update visual wins counter.
                
                //Display winning message.
                openModal("Player " + turn + " has won this game!", "Who should start now?", "success", chooseForNewGameButtons);
            }
            else if(++clickedCell >= 9) { //Check if all cells are occupied.

                gameEnded = true; //All cells are occupied - game has ended.

                //Display tie message.
                openModal("Game ended with a tie!", "Who should start?", "information", chooseForNewGameButtons);
            }
            else {

                //Since the game is continue, move to next turn.
                turn = turn == 'X' ? 'O' : 'X'; //Switch to other player.
                document.getElementById("turn").innerText = turn; //Update visual curent turn on the view.
            }
        }
    }
}

//Check if there is a suitable winning combination on current state of the board.
function hasWon() {

    for(var i = 0; i < winCombination.length; i++)
        if(board[winCombination[i][0]] == turn && board[winCombination[i][1]] == turn && board[winCombination[i][2]] == turn)
            return true;
    
    return false;
}

function openModal(header, content, type, buttons) {

    //Set modal's properties.
    setModalType(type);
    injectModalButton(buttons);
    document.getElementById("modalHeader").innerText = header;
    document.getElementById("modalContent").innerText = content;
    
    //Make modal visible.
    document.getElementById("modal").style.display = "block";
}

function setModalType(type) {

    //Default classes for modal's container and header.
    msgHeaderString = "w3-container ";
    mdlContainerString = "w3-modal-content w3-animate-zoom w3-center ";

    //Append suitable classes according to given type.
    switch(type) {

        case "success":
            msgHeaderString += "w3-green";
            mdlContainerString += "w3-pale-green";
            break;
        case "information":
            msgHeaderString += "w3-blue";
            mdlContainerString += "w3-pale-blue";
            break;
        case "error":
            msgHeaderString += "w3-red";
            mdlContainerString += "w3-pale-red";
            break;
        default:
            break;
    }

    //Update modal's container and header classes according with new classes.
    document.getElementById("modalHeader").setAttribute("class", msgHeaderString);
    document.getElementById("modalContainer").setAttribute("class", mdlContainerString);
}

function injectModalButton(buttons) {

    //Get reference to modal's buttons container.
    var mbtn = document.getElementById("modalButtons");

    //Remove all buttons from the container.
    while (mbtn.firstChild) { mbtn.removeChild(mbtn.firstChild); }

    //Calculate the needed width for each button.
    var btnWidth = 100 / (buttons.length + (buttons.length - 1));

    for(var i=0; i < buttons.length; i++) {

        var cbtn = document.createElement("button"); //Create new button.
        cbtn.style = "width:" + btnWidth + "%"; //Set width with style attribute.

        //Set classes names.
        cbtn.className = "w3-button w3-border w3-margin-bottom";
        if(buttons.length > 1) { cbtn.className += i == 0 ? " w3-left" : " w3-right"; }
            
        cbtn.innerText = buttons[i].text; //Set button's text.
        cbtn.onclick = buttons[i].func; //Set button's on click function.        
        
        mbtn.appendChild(cbtn); //Append newly created button to modal.
    }
}

function closeModal() {

    //Make modal invisible.
    document.getElementById("modal").style.display = "none";
}