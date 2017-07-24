/** @constructor */
let spacebar, input;

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
  input = Tetris.game.add.inputField(10,90, {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: '1',
    min: 0,
    max: 29,
    type: PhaserInput.InputType.number
  });
  input.setText(0);
  input.startFocus();
};

Tetris.MainMenu.prototype.update = function() {
  if (spacebar.isDown) {
    Tetris.config.startLevel = input.value;
    this.state.start(Tetris.Game.stateKey);
  }
};
