$(function () {
	var boardTracker = (function () {

		// https://mostafa-samir.github.io/Tic-Tac-Toe-AI/
		// 
		// Represents a state in the game
		// @param old [State]: old state to intialize the new state
		var State = function (old) {
			this.turn = "";
			this.oMovesCount = 0;
			this.result = "still running";
			this.board = [];

			if (typeof old !== "undefined") {
				var len = old.board.length;
				this.board = new Array(len);
				for (var itr = 0; itr < len; itr++) {
					this.board[itr] = old.board[itr];
				}

				this.oMovesCount = old.oMovesCount;
				this.result = old.result;
				this.turn = old.turn;
			}

			this.advanceTurn = function () {
				this.turn = this.turn === "X" ? "O" : "X";
			}

			this.emptyCells = function () {
				var indxs = [];
				for (var itr = 0; itr < 9; itr++) {
					if (this.board[itr] === "") {
						indxs.push(itr);
					}
				}
				return indxs;
			}

			this.isTerminal = function () {
				var B = this.board;

				//check rows
				for (var i = 0; i <= 6; i = i + 3) {
					if (B[i] !== "" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
						this.result = B[i] + "-won"; //update the state result
						return true;
					}
				}

				//check columns
				for (var i = 0; i <= 2; i++) {
					if (B[i] !== "" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
						this.result = B[i] + "-won"; //update the state result
						return true;
					}
				}

				//check diagonals
				for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
					if (B[i] !== "" && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
						this.result = B[i] + "-won"; //update the state result
						return true;
					}
				}

				var available = this.emptyCells();

				if (available.length == 0) {
					//the game is draw
					this.result = "draw"; //update the state result
					return true;
				}
				else {
					return false;
				}
			} // isTerminal
		}	// State

		var AI = function (level) {
			var levelOfIntelligence = level;
			var game = {};

			function minimaxValue(state) {

			}

			function takeABlindMove(turn) { // @param turn [String]: the player to play, either X or O

			}

			function takANoviceMove(turn) { // @param turn [String]: the player to play, either X or O

			}

			function takeAMasterMove(turn) { // @param turn [String]: the player to play, either X or O

			}

			this.plays = function (_game) {
				game = _game;
			}

			this.notify = function (turn) {
				switch (levelOfIntelligence) {
					case "blind": takeABlindMove(turn); break;
					case "novice": takeANoviceMove(turn); break;
					case "master": takeAMasterMove(turn); break;
				}
			} // notify
		} // AI

		var AIAction = function (pos) {
			this.movePosition = pos;
			this.minimaxVal = 0;

			this.applyTo = function (state) {
				var next = new.State(state);

				next.board[this.movePosition] = state.turn;

				if (state.turn === "O")
					next.oMovesCount++;

				next.advanceTurn();

				return next;
			}

		}

		AIAction.ASCENDING = function (firstAction, secondAction) {
			if (firstAction.minimaxVal < secondAction.minimaxVal)
				return -1; //indicates that firstAction goes before secondAction
			else if (firstAction.minimaxVal > secondAction.minimaxVal)
				return 1; //indicates that secondAction goes before firstAction
			else
				return 0; //indicates a tie
		}

		AIAction.DESCENDING = function (firstAction, secondAction) {
			if (firstAction.minimaxVal > secondAction.minimaxVal)
				return -1; //indicates that firstAction goes before secondAction
			else if (firstAction.minimaxVal < secondAction.minimaxVal)
				return 1; //indicates that secondAction goes before firstAction
			else
				return 0; //indicates a tie
		}
		
		var gameOver = false;
		var playerTurn = "X";
		var humanSide = "X";
		var turnNum = 1;
		var cells = {
			"top-left": "", "top-middle": "", "top-right": "",
			"middle-left": "", "middle-middle": "", "middle-right": "",
			"bottom-left": "", "bottom-middle": "", "bottom-right": ""
		};

		function getBoardState() { // Get copy of board state to play with, so cells object isn't changed.
			/*
			var boardState = {
				"top-left":    cells["top-left"]   ,    "top-middle": cells["top-middle"]   ,    "top-right": cells["top-right"],
				"middle-left": cells["middle-left"], "middle-middle": cells["middle-middle"], "middle-right": cells["middle-right"],
				"bottom-left": cells["bottom-left"], "bottom-middle": cells["bottom-middle"], "bottom-right": cells["bottom-right"]
			}
			*/
			return extend({}, cells);
		}

		function endTurn() {
			turnNum++;
			playerTurn = playerTurn === "X" ? "O" : "X";
			if (playerTurn !== humanSide)
				doComputerTurn();
		}

		function resetBoard() {
			$("#div-header > div").html("");
			$(".play-square").html("<div> </div>");
			$("#popup-button").hide();
			for (var k in cells) {
				if (cells.hasOwnProperty(k)) {
					cells[k] = "";
				}
			}
			gameOver = false;
			playerTurn = "X";
			turnNum = 1;
		}

		function playerSelect() {
			$("#popup-button").show();
		}

		function doPlacement(id) {
			cells[id] = playerTurn;
			$("#" + id + " > div").html(playerTurn);
			testWin();
			endTurn();
		}

		function evalHumanWin() {
		}

		function evalComputerWin() {

		}

		function doComputerTurn() {
			console.log("doComputerTurn: " + turnNum);
			switch (turnNum) {
				case 1:
					doPlacement("top-left");
					break;
				case 2:
					if (cells["middle-middle"] === "")
						doPlacement("middle-middle");
					else
						doPlacement("top-left");
					break;
				case 3:
					if (cells["middle-middle"] === "") {
						if (cells["top-middle"] === "" && cells["top-right"] === "")
							doPlacement("top-right");
						else
							doPlacement("bottom-left");
					}
					else {
						doPlacement("bottom-right");
					}
					break;
				case 4:
					break;
			}
		}

		function doWin() {
			$("#div-header > div").html(playerTurn + " wins.");
			gameOver = true;
			playerSelect();
		}

		function doDraw() {
			$("#div-header > div").html("Draw.");
			gameOver = true;
			playerSelect();
		}

		function testWin() {
			var testStarts = [cells["top-left"], cells["top-middle"], cells["top-right"], cells["middle-left"], cells["bottom-left"]];
			// Testing from Top Left
			if ((testStarts[0] !== "") && (
				(testStarts[0] === cells["top-middle"] && testStarts[0] === cells["top-right"]) || // Rightward
				(testStarts[0] === cells["middle-left"] && testStarts[0] === cells["bottom-left"]) || // Downward
				(testStarts[0] === cells["middle-middle"] && testStarts[0] === cells["bottom-right"]))) { // Diagonal
				console.log("Top Left win");
				doWin();
				// Testing from Top Middle... Downward
			} else if ((testStarts[1] !== "") && (testStarts[1] === cells["middle-middle"] && testStarts[1] === cells["bottom-middle"])) {
				console.log("Top Middle win");
				doWin();
				// Testing from Top Right
			} else if ((testStarts[2] !== "") && (
				(testStarts[2] === cells["middle-right"] && testStarts[2] === cells["bottom-right"]) || // Downward
				(testStarts[2] === cells["middle-middle"] && testStarts[2] === cells["bottom-left"]))) { // Diagonal
				console.log("Top Right win");
				doWin();
				// Testing from Middle Left... Rightward
			} else if ((testStarts[3] !== "") && (testStarts[3] === cells["middle-middle"] && testStarts[3] === cells["middle-right"])) {
				console.log("Middle Left win");
				doWin();
				// Testing from Bottom Left... Rightward
			} else if ((testStarts[4] !== "") && (testStarts[4] === cells["bottom-middle"] && testStarts[4] === cells["bottom-right"])) {
				console.log("Bottom Left win");
				doWin();
			} else if (turnNum === 9) {
				doDraw();
			}
		} // testWin()

		playerSelect();

		return {
			// *** Public methods and variables. ***
			tryPlacement: function (id) {
				if (!gameOver && cells[id] === "") {
					doPlacement(id);
				}
				else if (id === "play-x") {
					humanSide = "X";
					resetBoard();
				}
				else if (id === "play-o") {
					humanSide = "O";
					resetBoard();
					doComputerTurn();
				}
			}
		}; // return		
	})();

	function handleClicks() {
		boardTracker.tryPlacement(this.id);
		console.log(this.id);
	}
	$("#div-outer div").each(function () {
		$(this).click(handleClicks);
	});
});