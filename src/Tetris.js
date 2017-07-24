/** @constructor */
let Tetris =
{
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,

  titleStyle: { font: "72px Arial", fill: "#ffffff" },

  buttonTextColor: 0xffffff,
  buttonTextOverColor: 0xffff00,
  buttonStyle: { font: "32px Arial", fill: "#ffffff" },
  buttonActiveStyle: { font: "32px Arial", fill: "#ffffff", fontStyle: "italic" },
  
  // Asset Sizes
  BANNER_HEIGHT: 25, //temp
  LINING_WIDTH: 5,
  BLOCK_WIDTH: 25,
  
  // Board Size
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  
  // Movement Directions
  DOWN: 0,
  LEFT: 1,
  RIGHT: 2,
    
  // Block colors
  NUM_COLORS: 4,
  GREEN:  0,
  RED:    1,
  BLUE:   2,
  YELLOW: 3,
  
  // Static Data for the position of Blocks within a Zoid.
  // blockPositions[zoidType][orientation][blockNumber].x = (int) board positions away from Zoid.centerX
  // in the x direction.
  zoidsJSON: null,
  zoids: null,  
  
  // Declare the board.
  // board is a 2d array containing placed Blocks (active blocks are not in 
  // the board yet. It will be oriented with
  // blocks[0][0] in the top left and blocks[BOARD_HEIGHT-1][BOARD_WIDTH-1]
  // in the bottom right corner. Initialized in Tetris.Game.create(). 
  board: null,
  
  config: {startLevel: 0,
           AButton: -1, // different USB NES pads assign different button values
           BButton: -1} // to A and B (grumble). We ask the player to press the A
                        // button at the main menu, and assign that to AButton
};

Tetris.run = function()
{
  // Create the Phaser game
  this.game = new Phaser.Game( this.SCREEN_WIDTH, this.SCREEN_HEIGHT,
                               Phaser.AUTO, "", this );

  // Add all the states to the game
  this.game.state.add( Tetris.Boot.stateKey, Tetris.Boot );
  this.game.state.add( Tetris.Preloader.stateKey, Tetris.Preloader );
  this.game.state.add( Tetris.MainMenu.stateKey, Tetris.MainMenu );
  this.game.state.add( Tetris.Game.stateKey, Tetris.Game );

  // Random number generator
  this.mt = new MersenneTwister();
  // to get "identical" results to Python 2.7.x, we seed with seedArray(), not seed()
  this.mt.seedArray([1]);

  // Boot the game
  this.game.state.start( Tetris.Boot.stateKey );

  
};