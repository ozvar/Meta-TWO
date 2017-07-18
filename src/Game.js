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
    this.leftCurr = false;
    this.leftPrev = false;
    this.rightCurr = false;
    this.rightPrev = false;
    this.downCurr = false;
    this.downPrev = false;
    this.rotateCurr = false;
    this.rotatePrev = false;
    this.counterRotateCurr = false;
    this.counterRotatePrev = false;
    this.keys = {LEFT:0, RIGHT:1, DOWN:2, ROTATE:3, COUNTERROTATE:4};

};

Tetris.Game.stateKey = "Game";

Tetris.Game.prototype = {
    
  create: function () {
    
    let i, j;
    
    // Create background
    this.stage.backgroundColor = 0x050505; 
    
    Tetris.board = new Board(); 
    //allows us to view FPS   
    Tetris.game.time.advancedTiming = true;

    //  Register the keys.
    this.leftKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.downKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.rotateKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.counterRotateKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.K);

    //  Stop the following keys from propagating up to the browser
    Tetris.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.S, Phaser.Keyboard.K, Phaser.Keyboard.L ]);

  },

  start: function(){
    Tetris.mt.seedArray([1]);
    this.curr = Math.floor(Tetris.mt.random() * 7);
    //throw away next value, because current Mersenne Twister implementation
    //only matches Python value every other iteration. No idea why
    Math.floor(Tetris.mt.random() * 7);
    this.next = Math.floor(Tetris.mt.random() * 7);
    Math.floor(Tetris.mt.random() * 7);
    this.paused = false;
        
    this.alive = true;
    this.currentTask = this.active; 
    this.level = this.start_level;
    this.lines = 0;
    this.score = 0;
    
    this.are = 0;
    this._49 = 0;
    this.drop = 0;
    
    //From Alex:
    //A negative value is loaded into the soft drop counter for pre-gravity on the first piece.
    //As such, pre-gravity can be canceled out of by pressing Down to start soft dropping.
    this.softdrop_timer = -this.GRAVITY_START_DELAY;
  },
  
  update: function () {
    this.poll();
    this.currentTask();
  },

  control: function(){
    if (!this.downCurr){
        if(this.justPressed(this.keys.RIGHT) || this.justPressed(this.keys.LEFT)){
            this.das = 0;
        }
        if (this.rightCurr) {this.vx = 1;}
        else if (this.leftCurr) {this.vx = -1;}
        else {this.vx = 0;} 
    }
    else {this.vx = 0;}

    if (this.softdrop_timer < 0){
        if (this.justPressed(this.keys.DOWN)){
            this.softdrop_timer = 0;
        }
        else {
            this.softdrop_timer ++;
        }
    }
  },

  active: function(){
    this.control();
  },

  render: function(){
    Tetris.game.debug.text("fps: " + Tetris.game.time.fps, 2, 14, "#00ff00");
    Tetris.game.debug.text("softdrop: " + this.softdrop_timer, 2, 30, "#00ff00");
    Tetris.game.debug.text("level: " + this.level, 2, 46, "#00ff00");
    Tetris.game.debug.text("line count: " + this.lines, 2, 62, "#00ff00");
    Tetris.game.debug.text("vx: " + this.vx, 2, 78, "#00ff00");
  },

  poll: function(){
    this.leftPrev = this.leftCurr;
    this.rightPrev = this.rightCurr;
    this.downPrev = this.downCurr;
    this.rotatePrev = this.rotateCurr;
    this.counterRotatePrev = this.counterRotateCurr;
    this.leftCurr = this.leftKey.isDown;
    this.rightCurr = this.rightKey.isDown;
    this.downCurr = this.downKey.isDown;
    this.rotateCurr = this.rotateKey.isDown;
    this.counterRotateCurr = this.rotateKey.isDown;
  },

  justPressed: function(key){
      switch(key){
          case this.keys.DOWN:
            if ((this.downCurr && !this.downPrev)) {return true};
            break;
          case this.keys.LEFT:
            if ((this.leftCurr && !this.leftPrev)) {return true};
            break;
          case this.keys.RIGHT:
            if ((this.rightCurr && !this.rightPrev)) {return true};
            break;
          case this.keys.ROTATE:
            if ((this.rotateCurr && !this.rotatePrev)) {return true};
            break;
          case this.keys.COUNTERROTATE:
            if ((this.counterRotateCurr && !this.counterRotatePrev)) {return true};
            break;
      }
    return false;
  },

  onlyDown: function(){
      //special function to determine if the down key was the only key just pressed
      if (this.justPressed(this.keys.DOWN) &&
            !this.justPressed(this.keys.LEFT) &&
            !this.justPressed(this.keys.RIGHT) &&
            !this.justPressed(this.keys.ROTATE) &&
            !this.justPressed(this.keys.COUNTERROTATE)){
                return true;
            }
            else {return false; }
  }
  
};
