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
  LINING_WIDTH: 5,
  BLOCK_WIDTH: 25,
  
  // Board Size
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  
  // Declare the board.
  // board is a 2d array containing placed Blocks (active blocks are not in 
  // the board yet. It will be oriented with
  // blocks[0][0] in the top left and blocks[BOARD_HEIGHT-1][BOARD_WIDTH-1]
  // in the bottom right corner. Initialized in Tetris.Game.create(). 
  board: null,
  
  config: {startLevel: 0,
           subjectNumber: 0,
           ECID: 1212,
           AButton: -1,      // different USB NES pads assign different button values
           BButton: -1,      // to all the buttons. We ask the player to press the A
           leftButton: -1,   // button at the main menu, and then assign the buttons
           rightButton: -1,
           downButton: -1,
           startButton: -1,
           sessionTime: 60   // total time, in seconds, for this experimental session. 1 hour = 3600 seconds
          },

  audio: {},
  
  log: ["ts","event_type", "SID","ECID","session","game_type","game_number","episode_number","level","score","lines_cleared",
        "completed","game_duration","avg_ep_duration","zoid_sequence","evt_id","evt_data1","evt_data2",
        "curr_zoid","next_zoid","danger_mode",
        "evt_sequence","rots","trans","path_length",
        "min_rots","min_trans","min_path",
        "min_rots_diff","min_trans_diff","min_path_diff",
        "u_drops","s_drops","prop_u_drops",
        "initial_lat","drop_lat","avg_lat",
        "tetrises_game","tetrises_level",
         "agree","delaying","dropping","zoid_rot","zoid_col","zoid_row","board_rep","zoid_rep"].join("\t"),
  gameNumber: 1
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
  this.game.state.add( Tetris.GameOver.stateKey, Tetris.GameOver );
  this.game.state.add( Tetris.TimesUp.stateKey, Tetris.TimesUp );

  // Random number generator
  this.mt = new MersenneTwister();
  // to get "identical" results to Python 2.7.x, we seed with seedArray(), not seed()
  this.mt.seedArray([1]);

  // Boot the game
  this.game.state.start( Tetris.Boot.stateKey );

  
};