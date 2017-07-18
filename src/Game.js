Tetris.Game = function (game) {
  
    this.DAS_NEGATIVE_EDGE=10;
    this.DAS_MAX=16;
    this.GRAVITY_START_DELAY=97;
    this.LINECLEAR_STEPS=5;
    // not expecting to go past level 30?
    this.speedLevels = [48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    this.scoreVals = [0, 40, 100, 300, 1200];
    this.board = new Board();
    //this.zoid = Zoid.spawn(0);
    //Math.floor(Tetris.mt.random() * 7);
    this.frames = 0;
    this.alive = true;
    this.paused = false;
    this.currentTask = this.start;
    this.are = 0;
    this._49 = 0;
    this.vx = 0
    this.vy = 0
    this.vr = 0
    
    this.das = 0
    this.softdrop_timer = 0
    this.drop = 0
    
    this.start_level = 0
    this.level = 0
    this.lines = 0
    this.score = 0
    
    this.drop_points = 0
    this.lines_this = 0
    this.lines_flagged = 0
    
    this.curr = 0
    this.next = 0
    
    this.piece_count = 0
};

Tetris.Game.stateKey = "Game";

Tetris.Game.prototype = {
    
  create: function () {
    
    let i, j;
    
    // Create background
    this.stage.backgroundColor = 0x050505; 
    
    // Create an empty board filled with nulls
    Tetris.board = new Board();    
    Tetris.game.time.advancedTiming = true;
  },

  start: function(){
    Tetris.mt.seedArray([1]);
    this.curr = Math.floor(Tetris.mt.random() * 7);
    //throw away next value, because current Mersenne Twister implementation
    //only matches Python value every other iteration. No idea why
    Math.floor(Tetris.mt.random() * 7);
    this.next = Math.floor(Tetris.mt.random() * 7);
    Math.floor(Tetris.mt.random() * 7);
    this.paused = False
        
    this.alive = True
    this.phase = this.active   
    this.level = this.start_level
    this.lines = 0
    this.score = 0
    
    this.are = 0
    this._49 = 0 
    this.drop = 0
    
    //From Alex:
    //A negative value is loaded into the soft drop counter for pre-gravity on the first piece.
    //As such, pre-gravity can be canceled out of by pressing Down to start soft dropping.
    this.softdrop_timer = -this.GRAVITY_START_DELAY;
  },
  
  update: function () {

  },

  control: function(){

  },

  render: function(){
    Tetris.game.debug.text("fps: " + Tetris.game.time.fps, 2, 14, "#00ff00");
    Tetris.game.debug.text("gravity timer: " + this.softdrop_timer, 2, 30, "#00ff00");
    Tetris.game.debug.text("level: " + this.level, 2, 46, "#00ff00");
    Tetris.game.debug.text("line count: " + this.lines, 2, 62, "#00ff00");
  },


  
};
