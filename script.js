const board = (() => {
  let _board = ['', '', '', '', '', '', '', '', ''];
  const winningSets = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8], [2,4,6]];

  const getBoard = () => [..._board];
  const isInBoard = index => !!_board[index];
  const setInBoard = (index, playerHand) => _board[index] = playerHand;
  const resetBoard = () => _board = ['', '', '', '', '', '', '', '', ''];
  const testWin = (currentPlay) => winningSets.some(arr => 
                        arr.every(index => _board[index] === currentPlay));
  return {setInBoard, isInBoard, resetBoard, testWin, getBoard,};
})();

const Player = (name, XorO) => {
  let _player = name;
  let _sign = XorO;
  let _wins = 0

  const getName = () => _player;
  const getSign = () => _sign;
  const setWins = () => _wins++;
  const getWins = () => _wins;
  return  {getName, getSign, getWins, setWins}
}

const AI = () => {
  let _sign = 'O'
  let _wins = 0

  const getName = () => "AI";
  const getSign = () => _sign;
  const setWins = () => _wins++;
  const getWins = () => _wins;
  const play = () => {
    let hand;
    do { 
      hand = Math.floor(Math.random() * (8 - 0)) 
    } 
    while(board.isInBoard(hand));
    return hand
  }
  return  {getName, getSign, getWins, setWins, play} 
}

const gameUI = (() => {
  const displayInfo = document.querySelector('.display-info');
  const gameCell = document.querySelectorAll('.game-cell');
  const continueGame = document.querySelector('#continue-game-button');
  const mainGame = document.querySelector('.main-game');
  const mainContainer = mainGame.parentNode;
  const sendPlayersInfo = document.querySelector('.send-players-info');
  const newGame = document.querySelector('#new-game-button')

  const winUI = (sign) => {
  if (board.testWin(sign)) {
     gameUI.displayAlert('win',`${game.sendCurrentPlayer().getName()} Won!`);
     game.sendCurrentPlayer().setWins();
     board.resetBoard();
     setTimeout(() => game.endGame(`Winner: ${game.sendCurrentPlayer().getName()}`), 500)
}}
  const winnerUI = (text) => document.querySelector('.winner').textContent = text;
  const playersUI = (arr) => { 
      let players = document.querySelectorAll('.players');
      let playersWins = document.querySelectorAll('.player-win-count');
      players.forEach((player, index) => player.textContent = arr[index].getName());
      playersWins.forEach((win, index) => win.textContent = arr[index].getWins());
  }
  const resetInterface = () => gameCell.forEach(cell => cell.textContent = '');
  const displayAlert = (type, message) => {
    let alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.classList.add(`${type}`, 'alert');
    mainContainer.insertBefore(alertDiv, mainGame);
    setTimeout(() => document.querySelector('.alert').remove(), 1500);
  }
  const displayEndGame = (text) => {
    winnerUI(text);
    playersUI(game.SendPlayers())
    displayInfo.style.display = 'flex';
  }
  sendPlayersInfo.addEventListener('click', () => {
      let p1 = document.querySelector('#p1-name')
      let p2 = document.querySelector('#p2-name')
      game.setPlayersName(p1.value, 'X', p2.value, 'O');
      document.querySelector('.players-info-container').style.display = 'none'
    })



  gameCell.forEach(cell => cell.addEventListener('click', e => {
    let index = parseInt(e.target.dataset.value);
    let currentSing;
    if (board.isInBoard(index)) displayAlert("danger", "you can't play there!");
    else {
      let thisSing = game.sendCurrentPlayer().getSign();
      currentSing = thisSing;
      game.singleRound(index, thisSing);
      e.target.textContent = thisSing;
      let gameRound = game.sendRound();
      let possibleAI = game.SendPlayers()[1]
      winUI(currentSing)
      if (possibleAI.getName() === 'AI' && gameRound < 9) {
        game.changeCurrentPlayer()
        let aiHand = possibleAI.play();
        let aiIndex = document.querySelector(`[data-value="${aiHand}"]`);
        game.singleRound(aiHand, possibleAI.getSign());
        currentSing = possibleAI.getSign();
        aiIndex.textContent = possibleAI.getSign();
        winUI(currentSing)
      };
      game.changeCurrentPlayer()
      if(gameRound >= 9) {
      gameUI.displayAlert('danger',`It's a Draw`);
      board.resetBoard();
      setTimeout(() => game.endGame("It's a Draw"), 500)
      }
    }
  }));

  continueGame.addEventListener('click', () => {
    resetInterface();
    displayInfo.style.display = 'none';
  })

  newGame.addEventListener('click', () => { 
      displayInfo.style.display = 'none';
      document.querySelector('.players-info-container').style.display = "flex";
      resetInterface();
  });
  return {resetInterface, displayAlert, displayEndGame, playersUI,};
})();

const game = (() => {
  let player1 = Player('Player 1', 'X');
  let player2 = AI();
  let round = 0;
  let currentPlayer = player1;
  
  const sendRound = () => round;
  const sendCurrentPlayer = () => currentPlayer;
  const changeCurrentPlayer = () => currentPlayer = currentPlayer === player2 ? player1 : player2;
  const resetGame = () => {
    round = 0;
  }
  const setPlayersName = (p1Name, p1Sing, p2Name, p2Sing ) => {
    player1 = Player(p1Name, p1Sing);
    player2 = p2Name === 'AI' ? AI() : Player(p2Name, p2Sing);
    gameUI.playersUI(game.SendPlayers());
  }
  const SendPlayers = () => [player1, player2];
  const endGame = (text) => {
    resetGame();
    gameUI.displayEndGame(text)
  };
  const singleRound = (targetIndex, sign) => {
    const index = targetIndex;
    board.setInBoard(index, sign);
    round++
    ;
  }

  return {singleRound,sendCurrentPlayer,resetGame, endGame, SendPlayers, setPlayersName, sendRound, changeCurrentPlayer,}
})();