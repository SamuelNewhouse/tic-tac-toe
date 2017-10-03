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
				if (state.isTerminal()) {
					//a terminal game state is the base case
					return Game.score(state);
				}
				else {
					var stateScore; // this stores the minimax value we'll compute

					if (state.turn === "X")
						// X maximizs --> initialize to a value smaller than any possible score
						stateScore = -1000;
					else
						// O minimizes --> initialize to a value larger than any possible score
						stateScore = 1000;

					var availablePositions = state.emptyCells();

					//enumerate next available states using the info form available positions
					var availableNextStates = availablePositions.map(function (pos) {
						var action = new AIAction(pos);

						var nextState = action.applyTo(state);

						return nextState;
					});

					/* calculate the minimax value for all available next states
					 * and evaluate the current state's value */
					availableNextStates.forEach(function (nextState) {

						var nextScore = minimaxValue(nextState); //recursive call

						if (state.turn === "X") {
							// X wants to maximize --> update stateScore iff nextScore is larger
							if (nextScore > stateScore)
								stateScore = nextScore;
						}
						else {
							// O wants to minimize --> update stateScore iff nextScore is smaller
							if (nextScore < stateScore)
								stateScore = nextScore;
						}
					});

					//backup the minimax value
					return stateScore;
				}
			}

			function takeABlindMove(turn) {
				var available = game.currentState.emptyCells();
				var randomCell = available[Math.floor(Math.random() * available.length)];
				var action = new AIAction(randomCell);

				var next = action.applyTo(game.currentState);

				ui.insertAt(randomCell, turn);

				game.advanceTo(next);
			}

			function takeANoviceMove(turn) {
				var available = game.currentState.emptyCells();

				//enumerate and calculate the score for each available actions to the ai player
				var availableActions = available.map(function (pos) {
					var action = new AIAction(pos); //create the action object

					//get next state by applying the action
					var nextState = action.applyTo(game.currentState);

					//calculate and set the action's minimax value
					action.minimaxVal = minimaxValue(nextState);

					return action;
				});

				//sort the enumerated actions list by score
				if (turn === "X")
					//X maximizes --> decend sort the actions to have the maximum minimax at first
					availableActions.sort(AIAction.DESCENDING);
				else
					//O minimizes --> ascend sort the actions to have the minimum minimax at first
					availableActions.sort(AIAction.ASCENDING);


				/*
				 * take the optimal action 40% of the time
				 * take the 1st suboptimal action 60% of the time
				 */
				var chosenAction;
				if (Math.random() * 100 <= 40) {
					chosenAction = availableActions[0];
				}
				else {
					if (availableActions.length >= 2) {
						//if there is two or more available actions, choose the 1st suboptimal
						chosenAction = availableActions[1];
					}
					else {
						//choose the only available actions
						chosenAction = availableActions[0];
					}
				}
				var next = chosenAction.applyTo(game.currentState);

				ui.insertAt(chosenAction.movePosition, turn);

				game.advanceTo(next);
			};

			function takeAMasterMove(turn) {
				var available = game.currentState.emptyCells();

				//enumerate and calculate the score for each avaialable actions to the ai player
				var availableActions = available.map(function (pos) {
					var action = new AIAction(pos); //create the action object

					//get next state by applying the action
					var next = action.applyTo(game.currentState);

					//calculate and set the action's minmax value
					action.minimaxVal = minimaxValue(next);

					return action;
				});

				//sort the enumerated actions list by score
				if (turn === "X")
					//X maximizes --> descend sort the actions to have the largest minimax at first
					availableActions.sort(AIAction.DESCENDING);
				else
					//O minimizes --> acend sort the actions to have the smallest minimax at first
					availableActions.sort(AIAction.ASCENDING);


				//take the first action as it's the optimal
				var chosenAction = availableActions[0];
				var next = chosenAction.applyTo(game.currentState);

				// this just adds an X or an O at the chosen position on the board in the UI
				ui.insertAt(chosenAction.movePosition, turn);

				// take the game to the next state
				game.advanceTo(next);
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
		} // AIAction

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

		var Game = function (autoPlayer) {
			this.ai = autoPlayer;
			this.currentState = new State();
			this.currentState.board = ["", "", "",
				"", "", "",
				"", "", ""];
			this.currentState.turn = "X";
			this.status = "beginning";

			this.advanceTo = function (_state) {
				this.currentState = _state;
				if (_state.isTerminal()) {
					this.status = "ended";

					if (_state.result === "X-won")
						ui.switchViewTo("won");
					else if (_state.result === "O-won")
						ui.switchViewTo("lost");
					else
						ui.switchViewTo("draw");
				}
				else {
					//the game is still running

					if (this.currentState.turn === "X") {
						ui.switchViewTo("human");
					}
					else {
						ui.switchViewTo("robot");

						//notify the AI player its turn has come up
						this.ai.notify("O");
					}
				}

				this.start = function () {
					if (this.status = "beginning") {
						//invoke advanceTo with the intial state
						this.advanceTo(this.currentState);
						this.status = "running";
					}
				}
			};
		}

		Game.score = function (_state) {
			if (_state.result !== "still running") {
				if (_state.result === "X-won") {
					// the x player won
					return 10 - _state.oMovesCount;
				}
				else if (_state.result === "O-won") {
					//the x player lost
					return -10 + _state.oMovesCount;
				}
				else {
					//it's a draw
					return 0;
				}
			}
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