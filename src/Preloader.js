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
    this.loadingText = Tetris.game.add.text(370, 230, "Loading", { font: "24px Arial", fill: "#ffffff", align: "right" });


    this.preloader = this.game.add.sprite( 0, 0, bmd );
    this.preloader.anchor.setTo( 0.5, 0.5 );
    this.preloader.position.setTo( this.world.centerX,
                                   this.world.height - this.preloader.height * 2 );
    this.load.setPreloadSprite( this.preloader );

    this.load.path = './media/';

    // Load audio
    this.load.audio( "clear1", "clear1.mp3" );
    this.load.audio( "clear4", "clear4.mp3" );
    this.load.audio( "crash", "crash.mp3" );
    this.load.audio( "keep", "keep.mp3" );
    this.load.audio( "music", "korobeiniki.mp3" );
    this.load.audio( "music_fast", "korobeiniki_fast.mp3" );
    this.load.audio( "levelup", "levelup.mp3" );
    this.load.audio( "move", "movebeep.mp3" );
    this.load.audio( "pause", "pause.mp3" );
    this.load.audio( "rotate", "rotate.mp3" );
    this.load.audio( "slam", "slam.mp3" );

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
    Tetris.audio.clear1 = this.game.add.audio( "clear1" );
    Tetris.audio.clear4 = this.game.add.audio( "clear4" );
    Tetris.audio.crash = this.game.add.audio( "crash" );
    Tetris.audio.lock = this.game.add.audio( "keep" );
    Tetris.audio.music = this.game.add.audio( "music" );
    Tetris.audio.music.loop = true;
    Tetris.audio.music_fast = this.game.add.audio( "music_fast" );
    Tetris.audio.music_fast.loop = true;
    Tetris.audio.levelup = this.game.add.audio( "levelup" );
    Tetris.audio.move = this.game.add.audio( "move" );
    Tetris.audio.pause = this.game.add.audio( "pause" );
    Tetris.audio.rotate = this.game.add.audio( "rotate" );
    Tetris.audio.slam = this.game.add.audio( "slam" );

    this.soundList.push( Tetris.audio.clear1 );
    this.soundList.push( Tetris.audio.clear4 );
    this.soundList.push( Tetris.audio.crash );
    this.soundList.push( Tetris.audio.lock );
    this.soundList.push( Tetris.audio.music );
    this.soundList.push( Tetris.audio.music_fast );
    this.soundList.push( Tetris.audio.levelup );
    this.soundList.push( Tetris.audio.move );
    this.soundList.push( Tetris.audio.pause );
    this.soundList.push( Tetris.audio.rotate );
    this.soundList.push( Tetris.audio.slam );

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
