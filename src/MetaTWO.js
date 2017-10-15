/** @constructor */
let MetaTWO =
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
  
  // The actual board is initialized in MetaTWO.Game.create(). 
  board: null,
  
  // The preliminary configuration. Many of these values will be overridden before play begins
  config: {startLevel: [0,0,0,9], //if you set to a list, it will cycle through and then repeat the last startLevel
           subjectNumber: 0,
           ECID: 1212,
           AButton: -1,      // different USB NES pads assign different button values
           BButton: -1,      // to all the buttons. We ask the player to press the A
           leftButton: -1,   // button at the main menu, and then assign the buttons
           rightButton: -1,
           downButton: -1,
           startButton: -1,
           session: Date().toString(),
           gameType: "standard",
           sessionTime: 3600,   // total time, in seconds, for this experimental session. 1 hour = 3600 seconds
           seed: -1, // seed for the Mersenne Twister (random number generator). -1 means use the current time
           fixedLevel: true, // disregard MainMenu input
          },

  // The audio files are loaded in the Preloader state
  audio: {},
  
  // The header for the log file. We will append new strings to this array
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

MetaTWO.run = function()
{
  // Create the Phaser game
  this.game = new Phaser.Game( this.SCREEN_WIDTH, this.SCREEN_HEIGHT,
                               Phaser.AUTO, "", this );

  // Add all the states to the game
  this.game.state.add( MetaTWO.Boot.stateKey, MetaTWO.Boot );
  this.game.state.add( MetaTWO.Preloader.stateKey, MetaTWO.Preloader );
  this.game.state.add( MetaTWO.MainMenu.stateKey, MetaTWO.MainMenu );
  this.game.state.add( MetaTWO.Game.stateKey, MetaTWO.Game );
  this.game.state.add( MetaTWO.GameOver.stateKey, MetaTWO.GameOver );
  this.game.state.add( MetaTWO.TimesUp.stateKey, MetaTWO.TimesUp );

  // Random number generator
  this.mt = new MersenneTwister();
  // to get "identical" results to Python 2.7.x, we seed with seedArray(), not seed()
  if (MetaTWO.config.seed === -1){
    this.mt.seedArray([Date.now()]);
  }
  else {
    this.mt.seedArray([MetaTWO.config.seed]);
  }

  // Boot the game
  this.game.state.start( MetaTWO.Boot.stateKey );

  
};