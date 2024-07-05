
 

  // gameboard
  const GameBoard = (function() {

    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
        }
    };

    const resetBoard = ()=>{
        board = ["", "", "", "", "", "", "", "", ""];

    };

    return {
        getBoard,
        updateBoard,
        resetBoard

    };
})();


  //player

const Player = (name, marker) => {
    return { name, marker };
};



  //game
const Game = (function() {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

    let round = 0;
    const winning_table = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6],
        [0,4,8] 
    ];

    function getPlayer (){
        return [player1,player2];};

    const changePlayerName =(name1,name2)=>{
        if(name1 && name1!== "")player1.name = name1;
        if(name1 && name2 !== "")player2.name = name2;
    }

    let currentPlayer = player1;

    // change current player
    const switchPlayer = () => {

        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };



    // returns current player
   const getCurrentPlayer = () => currentPlayer;
   
   const getRound =()=> round;
   const setRound =()=> round++;


    const hasCurrentPlayerWon =()=>{
        let board = GameBoard.getBoard();
         // brute force search to check if the current play has won 
         for(let i = 0;i<winning_table.length;i++){
             let check = true;
             for(let j=0;j<3;j++){
                 if(board[winning_table[i][j]] !== currentPlayer.marker)check=false;
             }
             if(check){
                 return true;
             }
           
         }
     
         return false;
     
     };    
    //updates board depending where the player clicked
        const makeMove = (index) => {
            GameBoard.updateBoard(index, currentPlayer.marker);
        };

        const resetGame =()=>{

            currentPlayer = player1;
            round = 0;
            GameBoard.resetBoard();
        }


         const start =()=>{
            DOM.takeNames();
            DOM.replayer();
            DOM.addEventListeners();
            DOM.hoverListener();
            DOM.setHeader();
         }

        return{ start,makeMove ,getRound,setRound,resetGame,
            switchPlayer,hasCurrentPlayerWon,changePlayerName, 
            getCurrentPlayer,getPlayer};

})();





const DOM =(function(){

        const cells         = document.querySelectorAll(".cell");
        const messageBox    = document.querySelector(".message");
        const textMessage   = document.getElementById('textMessage');
        const head         = document.getElementById('head');
  

            function setHeader (){
                let p = Game.getPlayer();
               
                head.textContent = `${p[0].name} Vs  ${p[1].name} `
            };
        // event lisnet to start button

            function takeNames(){
                document.getElementById('start').addEventListener('click',function handleStart(){

                    Game.changePlayerName(document.getElementById('Player1').value,
                    document.getElementById('Player2').value);
                  
                    document.querySelector('.startPlay').style.display = "none";

                    Game.start();
                
                });

            };

         

        // responsible for taking care of replay button
        function replayer(){
            document.getElementById('replay').addEventListener('click',()=>{
                resetCell();
                Game.resetGame();
                textMessage.textContent = "";
                messageBox.style.display = "none";
                addCurserPointer();
                hoverListener();

        });
        };

        function hoverListener(){
            cells.forEach(cell => {
                let hoverText = document.createElement('span');
                hoverText.classList.add('hover-text');
                cell.appendChild(hoverText);
                
                cell.addEventListener('mouseover', () => {
                    hoverText.textContent = Game.getCurrentPlayer().marker; 
                });

                cell.addEventListener('mouseout', () => {
                    hoverText.textContent = ""; 

                });
            });
        };

        function addEventListeners(){
                
                cells.forEach((cell,index) => {
                    cell.addEventListener('click', function handleClick()  {

                        if(GameBoard.getBoard()[index]===""){

                            Game.makeMove(index);   
                            // set the text content of the cell to player mark
                            cell.textContent = Game.getCurrentPlayer().marker;
            
                            // increases the round  by one
                            Game.setRound();
                            
                            // stopping condition
                            if(Game.getRound() === 9 || Game.hasCurrentPlayerWon()){
            
                                if(Game.hasCurrentPlayerWon()){
                                    textMessage.textContent = " The winner is " + Game.getCurrentPlayer().name;
                                    
                                }
                                else if(Game.getRound() === 9){
                                    textMessage.textContent = "Draw!";
                                }
                                messageBox.style.display = "flex";
            
                            }
                    
                            Game.switchPlayer();
                        
                            cell.style.color="blue";
                            // pointer property from the cell
                            cell.style.cursor = "default"
                        }

                    });
                });
            

        };


        function addCurserPointer(){
            cells.forEach(cell=>{
                cell.style.cursor = "pointer";
            });
        };

        function resetCell (){
            cells.forEach(cell=>{
                cell.textContent=''
            });
        };

        return {replayer,setHeader,hoverListener,addEventListeners ,takeNames};

})();



DOM.takeNames();








