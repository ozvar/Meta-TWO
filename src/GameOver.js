Tetris.GameOver = function() {};

Tetris.GameOver.stateKey = "GameOver";

Tetris.GameOver.prototype.init = function() {};

Tetris.GameOver.prototype.preload = function() {};

Tetris.GameOver.prototype.create = function() {
  this.stage.backgroundColor = 0x444444;
  Tetris.game.add.text(240, 50, "META-TWO Beta test", {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  
  this.enter = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  this.gamepad = Tetris.gamepad;
}; // end create function

Tetris.GameOver.prototype.update = function() {
  if (this.enter.isDown || this.gamepad.isDown(Tetris.config.AButton)) {
    this.gotoNextScreen();
  }
};

Tetris.GameOver.prototype.gotoNextScreen = function(){
  this.state.start(Tetris.Game.stateKey); //clear state cache
};
