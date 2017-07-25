/** @constructor */
let spacebar, input, enter;

Tetris.MainMenu = function() {};

Tetris.MainMenu.stateKey = "MainMenu";

Tetris.MainMenu.prototype.init = function() {};

Tetris.MainMenu.prototype.preload = function() {};

Tetris.MainMenu.prototype.create = function() {
  this.stage.backgroundColor = 0x444444;
  Tetris.game.add.text(240, 50, "META-TWO Beta test", {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  Tetris.game.add.text(190, 150, "Type in desired start level (default is 0)", {
    font: "bold 24px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  Tetris.game.add.text(210, 200, "Press Enter key or A button to begin", {
    font: "bold 24px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  //text.setTextBounds(0, 100, 800, 100);
  //spacebar =  Tetris.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  enter = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  input = Tetris.game.add.inputField(375,300, {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: '0',
    min: 0,
    max: 29,
    type: PhaserInput.InputType.number,
    //blockInput: false
  });
  input.blockInput = false;
  //input.setText(0);
  input.startFocus();
  //console.log(input);
}; // end create function

Tetris.MainMenu.prototype.update = function() {
  if (enter.isDown) {
    this.gotoNextScreen();
  }
  if (Tetris.gamepad.isDown(Phaser.Gamepad.BUTTON_0)){
    // assuming a Tomee converted gamepad
    Tetris.config.AButton = Phaser.Gamepad.BUTTON_0;
    Tetris.config.BButton = Phaser.Gamepad.BUTTON_1;
    Tetris.config.leftButton = Phaser.Gamepad.BUTTON_5;
    Tetris.config.rightButton = Phaser.Gamepad.BUTTON_6;
    Tetris.config.downButton = Phaser.Gamepad.BUTTON_4;
    Tetris.config.startButton = Phaser.Gamepad.BUTTON_3;
    this.gotoNextScreen();
  }
  if (Tetris.gamepad.isDown(Phaser.Gamepad.BUTTON_1)){
    // assuming NES-Retro gamepad
    Tetris.config.AButton = Phaser.Gamepad.BUTTON_1;
    Tetris.config.BButton = Phaser.Gamepad.BUTTON_0;
    Tetris.config.leftButton = Phaser.Gamepad.BUTTON_4;
    Tetris.config.rightButton = Phaser.Gamepad.BUTTON_6;
    Tetris.config.downButton = Phaser.Gamepad.BUTTON_5;
    Tetris.config.startButton = Phaser.Gamepad.BUTTON_3;
    this.gotoNextScreen();
  }
};

Tetris.MainMenu.prototype.gotoNextScreen = function(){
  input.endFocus();
  input.value = input.value===""?0:input.value;
  Tetris.config.startLevel = input.value;
  this.state.start(Tetris.Game.stateKey);
};
