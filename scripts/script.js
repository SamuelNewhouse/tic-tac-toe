$(function () {
	var boardTracker = (function () {
		var gameOver = false;
		var playerTurn = "X";
		var turnNum = 1;
		var cells = {
			"top-left": "", "top-middle": "", "top-right": "",
			"middle-left": "", "middle-middle": "", "middle-right": "",
			"bottom-left": "", "bottom-middle": "", "bottom-right": ""
		};

		function endTurn() {
			turnNum++;
			playerTurn = playerTurn === "X" ? "O" : "X";
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
					cells[id] = playerTurn;
					$("#" + id + " > div").html(playerTurn);
					testWin();
					endTurn();
				}
				else if (id === "popup-button") {
					resetBoard();
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