/*
 * object to contain all items accessible to all control functions
 */
var globals = {};

/*
 * choosing difficulty level (onclick span.level) behavior and control
 * when a level is clicked, it becomes highlighted and the "ai.level" variable
 * is set to the chosen level
 */
$(".level").each(function () {
  var $this = $(this);
  $this.click(function () {
    $('.difficulty > .selected').toggleClass('not-selected');
    $('.difficulty > .selected').toggleClass('selected');
    $this.toggleClass('not-selected');
    $this.toggleClass('selected');

    ai.level = $this.attr("id");
  });
});

$(".xo").each(function () {
  var $this = $(this);
  $this.click(function () {
    $('.turn-choice > .selected').toggleClass('not-selected');
    $('.turn-choice > .selected').toggleClass('selected');
    $this.toggleClass('not-selected');
    $this.toggleClass('selected');
  });
});

/*
 * start game (onclick div.start) behavior and control
 * when start is clicked and a level is chosen, the game status changes to "running"
 * and UI view to switched to indicate that it's human's turn to play
 */
$(".start").click(function () {
  var selectedDifficulty = $('.difficulty > .selected').attr("id");
  var selectedSide = $('.turn-choice > .selected').attr("id");
  if (typeof selectedDifficulty !== "undefined" && typeof selectedSide !== "undefined") {
    var aiPlayer = new AI(selectedDifficulty);
    globals.game = new Game(aiPlayer);

    aiPlayer.plays(globals.game);

    globals.game.start(selectedSide);
  }
});

$("#restart").click(function () {
  location.reload();
});

/*
 * click on cell (onclick div.cell) behavior and control
 * if an empty cell is clicked when the game is running and it's the human player's turn
 * get the indices of the clicked cell, create the next game state, update the UI, and
 * advance the game to the newly created state
 */
$(".cell").each(function () {
  var $this = $(this);
  $this.click(function () {

    // Avoid getting console errors in case user clicks cells before starting game.
    if (typeof globals.game !== "undefined") {
      var humanSide = globals.game.humanSide;
      if (globals.game.status === "running" && globals.game.currentState.turn === humanSide && !$this.hasClass('occupied')) {
        var indx = parseInt($this.data("indx"));

        var next = new State(globals.game.currentState);
        next.board[indx] = humanSide;

        ui.insertAt(indx, humanSide);

        next.advanceTurn();

        globals.game.advanceTo(next);

      }
    }
  })
});