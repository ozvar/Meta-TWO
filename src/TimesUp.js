MetaTWO.TimesUp = function() {};

MetaTWO.TimesUp.stateKey = "TimesUp";

MetaTWO.TimesUp.prototype.init = function() {};

MetaTWO.TimesUp.prototype.preload = function() {};

MetaTWO.TimesUp.prototype.create = function() {
  this.stage.backgroundColor = 0x444444;
  MetaTWO.game.add.text(240, 50, "Time's up!\nThanks for playing", {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  });
  
  this.enter = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  this.gamepad = MetaTWO.gamepad;
}; // end create function

MetaTWO.TimesUp.prototype.update = function() {
  // if (this.enter.isDown || this.gamepad.isDown(MetaTWO.config.AButton)) {
  //   this.gotoNextScreen();
  // }
};

// MetaTWO.TimesUp.prototype.gotoNextScreen = function(){
//   MetaTWO.gameNumber++;
//   this.state.start(MetaTWO.Game.stateKey); 
// };
