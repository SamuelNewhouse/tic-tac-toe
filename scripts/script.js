$(function () {

	var boardTracker = (function(){
		var playerTurn = "X";
		var cells = {
			"top-left" : "", "top-middle" : "", "top-right" : "",
			"middle-left" : "", "middle-middle" : "", "middle-right" : "",
			"bottom-left" : "", "bottom-middle" : "", "bottom-right" : ""
		};

		function endTurn() {
			playerTurn = playerTurn === "X" ? "O" : "X";
		}

		function doWin() {

		}

		function testWin() {
			var testStarts = [cells["top-left"], cells["top-middle"], cells["top-right"], cells["middle-left"], cells["bottom-left"]];
			// Testing from Top Left
			if(	(testStarts[0] !== "") &&
					(testStarts[0] === cells["top-middle"] && testStarts[0] === cells["top-right"]) || // Rightward
					(testStarts[0] === cells["middle-left"] && testStarts[0] === cells["bottom-left"]) || // Downward
					(testStarts[0] === cells["middle-middle"] && testStarts[0] === cells["bottom-right"]) ) { // Diagonal
				doWin();
			// Testing from Top Middle... Downward
			} else if(	(testStarts[1] !== "") && (testStarts[1] === cells["middle-middle"] && testStarts[1] === cells["bottom-middle"]) ) {
				doWin();
			// Testing from Top Right
			} else if(	(testStarts[2] !== "") &&
									(testStarts[2] === cells["middle-right"] && testStarts[2] === cells["bottom-right"]) || // Downward
									(testStarts[2] === cells["middle-middle"] && testStarts[2] === cells["bottom-left"]) ) { // Diagonal
				doWin();
			// Testing from Middle Left... Rightward
			} else if(	(testStarts[3] !== "") && (testStarts[3] === cells["middle-middle"] && testStarts[3] === cells["middle-right"]) ) {
				doWin();
			// Testing from Bottom Left... Rightward
			} else if(	(testStarts[4] !== "") && (testStarts[4] === cells["bottom-middle"] && testStarts[4] === cells["bottom-right"]) ) {
				doWin();
			}
		}
		return {
			tryPlacement: function(id){
				if(cells[id] === "") {
					cells[id] = playerTurn;
					$("#" + id + " > div").html(playerTurn);
					testWin();
					endTurn();
				}
				console.log();
			}
		};
	})();
	console.log(boardTracker);

	function handleClicks() {		
		boardTracker.tryPlacement(this.id);
	}
	$("#div-outer div").each(function() { 
		$(this).click(handleClicks);
	});
});