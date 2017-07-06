/** @constructor */
let spacebar;

Tetris.MainMenu = function() {};

Tetris.MainMenu.stateKey = "MainMenu";

Tetris.MainMenu.prototype.init = function() {};

Tetris.MainMenu.prototype.preload = function() {};

Tetris.MainMenu.prototype.create = function() {
  this.stage.backgroundColor = 0x444444;
  let text = Tetris.game.add.text(0, 0, "Dummy text, hit spacebar", {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  //text.setTextBounds(0, 100, 800, 100);
  spacebar =  Tetris.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

Tetris.MainMenu.prototype.update = function() {
  if (spacebar.isDown) {
    this.state.start(Tetris.Game.stateKey);
  }
};
