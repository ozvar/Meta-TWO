/** @constructor */
let spacebar, input, enter;

MetaTWO.MainMenu = function() {};

MetaTWO.MainMenu.stateKey = "MainMenu";

MetaTWO.MainMenu.prototype.init = function() {};

MetaTWO.MainMenu.prototype.preload = function() {};

MetaTWO.MainMenu.prototype.create = function() {
  this.stage.backgroundColor = 0x444444;
  MetaTWO.game.add.text(240, 50, "META-TWO Beta test", {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  MetaTWO.game.add.text(310, 150, "Subject Number", {
    font: "bold 24px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  MetaTWO.game.add.text(235, 300, "Desired start level (default is 0)", {
    font: "bold 24px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  MetaTWO.game.add.text(210, 350, "Press Enter key or A button to begin", {
    font: "bold 24px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  //text.setTextBounds(0, 100, 800, 100);
  //spacebar =  MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  enter = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  subjectNumber = MetaTWO.game.add.inputField(375,200, {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: '1234',
    min: 0,
    max: 9999,
    type: PhaserInput.InputType.number,
    //blockInput: false
  });
  subjectNumber.setText(1234);

  input = MetaTWO.game.add.inputField(375,400, {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: MetaTWO.config.startLevel,
    min: 0,
    max: 29,
    type: PhaserInput.InputType.number,
    //blockInput: false
  });
  input.setText(MetaTWO.config.startLevel);
  input.blockInput = false;
  //input.setText(0);
  input.startFocus();
  //console.log(input);
}; // end create function

MetaTWO.MainMenu.prototype.update = function() {
  if (enter.isDown) {
    this.gotoNextScreen();
  }
  
  if (MetaTWO.gamepad.isDown(Phaser.Gamepad.BUTTON_0)){
    // assuming a Tomee converted gamepad
    MetaTWO.config.AButton = Phaser.Gamepad.BUTTON_0;
    MetaTWO.config.BButton = Phaser.Gamepad.BUTTON_1;
    MetaTWO.config.leftButton = Phaser.Gamepad.BUTTON_5;
    MetaTWO.config.rightButton = Phaser.Gamepad.BUTTON_6;
    MetaTWO.config.downButton = Phaser.Gamepad.BUTTON_4;
    MetaTWO.config.startButton = Phaser.Gamepad.BUTTON_3;
    MetaTWO.config.pad = "axis"
    

    this.gotoNextScreen();
  }
  if (MetaTWO.gamepad.isDown(Phaser.Gamepad.BUTTON_1)){
    // assuming NES-Retro gamepad
    MetaTWO.config.AButton = Phaser.Gamepad.BUTTON_1;
    MetaTWO.config.BButton = Phaser.Gamepad.BUTTON_0;
    MetaTWO.config.leftButton = Phaser.Gamepad.BUTTON_4;
    MetaTWO.config.rightButton = Phaser.Gamepad.BUTTON_6;
    MetaTWO.config.downButton = Phaser.Gamepad.BUTTON_5;
    MetaTWO.config.startButton = Phaser.Gamepad.BUTTON_3;
    this.gotoNextScreen();
  }
};

MetaTWO.MainMenu.prototype.gotoNextScreen = function(){
  input.endFocus();
  input.value = input.value===""?0:input.value;
  if(typeof MetaTWO.config.startLevel !== "number"){
    MetaTWO.config.fixedLevel = true;
  }
  if(MetaTWO.config.fixedLevel == false){
  MetaTWO.config.startLevel = input.value;
  }
  MetaTWO.config.subjectNumber = subjectNumber.value;
  this.state.start(MetaTWO.Game.stateKey);
};
