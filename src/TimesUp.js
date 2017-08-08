Tetris.TimesUp = function() {};

Tetris.TimesUp.stateKey = "TimesUp";

Tetris.TimesUp.prototype.init = function() {};

Tetris.TimesUp.prototype.preload = function() {};

Tetris.TimesUp.prototype.create = function() {
  this.stage.backgroundColor = 0x444444;
  Tetris.game.add.text(240, 50, "Time's up!\nThanks for playing", {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  
  this.enter = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  this.gamepad = Tetris.gamepad;
}; // end create function

Tetris.TimesUp.prototype.update = function() {
  // if (this.enter.isDown || this.gamepad.isDown(Tetris.config.AButton)) {
  //   this.gotoNextScreen();
  // }
};

// Tetris.TimesUp.prototype.gotoNextScreen = function(){
//   Tetris.gameNumber++;
//   this.state.start(Tetris.Game.stateKey); 
// };
