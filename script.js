const gameBoard = (() => {
  let _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const winningSets = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8], [2,4,6]];

  const isInBoard = index => typeof _board[index][subIndex] !== 'number';
  const setInBoard = (index, playerHand) => _board[index] = playerHand;
  const resetGame = () => _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const testWin = (currentPlay) => winningSets.some(arr => 
                        arr.every(index => _board[index] === currentPlay));
  const showBoard = () => _board;
  return {setInBoard, isInBoard, resetGame, testWin, showBoard};
})() 

// gameBoard.setInBoard(1, 'x');
// gameBoard.setInBoard(0, 'x');
// console.log(gameBoard.showBoard())
// console.log(gameBoard.testWin('x'));
// gameBoard.setInBoard(2, 'x');
// console.log(gameBoard.showBoard())
// console.log(gameBoard.testWin('x'));