/** @constructor */
MetaTWO.Boot = function()
{
  
};

MetaTWO.Boot.stateKey = "Boot";

MetaTWO.Boot.prototype.init = function()
{
  this.stage.backgroundColor = 0x000000;
  this.stage.disableVisibilityChange = false;
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.minWidth = ( this.screenWidth / 2 ) | 0;
  this.scale.minHeight = ( this.screenHeight / 2 ) | 0;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.stage.forcePortrait = true;
};

MetaTWO.Boot.prototype.preload = function()
{
  // load assets needed for the preloader here 
};

MetaTWO.Boot.prototype.create = function()
{ 
  MetaTWO.game.input.gamepad.start();
  MetaTWO.gamepad = MetaTWO.game.input.gamepad.pad1;
  //Enable plugin for text field in menu
  MetaTWO.game.add.plugin(PhaserInput.Plugin);
  // Go straight to the Preloader
  this.state.start( MetaTWO.Preloader.stateKey );
};
