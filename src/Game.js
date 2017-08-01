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
    
    //this.start_level = 0;
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
    this.pauseCurr = false;
    this.pausePrev = false;
    this.rotateCurr = false;
    this.rotatePrev = false;
    this.counterRotateCurr = false;
    this.counterRotatePrev = false;
    this.keys = {LEFT:0, RIGHT:1, DOWN:2, ROTATE:3, COUNTERROTATE:4, PAUSE:5};
    this.fastMusic = false;

    //phaser color format: 'rgba(0,255,255,1)'
    this.bgColors = [
            ['rgba( 74, 0, 255, 1)', 'rgba( 0, 165, 255, 1 )'], //L0
            ['rgba( 0, 148, 0, 1 )', 'rgba( 148, 214, 0, 1 )'], //L1
            ['rgba( 173, 0, 189, 1 )', 'rgba( 230, 99, 255, 1 )'], //L2
            ['rgba( 74, 0, 255, 1 )', 'rgba( 0, 230, 0, 1 )'], //L3
            ['rgba( 189, 0, 82, 1 )', 'rgba( 0, 222, 132, 1 )'], //L4
            ['rgba( 0, 222, 132, 1 )', 'rgba( 132, 132, 255, 1 )'], //L5
            ['rgba( 189, 66, 0, 1 )', 'rgba( 107, 107, 107, 1 )'], //L6
            ['rgba( 123, 0, 255, 1 )', 'rgba( 123, 0, 0, 1 )'], //L7
            ['rgba( 74, 0, 255, 1 )', 'rgba( 189, 66, 0, 1 )'], //L8
            ['rgba( 189, 66, 0, 1 )', 'rgba( 239, 166, 0, 1 )'], //L9
            ]
};

Tetris.Game.stateKey = "Game";

