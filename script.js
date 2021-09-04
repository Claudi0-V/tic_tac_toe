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

  const getPlayerName = () => _player;
  const getPlayerSign = () => _sign;
  const setPlayerWin = () => _wins++;
  const getPlayerWins = () => _wins;
  return  {getPlayerName, getPlayerSign, getPlayerWins, setPlayerWin}
}

const gameUI = (() => {
  const displayInfo = document.querySelector('.display-info');
  const gameCell = document.querySelectorAll('.game-cell');
  const continueGame = document.querySelector('#continue-game-button');
  const mainGame = document.querySelector('.main-game');
  const mainContainer = mainGame.parentNode;
  const sendPlayersInfo = document.querySelector('.send-players-info');
  const newGame = document.querySelector('#new-game-button')

  const winnerUI = (text) => document.querySelector('.winner').textContent = text;
  const playersUI = (arr) => { 
      let players = document.querySelectorAll('.players');
      let playersWins = document.querySelectorAll('.player-win-count');
      players.forEach((player, index) => player.textContent = arr[index].getPlayerName());
      playersWins.forEach((win, index) => win.textContent = arr[index].getPlayerWins());
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
    if (board.isInBoard(index)) displayAlert("danger", "you can't play there!");
    else {
      game.singleRound(e, index);
      e.target.textContent = game.sendCurrentPlayer().getPlayerSign();
    }
  })  );
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
  let player1 = Player('Player1', 'X');
  let player2 = Player('Player2', 'O');
  let round = 0;
  let currentPlayer = player2;

  const sendCurrentPlayer = () => currentPlayer;
  const resetGame = () => {
    round = 0;
    currentPlayer = player2;
  }
  const setPlayersName = (p1Name, p1Sing, p2Name, p2Sing ) => {
    player1 = Player(p1Name, p1Sing);
    player2 = Player(p2Name, p2Sing);
    currentPlayer = player2;
    gameUI.playersUI(game.SendPlayers());
  }
  const SendPlayers = () => [player1, player2];
  const endGame = (text) => {
    resetGame();
    board.resetBoard();
    gameUI.displayEndGame(text)
  };
  const singleRound = (e, targetIndex) => {
    currentPlayer = currentPlayer === player2 ? player1: player2
    const hand = currentPlayer.getPlayerSign();
    const index = targetIndex;
    board.setInBoard(index, hand);
    if(board.testWin(hand)) {
      gameUI.displayAlert('win',`${currentPlayer.getPlayerName()} Won!`);
      currentPlayer.setPlayerWin();
      setTimeout(() => endGame(`Winner: ${game.sendCurrentPlayer().getPlayerName()}`), 500)
    }
    round++
    if(round >= 9) {
      gameUI.displayAlert('danger',`It's a Draw`);
      setTimeout(() => endGame("It's a Draw"), 500)
    }
  }

  return {singleRound,sendCurrentPlayer,resetGame, endGame, SendPlayers, setPlayersName}
})();

