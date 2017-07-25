/** @constructor */
Tetris.Preloader = function()
{
  this.soundList = [];
  this.numberOfDecodedSounds = 0;
};

Tetris.Preloader.stateKey = "Preloader";

Tetris.Preloader.prototype = {
  
  init: function () {},
  
  preload: function () {
    this.stage.backgroundColor = 0x111111;

    // Setup preloader 'loading' bar
    let preloaderWidth = ( this.game.width * 0.67 / 2.0 ) | 0;
    let preloaderHeight = 32;
    let bmd = this.game.add.bitmapData( preloaderWidth, preloaderHeight );
    bmd.ctx.fillStyle = "#999999";
    bmd.ctx.fillRect( 0, 0, preloaderWidth, preloaderHeight );

    this.preloader = this.game.add.sprite( 0, 0, bmd );
    this.preloader.anchor.setTo( 0.5, 0.5 );
    this.preloader.position.setTo( this.world.centerX,
                                   this.world.height - this.preloader.height * 2 );
    this.load.setPreloadSprite( this.preloader );

    this.load.path = './media/';

    // Load audio
    this.load.audio( "clear1", "clear1.wav" );
    this.load.audio( "clear4", "clear4.wav" );
    this.load.audio( "crash", "crash.wav" );
    this.load.audio( "keep", "keep.wav" );
    this.load.audio( "music", "korobeiniki.wav" );
    this.load.audio( "music_fast", "korobeiniki_fast.wav" );
    this.load.audio( "levelup", "levelup.wav" );
    this.load.audio( "move", "movebeep.wav" );
    this.load.audio( "pause", "pause.wav" );
    this.load.audio( "rotate", "rotate.wav" );
    this.load.audio( "slam", "slam.wav" );

    // Load images
    // this.load.image('background', 'background.png');
    // this.load.image('banner', 'banner.png');
    // this.load.spritesheet('block', 'blocks25.png', Tetris.BLOCK_WIDTH, Tetris.BLOCK_WIDTH);
    
   
  },
  
  create: function () {
    this.stage.backgroundColor = 0x222222;
    
    // create block buffs

    this.numberOfDecodedSounds = 0;

    // Add the loaded audio to the game
    let clear1 = this.game.add.audio( "clear1" );
    let clear4 = this.game.add.audio( "clear4" );
    let crash = this.game.add.audio( "crash" );
    let keep = this.game.add.audio( "keep" );
    let music = this.game.add.audio( "music" );
    let music_fast = this.game.add.audio( "music_fast" );
    let levelup = this.game.add.audio( "levelup" );
    let move = this.game.add.audio( "move" );
    let pause = this.game.add.audio( "pause" );
    let rotate = this.game.add.audio( "rotate" );
    let slam = this.game.add.audio( "slam" );

    this.soundList.push( clear1 );
    this.soundList.push( clear4 );
    this.soundList.push( crash );
    this.soundList.push( keep );
    this.soundList.push( music );
    this.soundList.push( music_fast );
    this.soundList.push( levelup );
    this.soundList.push( move );
    this.soundList.push( pause );
    this.soundList.push( rotate );
    this.soundList.push( slam );

    // Apply callback to decoding sounds.
    for( let i = 0; i < this.soundList.length; i++ )
    {
      this.soundList[i].onDecoded.add( this.soundDecoded, this );
    }

    this.sound.setDecodedCallback( this.soundList, this.allSoundsDecoded, this );
  },
    
  soundDecoded: function () {
    // Start scaling the preloader sprite towards 200% for audio decoding.
    this.numberOfDecodedSounds++;
    this.preloader.scale.set( 1.0 + ( this.numberOfDecodedSounds / this.soundList.length ), 1.0 );
  },
  
  allSoundsDecoded: function () {
    this.start();
  },
  
  start: function () {
    // Proceed to main menu, as usual.
    this.state.start( Tetris.MainMenu.stateKey );
  }
  
};
