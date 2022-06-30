// Initialize BOARD
var BOARD;
let audiowin = new Audio("win.mp3");
let audiostart = new Audio("start.mp3");
let audioover = new Audio("over.mp3");
let audioturn = new Audio("ting.mp3");


// Initialize both Players and Available Positions/spots
const BOT = 'X';
const HUMAN = 'O'
const win_combination = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
let playername;
// Setting cells equal to all cells in html file
const cells = document.querySelectorAll('.cell');
startGame();

// Resets the BOARD
function startGame() {
	playername = prompt("Enter your Name. Remember your Opponent is Rajneesh", "Rajneesh");
	audiostart.play();
	document.querySelector(".endgame").style.display = "none";
	BOARD = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

// Starts Turns Based on User Click
function turnClick(square) {
	audioturn.play();
	if (typeof BOARD[square.target.id] == 'number') {
		turn(square.target.id, HUMAN)
		if (!checkTie()) {
			setTimeout(function () {
				turn(bestSpot(), BOT);
			}, 400);
		}
	}
}

// Executes Turn
function turn(squareId, player) {
	BOARD[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let win = checkWinner(BOARD, player);
	if (win) {
		gameOver(win);
	}
}

// Checks for a Winner
function checkWinner(mimic_BOARD, player) {
	let winner = null;
	let plays = [];
	for (let i = 0; i < mimic_BOARD.length; i++) {
		if (mimic_BOARD[i] === player) {
			plays.push(i);
		}
	}
	for (let i = 0; i < win_combination.length; i++) {
		if (plays.includes(win_combination[i][0]) && plays.includes(win_combination[i][1]) &&
			plays.includes(win_combination[i][2])) {
			winner = { i, player };
			break;
		}
	}
	return winner;
}

// Stops the game and outputs result
function gameOver(winner) {
	for (let i of win_combination[winner.i]) {
		document.getElementById(i).style.backgroundColor =
			winner.player == HUMAN ? "#009B77" : "#009B77";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	audiowin.play();
	declareWinner(winner.player == HUMAN ? `${playername} Win!` : `${playername} Lose :(`);
}

// Output the  Result
function declareWinner(person) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = person;
}

// Returns number of empty positions on BOARD
function emptySquares() {
	return BOARD.filter(s => typeof s == 'number');
}

// BOT uses minimax algorithm to find the best spot
function bestSpot() {
	return minimax(BOARD, BOT).index;
}

// Functon to check whether tie occured or not
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "#FF6F61";
			cells[i].removeEventListener('click', turnClick, false);
		}
		audioover.play();
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// Minimax Algorithm to be used by BOT
function minimax(mimic_BOARD, player) {
	let openSpots = emptySquares();

	if (checkWinner(mimic_BOARD, HUMAN)) {
		return { score: -10 };
	} else if (openSpots.length === 0) {
		return { score: 0 };
	}
	else if (checkWinner(mimic_BOARD, BOT)) {
		return { score: 10 };
	}
	let moves = [];
	for (let i = 0; i < openSpots.length; i++) {
		let move = {};
		move.index = mimic_BOARD[openSpots[i]];
		mimic_BOARD[openSpots[i]] = player;

		if (player == BOT) {
			let result = minimax(mimic_BOARD, HUMAN);
			move.score = result.score;
		} else {
			let result = minimax(mimic_BOARD, BOT);
			move.score = result.score;
		}

		mimic_BOARD[openSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if (player === BOT) {
		let bestScore = -Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = Infinity;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}