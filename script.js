const sleep = async (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const board = (() => {
  let _board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const winningSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getBoard = () => [..._board];
  const isInBoard = (index) => !!_board[index];
  const setInBoard = (index, playerHand) => (_board[index] = playerHand);

  const avaliableIndexes = (board = _board) => {
    return board
      .map((elem, index) => (!elem ? index : 0))
      .filter((elem) => elem);
  };

  const resetBoard = () => (_board = [0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const isAWin = (currentPlay) => {
    return winningSets.some((arr) =>
      arr.every((index) => _board[index] === currentPlay)
    );
  };

  return {
    setInBoard,
    isInBoard,
    resetBoard,
    isAWin,
    getBoard,
    avaliableIndexes,
  };
})();

const Player = (name, sign) => {
  const _name = name;
  const _sign = sign;
  const _type = "Player";
  let _wins = 0;

  const getName = () => _name;
  const getSign = () => _sign;
  const increaseWins = () => _wins++;
  const getType = () => _type;
  const getWins = () => _wins;

  return { getName, getSign, getWins, increaseWins, getType };
};

const AI = (name, sign) => {
  const _name = name;
  const _sign = sign;
  const _type = "AI";
  let _wins = 0;

  const getName = () => _name;
  const getSign = () => _sign;
  const increaseWins = () => _wins++;
  const getWins = () => _wins;
  const getType = () => _type;

  const play = (currentBoard = board) => {
    const avaliableIndexes = currentBoard.avaliableIndexes();
    const hand = Math.floor(Math.random() * avaliableIndexes.length);
    return avaliableIndexes[hand];
  };

  return { getName, getSign, getWins, increaseWins, play, getType };
};

const gameUI = (() => {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  const displayInfo = $(".display-info");
  const gameCells = $$(".game-cell");
  const continueGame = $("#continue-game-button");
  const mainGame = $(".main-game");
  const mainContainer = mainGame.parentNode;
  const playersInfoForm = $(".players-info-container");
  const newGame = $("#new-game-button");

  const winUI = async (player) => {
    await sleep();
    game.endGame(`Winner: ${player.getName()}`);
  };

  const winnerUI = (text) => ($(".winner").textContent = text);

  const playersUI = (arr) => {
    const players = $$(".players");
    const playersWins = $$(".player-win-count");
    players.forEach(
      (player, index) => (player.textContent = arr[index].getName())
    );
    playersWins.forEach(
      (win, index) => (win.textContent = arr[index].getWins())
    );
  };

  const resetInterface = () =>
    gameCells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("puff-in-center");
    });

  const displayAlert = async (type, message) => {
    const alertDiv = document.createElement("div");
    alertDiv.textContent = message;
    alertDiv.classList.add(`${type}`, "alert");
    mainContainer.insertBefore(alertDiv, mainGame);
    await sleep(1500);
    $(".alert").remove();
  };

  const displayEndGame = (text) => {
    winnerUI(text);
    playersUI(game.sendPlayers());
    displayInfo.style.display = "flex";
  };

  playersInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const p1 = $("#p1-name").value;
    const p2 = $("#p2-name").value;
    const p2Type = $('input[name="p2Choice"]:checked').value;

    game.setPlayersName(p1, "X", p2, "O", p2Type);
    e.target.style.display = "none";
  });

  gameCells.forEach((cell, index) =>
    cell.addEventListener("click", (event) => {
      if (board.isInBoard(index)) {
        return gameUI.displayAlert("danger", "you can't play there!");
      }
      game.gameFlow(event, index);
    })
  );

  continueGame.addEventListener("click", () => {
    board.resetBoard();
    resetInterface();
    displayInfo.style.display = "none";
  });

  newGame.addEventListener("click", () => {
    displayInfo.style.display = "none";
    $(".players-info-container").style.display = "flex";
    game.resetGame();
    resetInterface();
  });

  return { resetInterface, displayAlert, displayEndGame, playersUI, winUI };
})();

const game = (() => {
  let player1;
  let player2;
  let _round = 0;
  let _currentPlayer;

  const getRound = () => _round;
  const sendCurrentPlayer = () => _currentPlayer;
  const sendPlayers = () => [player1, player2];

  const changeCurrentPlayer = () =>
    (_currentPlayer = _currentPlayer === player2 ? player1 : player2);

  const resetGame = () => {
    board.resetBoard();
    _round = 0;
  };

  const setPlayersName = (p1Name, p1Sing, p2Name, p2Sing, p2type) => {
    player1 = Player("👨‍🦱" + p1Name, p1Sing);
    _currentPlayer = player1;
    const isAI = p2type === "AI";
    player2 = isAI ? AI(p2Name + "🤖", p2Sing) : Player(p2Name + "👨‍🦱", p2Sing);
    gameUI.playersUI(game.sendPlayers());
  };

  const endGame = (text) => {
    resetGame();
    gameUI.displayEndGame(text);
  };

  const singleRound = (targetIndex, sign) => {
    board.setInBoard(targetIndex, sign);
    _round++;
  };

  const hasAI = () => player1.getType() === "AI" || player2.getType() === "AI";

  const gameFlow = async ({ target }, index, player) => {
    const currPlayer = player || game.sendCurrentPlayer();
    const sign = currPlayer.getSign();
    game.singleRound(index, sign);
    target.classList.add("puff-in-center");
    target.textContent = sign;
    await sleep();

    if (board.isAWin(sign)) {
      currPlayer.increaseWins();
      return gameUI.winUI(currPlayer);
    }

    if (game.getRound() === 9) {
      board.resetBoard();
      await sleep();
      return game.endGame("It's a Draw");
    }

    if (game.hasAI() && !player) {
      const aiHand = player2.play();
      const aiIndex = document.querySelector(`[data-value="${aiHand}"]`);
      return gameFlow({ target: aiIndex }, aiHand, player2);
    }
    if (!game.hasAI()) {
      game.changeCurrentPlayer();
    }
  };

  return {
    singleRound,
    sendCurrentPlayer,
    resetGame,
    endGame,
    sendPlayers,
    setPlayersName,
    getRound,
    changeCurrentPlayer,
    gameFlow,
    hasAI,
  };
})();