Tetris.Game.prototype = {
    
  create: function () {
    
    let i, j;
    this.AButton = this.BButton = this.leftButton = this.rightButton = this.downButton = this.startButton = 0;
    
    // Create background
    this.stage.backgroundColor = 0x050505; 
    
    //allows us to view FPS   
    Tetris.game.time.advancedTiming = true;

    this.gamepad = Tetris.gamepad;

    //add graphics object for drawing frames, etc
    let graphics = Tetris.game.add.graphics();
    graphics.lineStyle(2, 0x00FF00, 1);    
    graphics.drawRect(0, 0, 252, 502);
    graphics.drawRect(320,0,120,120)
    let frameImage = graphics.generateTexture();
    this.bg = Tetris.game.add.image(274,97, frameImage);
    graphics.destroy();
    Tetris.game.add.text(580, 300, "Score:\n\nLines:\n\nLevel:", { font: "18px Arial", fill: "#ffffff", align: "right" });
    this.scoreDisplay = Tetris.game.add.text(725, 300, "0\n\n 0\n\n 0", { font: "18px Arial", fill: "#ffffff", align: "right" });
    this.scoreDisplay.anchor.set(1,0);
    this.gameNumberDisplay = Tetris.game.add.text(370, 30, "game#", { font: "18px Arial", fill: "#ffffff", align: "right" });

    //  Register the keys.
    this.leftKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.downKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.rotateKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.counterRotateKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.K);
    this.pauseKey = Tetris.game.input.keyboard.addKey(Phaser.Keyboard.P);

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
    this.zoid = Zoid.spawn(this.curr);
    this.nextZoid = Zoid.spawn(this.next);
    this.paused = false;
        
    this.alive = true;
    this.currentTask = this.active; 
    this.level = Tetris.config.startLevel; //this.start_level;
    this.lines = 0;
    this.score = 0;
    
    this.are = 0;
    this._49 = 0;
    this.drop = 0;
    
    //From Alex:
    //A negative value is loaded into the soft drop counter for pre-gravity on the first piece.
    //As such, pre-gravity can be canceled out of by pressing Down to start soft dropping.
    this.softdrop_timer = -this.GRAVITY_START_DELAY;
    Tetris.audio.music.play();
  },
  
  update: function () {
    this.poll();
    if (this.justPressed(this.keys.PAUSE) && (!this.paused)){
        this.paused = true;
        Tetris.audio.music.stop();
        Tetris.audio.music_fast.stop();
        Tetris.audio.pause.play();
    }
    else if (this.justPressed(this.keys.PAUSE) && (this.paused)){
        this.paused = false;
        this.fastMusic?Tetris.audio.music_fast.play():Tetris.audio.music.play();
    }
    if (this.alive && !this.paused){
        this.sub_94ee();
        this.drop++;
        this.currentTask();
        this.frames++;
    }
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

    if (this.softdrop_timer >= 0){
        if (this.softdrop_timer === 0){
            if (this.onlyDown()){
                this.softdrop_timer = 1;
            }
        }
        else{
            if (this.downCurr){
                this.softdrop_timer ++;
                if (this.softdrop_timer > 2){
                    this.softdrop_timer = 1;
                    this.drop_points ++;
                    this.vy = 1;
                }
                else{
                    this.vy = 0;
                }
            }
            else{
                this.softdrop_timer = 0;
                this.vy = 0;
                this.drop_points = 0;
            }
        }
    }

    if (this.justPressed(this.keys.ROTATE)){
        this.vr = 1;
    }
    else if (this.justPressed(this.keys.COUNTERROTATE)){
        this.vr = -1;
    }
    else{
        this.vr = 0;
    }

  },

  move: function(){
    if (this.vx !== 0){
        let shift = false;
        if (this.das === 0){
            shift = true;
        }
        if (this.das >= this.DAS_MAX){
            shift = true;
            this.das = this.DAS_NEGATIVE_EDGE;
        }
        this.das ++;

        if (shift){
            if (!this.zoid.collide(this.board, this.vx, 0, 0)){
                this.zoid.x += this.vx;

                Tetris.audio.move.play();
            }
            else{
                this.das = this.DAS_MAX;
            }
        }
    }
  },

  rotate: function(){
      
      if (this.vr !== 0){
          //console.log("rotate");
          if (!this.zoid.collide(this.board, 0, 0, this.vr)){
              Tetris.audio.rotate.play();          

              this.zoid.r += this.vr;
              this.zoid.r = this.zoid.r & 3;
              //console.log(this.zoid.r);
          }

      }
  },

  gravity: function(){
    if (this.softdrop_timer < 0){
        return;
    }
    if ((this.vy !== 0) || (this.drop >= this.speedLevels[this.level<29?this.level:29])){
        this.vy = 0;
        this.drop = 0;
        if (!this.zoid.collide(this.board, 0, 1, 0)){
            this.zoid.y++;
        }
        else{
            this.sub_9caf();
            this.currentTask = this.updateTask;
            if (this.drop_points >= 2){
                Tetris.audio.slam.play();
            }
            else{
                Tetris.audio.lock.play();
            }
        }
    }
  },

  active: function(){
    this.control();
    this.move();
    this.rotate();
    this.gravity();
  },

  updateTask: function(){
    if (this.are === 0){
        this.are = 1;
        //console.log(this.zoid);
        if(this.board.commit(this.zoid)){
            //GAME OVER
            this.alive = false;
            Tetris.audio.music.stop();
            Tetris.audio.music_fast.stop();
            Tetris.audio.crash.play();
        }
        //console.log(this.board);
    }
    
    else if ((!this.fastMusic) && (this.pileHeight() >= 16)){
        this.fastMusic = true;
        Tetris.audio.music.stop();
        Tetris.audio.music_fast.play();
    }

    if (this._49 < 0x20){
        return;
    }

    this.are = 0;
    this.sub_9caf();
    this.currentTask = this.lineCheck;
  },

  lineCheck: function(){
    if(this._49 < 0x20){
        return;
    }
    let row = Math.max(0, this.zoid.y);
    
    row += this.are;

    if ((row < this.board.height) && (this.board.lineCheck(row))){
        this.board.lineDrop(row);
        this.lines_this++;
    }

    this.are++;

    if (this.are >= 4){
        this._49 = 0;
        this.are = 0;
        if (this.lines_this !== 0){
            this.currentTask = this.lineAnim;
            // PLAY LINE SOUND
            if((this.lines_this > 0) && (this.lines_this < 4)){
                Tetris.audio.clear1.play();
            }
            if (this.lines_this === 4){
                Tetris.audio.clear4.play();
    }
        }
        else {
            this.currentTask = this.scoreUpdate;
            
        }
    }
  },

  lineAnim: function(){
    
    // all seems to be handled in 94ee
  },

  scoreUpdate: function(){
    let lines_before = this.lines;
    this.lines += this.lines_this;
    let hex_trick = 0;
    if (Math.floor(this.lines/10) > Math.floor(lines_before/10)){
        hex_trick = Math.floor(this.lines/10);
        hex_trick = parseInt(hex_trick.toString(), 16);
        if (hex_trick > this.level){
            this.level++;
            Tetris.audio.levelup.play();
        }
    }
    this.level = this.level & 255;
    
    this.score += (this.level + 1) * this.scoreVals[this.lines_this];
    // To replicate the drop score bug, we need to convert the last 
    // two digits to packed binary coded decimal.
    if (this.drop_points >= 2){
        let modScore = this.score % 100;
        hex_trick = parseInt(modScore.toString(), 16);
        hex_trick--;
        hex_trick += this.drop_points;
        if ((hex_trick & 0x0F) >= 0x0A){
            hex_trick += 0x06;
        }
        if ((hex_trick & 0xF0) >= 0xA0){
            hex_trick = hex_trick & 0xF0;
            hex_trick += 0x60;
        }
        this.score -= modScore;
        this.score += parseInt(hex_trick.toString(16), 10);
    }
    if ((this.fastMusic) && (this.pileHeight() < 16)){
        this.fastMusic = false;
        Tetris.audio.music_fast.stop();
        Tetris.audio.music.play();
    }
    this.currentTask = this.goalCheck;
  },

  goalCheck: function(){
      //not applicable in A-Type Tetris
      this.currentTask = this.dummy;
  },

  dummy: function(){
      //skipped frame for unimplemented 2-player code
      this.currentTask = this.prep;
  },

  prep: function(){
    if(this._49 < 0x20){
        return;
    }
    this.are = 0;
    this.lines_this = 0;
    this.drop_points = 0;
    this.softdrop_timer = 0;
    this.drop = 0;
    this.vy = 0;
    this.curr = this.next;
    this.next = Math.floor(Tetris.mt.random() * 7);
    Math.floor(Tetris.mt.random() * 7);
    this.zoid = this.nextZoid;
    this.nextZoid = Zoid.spawn(this.next);
    

    this.currentTask = this.active;
  },

  sub_94ee: function(){
    if (this.currentTask === this.lineAnim){
        if ((this.frames & 3) === 0){
            //PLAY LINE SOUND?
            this.are++;
        }
        if (this.are >= this.LINECLEAR_STEPS){
            this.are = 0;
            this.currentTask = this.scoreUpdate;
        }
        this._49 = 0;
    }
    else {
        for (i = 0; i < 4; i++){
            this.sub_9725();
        }
    }
  },

  sub_9725: function(){
    if(this._49 > 0x15){
        return;
    }
    this._49++;
    if (this._49 < 0x14){
        return;
    }
    this._49 = 0x20;
  },

  sub_9caf: function(){
    this._49 = this.zoid.y;
    if (this._49 < 0){
        this._49 = 0;
    }
  },

  render: function(){
    if (!this.paused){
        //debug draw pile
        for(iy = 0; iy<this.board.height; iy++){
            for(ix = 0; ix<this.board.width; ix++){
                if(this.board.isFilled(ix, iy)){
                    switch(this.board.getStyle(ix, iy)){
                        case 0: //large white square, primary color
                        Tetris.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+99, 24, 24), this.bgColors[this.level%10][0]);
                        Tetris.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+99, 3, 3), 'rgba(255,255,255,1');
                        Tetris.game.debug.geom(new Phaser.Rectangle(ix*25+279, iy*25+102, 18, 18), 'rgba(255,255,255,1');
                        break;
                        case 1: // primary color, white highlight
                        Tetris.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+99, 24, 24), this.bgColors[this.level%10][0]);
                        this.whiteHighlight(ix*25, iy*25,276,99)
                        break;
                        case 2: //secondary color, white highlight
                        Tetris.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+99, 24, 24), this.bgColors[this.level%10][1]);
                        this.whiteHighlight(ix*25, iy*25,276,99)
                    }
                }
            }
        }
        //debug draw zoid
        if ((this.currentTask === this.active) || (this.currentTask === this.updateTask)){
            let blocks = this.zoid.getBlocks();
            for (i=0; i< 4; i++){
                if(blocks[i][1] >= 0){
                    switch (this.zoid.style){
                        case 0: //large white square, primary color
                        Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+99, 24, 24), this.bgColors[this.level%10][0]);
                        Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+99, 3, 3), 'rgba(255,255,255,1');
                        Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+279, blocks[i][1]*25+102, 18, 18), 'rgba(255,255,255,1');
                        break;
                        case 1: // primary color, white highlight
                        Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+99, 24, 24), this.bgColors[this.level%10][0]);
                        this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,276,99)
                        break;
                        case 2: //secondary color, white highlight
                        Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+99, 24, 24), this.bgColors[this.level%10][1]);
                        this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,276,99)
                    }
                    // Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+99, 24, 24), 'rgba(0,0,255,1)');
                    // this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,276,99)
                }
            }
        }

        //debug draw next
        //offset 525, 125
            let blocks = this.nextZoid.getBlocks();
            for (i=0; i< 4; i++){
                switch (this.nextZoid.style){
                    case 0: //large white square, primary color
                    Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+125, 24, 24), this.bgColors[this.level%10][0]);
                    Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+125, 3, 3), 'rgba(255,255,255,1');
                    Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+528, blocks[i][1]*25+128, 18, 18), 'rgba(255,255,255,1');
                    break;
                    case 1: // primary color, white highlight
                    Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+125, 24, 24), this.bgColors[this.level%10][0]);
                    this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,525,128)
                    break;
                    case 2: //secondary color, white highlight
                    Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+125, 24, 24), this.bgColors[this.level%10][1]);
                    this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,525,128)
                }
                // Tetris.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+ 525, blocks[i][1]*25+125, 24, 24), 'rgba(0,0,255,1)');
                // this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25, 525, 125)
            }
        //}
    }
    else { // game is paused
        Tetris.game.debug.text("Paused", 360, 300, "#ffffff","24px Arial");
    }

    //Tetris.game.debug.text("fps: " + Tetris.game.time.fps, 2, 14, "#00ff00");
    // Tetris.game.debug.text("softdrop: " + this.softdrop_timer, 2, 30, "#00ff00");
    // Tetris.game.debug.text("level: " + this.level, 2, 46, "#00ff00");
    // Tetris.game.debug.text("line count: " + this.lines, 2, 62, "#00ff00");
    // Tetris.game.debug.text("vx: " + this.vx, 2, 78, "#00ff00");

    //let das_rect = new Phaser.Rectangle(2, 94, this.das * 10, 12);
    //Tetris.game.debug.geom(das_rect, 'rgba(0,255,0,1)')

    //Tetris.game.debug.text("score: " + this.score, 2, 110, "#00ff00", "24px Arial");
    //etris.game.debug.text("pile: " + this.pileHeight(), 2, 126, "#00ff00", "24px Arial");
    this.scoreDisplay.text = this.score.toString() + "\n\n" + this.lines.toString() + "\n\n" + this.level.toString();
    this.gameNumberDisplay.text = "Game: " + Tetris.gameNumber;
  },

  whiteHighlight: function(x,y,offsetx, offsety){
    Tetris.game.debug.geom(new Phaser.Rectangle(x + offsetx, y + offsety, 3, 3), 'rgba(255,255,255,1)');
    Tetris.game.debug.geom(new Phaser.Rectangle(x + offsetx + 3, y + offsety + 3, 6, 3), 'rgba(255,255,255,1)');
    Tetris.game.debug.geom(new Phaser.Rectangle(x + offsetx + 3, y + offsety + 6, 3, 3), 'rgba(255,255,255,1)');

  },

  poll: function(){
    this.leftPrev = this.leftCurr;
    this.rightPrev = this.rightCurr;
    this.downPrev = this.downCurr;
    this.rotatePrev = this.rotateCurr;
    this.counterRotatePrev = this.counterRotateCurr;
    this.pausePrev = this.pauseCurr;

    if (Tetris.game.input.gamepad.supported && Tetris.game.input.gamepad.active && this.gamepad.connected){
        this.AButton = this.gamepad.isDown(Tetris.config.AButton);
        this.BButton = this.gamepad.isDown(Tetris.config.BButton);
        this.downButton = this.gamepad.isDown(Tetris.config.downButton);
        this.leftButton = this.gamepad.isDown(Tetris.config.leftButton);
        this.rightButton = this.gamepad.isDown(Tetris.config.rightButton);
        this.startButton = this.gamepad.isDown(Tetris.config.startButton);
    }

    this.leftCurr = this.leftKey.isDown || this.leftButton;
    this.rightCurr = this.rightKey.isDown || this.rightButton;
    this.downCurr = this.downKey.isDown || this.downButton;
    this.rotateCurr = this.rotateKey.isDown || this.AButton;
    this.counterRotateCurr = this.counterRotateKey.isDown || this.BButton;
    this.pauseCurr = this.pauseKey.isDown || this.startButton;
    // if (Tetris.game.input.gamepad.supported && Tetris.game.input.gamepad.active && this.gamepad.connected)
    // {
    //     console.log(this.gamepad.isDown(Tetris.config.AButton));
    // }
    //console.log(this.gamepad._rawPad.axes[0]);
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
          case this.keys.PAUSE:
            if ((this.pauseCurr && !this.pausePrev)) {return true};
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
  },

  pileHeight: function(){
      
      for(iy = 0; iy < this.board.height; iy++){
        for(ix = 0; ix < this.board.width; ix++){
            if(this.board.isFilled(ix, iy)){
                return this.board.height - iy;
            }
        }
    }
    return 0;
  },

  //LOGGING FUNCTIONS
  //def log_universal( self, event_type, loglist, complete = False, evt_id = False, evt_data1 = False, evt_data2 = False, eyes = False, features = False):
  logUniversal(event_type, loglist, {complete = false, evt_id = false, evt_data1 = false, evt_data2 = false}={}){
    let data = [];
    let logit = function(val, key){
        if (loglist.indexOf(key) !== -1){
            data.push(val);
        }
        else {data.push("");}
    }
    data.push(Tetris.game.time.totalElapsedSeconds());
    data.push(event_type);
    logit(Tetris.config.subjectNumber, "SID");
    logit(Tetris.config.ECID, "ECID");
    console.log(data);
  }
};
