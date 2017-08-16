MetaTWO.Game = function (game) {
  
    this.DAS_NEGATIVE_EDGE=10;
    this.DAS_MAX=16;
    this.GRAVITY_START_DELAY=97;
    this.LINECLEAR_STEPS=5;
    // not expecting to go past level 30?
    this.speedLevels = [48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    this.scoreVals = [0, 40, 100, 300, 1200];
    
    this.keys = {LEFT:0, RIGHT:1, DOWN:2, ROTATE:3, COUNTERROTATE:4, PAUSE:5};
    

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

MetaTWO.Game.stateKey = "Game";

MetaTWO.Game.prototype = {
    
  create: function () {
    this.board = new Board();
    this.dummyBoard = new Board(); //used for animating line clears, since the blocks are gone by the time animation starts
    this.frames = 0;
    this.alive = true;
    this.paused = false;
    this.currentTask = this.start;
    this.are = 0;
    this._49 = 0;
    this.vx = 0;
    this.vy = 0;
    this.vr = 0;
    this.gameStartTime = MetaTWO.game.time.totalElapsedSeconds();
    
    this.das = 0;
    this.softdrop_timer = 0;
    this.drop = 0;
    
    //this.start_level = 0;
    this.level = 0;
    this.lines = 0;
    this.score = 0;
    this.episode = 0;
    this.zoidBuff = [];
    
    this.drop_points = 0;
    this.lines_this = 0;
    this.lines_flagged = 0;
    
    this.curr = 0;
    this.next = 0;
    
    this.piece_count = 0;
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
    this.fastMusic = false;
    this.rowsToClear = [];
    
    let i, j;
    this.AButton = this.BButton = this.leftButton = this.rightButton = this.downButton = this.startButton = 0;
    
    // Create background
    this.stage.backgroundColor = 0x050505; 
    
    //allows us to view FPS   
    MetaTWO.game.time.advancedTiming = true;

    this.gamepad = MetaTWO.gamepad;

    //add graphics object for drawing frames, etc
    let graphics = MetaTWO.game.add.graphics();
    graphics.lineStyle(2, 0x00FF00, 1);    
    graphics.drawRect(0, 0, 252, 503);
    graphics.drawRect(320,0,120,120)
    let frameImage = graphics.generateTexture();
    this.bg = MetaTWO.game.add.image(274,71, frameImage);
    graphics.destroy();
    MetaTWO.game.add.text(580, 300, "Score:\n\nLines:\n\nLevel:", { font: "18px Arial", fill: "#ffffff", align: "right" });
    this.scoreDisplay = MetaTWO.game.add.text(725, 300, "0\n\n 0\n\n 0", { font: "18px Arial", fill: "#ffffff", align: "right" });
    this.scoreDisplay.anchor.set(1,0);
    this.gameNumberDisplay = MetaTWO.game.add.text(370, 30, "game#", { font: "18px Arial", fill: "#ffffff", align: "right" });

    //  Register the keys.
    this.leftKey = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.downKey = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.rotateKey = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.counterRotateKey = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.K);
    this.pauseKey = MetaTWO.game.input.keyboard.addKey(Phaser.Keyboard.P);

    //  Stop the following keys from propagating up to the browser
    MetaTWO.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.S, Phaser.Keyboard.K, Phaser.Keyboard.L ]);

  },

  start: function(){
    this.curr = Math.floor(MetaTWO.mt.random() * 7);
    //throw away next value, because current Mersenne Twister implementation
    //only matches Python value every other iteration. No idea why
    Math.floor(MetaTWO.mt.random() * 7);

    this.next = Math.floor(MetaTWO.mt.random() * 7);
    Math.floor(MetaTWO.mt.random() * 7);
    this.zoid = Zoid.spawn(this.curr);
    //add to zoid buffer
    this.zoidBuff.push(this.zoid.names[this.curr]);
    this.nextZoid = Zoid.spawn(this.next);
    this.paused = false;
        
    this.alive = true;
    this.currentTask = this.active; 
    this.level = MetaTWO.config.startLevel; //this.start_level;
    this.lines = 0;
    this.score = 0;
    
    this.are = 0;
    this._49 = 0;
    this.drop = 0;
    
    //From Alex:
    //A negative value is loaded into the soft drop counter for pre-gravity on the first piece.
    //As such, pre-gravity can be canceled out of by pressing Down to start soft dropping.
    this.softdrop_timer = -this.GRAVITY_START_DELAY;
    MetaTWO.audio.music.play();

  },
  
  // The "core loop" of the game, called automatically by Phaser when the player is in the Game state
  update: function () {
    if (MetaTWO.game.time.totalElapsedSeconds() > MetaTWO.config.sessionTime){
        this.alive = false;
        MetaTWO.audio.music.stop();
        MetaTWO.audio.music_fast.stop();
        // LOG END-OF-GAME info
        this.state.start(MetaTWO.TimesUp.stateKey);
    }
    // Get user input
    this.poll();

    if (this.justPressed(this.keys.PAUSE) && (!this.paused)){
        this.paused = true;
        MetaTWO.audio.music.stop();
        MetaTWO.audio.music_fast.stop();
        MetaTWO.audio.pause.play();
    }
    else if (this.justPressed(this.keys.PAUSE) && (this.paused)){
        this.paused = false;
        this.fastMusic?MetaTWO.audio.music_fast.play():MetaTWO.audio.music.play();
    }
    // While the game is running, these functions execute every frame
    if (this.alive && !this.paused){
        this.sub_94ee(); // a housekeeping function, named after its original ROM address
        this.drop++;
        this.currentTask(); // only one real "job" is handled every frame, 
                            // this can be moving the zoid, checking for line clears, or updating the score
                            // currentTask is a function pointer
        this.frames++;
    }
  },

  // Possibly the most delicate and important function in the game, translating user input into game commands.
  // This logic is critical for certain advanced strategies once the game becomes super-fast, including charging DAS
  // and allowing for the "Chinese Fireball" maneuver. PLEASE don't modify unless you're explicitly trying to trip up the experts
  // as an experimental condition
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
            if(this.leftCurr || this.rightCurr){} //do nothing - "regular" gravity
            else  if (this.onlyDownHit()){
              this.softdrop_timer = 1;
            }
        }
        else{
            if (this.onlyDown()){
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

  // translates the zoid based on input and DAS
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

                MetaTWO.audio.move.play();
            }
            else{
                this.das = this.DAS_MAX;
            }
        }
    }
  },

  // rotates the zoid depending on input and possibility
  rotate: function(){
      
      if (this.vr !== 0){
          if (!this.zoid.collide(this.board, 0, 0, this.vr)){
              MetaTWO.audio.rotate.play();          

              this.zoid.r += this.vr;
              this.zoid.r = this.zoid.r & 3;
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
            // we're playing the "lock" sound now, but technically the piece doesn't commit until the next frame (in updateTask)
            this.sub_9caf();
            this.currentTask = this.updateTask;
            if (this.drop_points >= 2){
                MetaTWO.audio.slam.play();
            }
            else{
                MetaTWO.audio.lock.play();
            }
        }
    }
  },

  // the dominant "currentTask" of the master loop. We switch out at the end of each episode
  active: function(){
    this.control();
    this.move();
    this.rotate();
    this.gravity();
  },

  updateTask: function(){
    if (this.are === 0){
        this.are = 1;
        if(this.board.commit(this.zoid)){
            //GAME OVER
            this.alive = false;
            MetaTWO.audio.music.stop();
            MetaTWO.audio.music_fast.stop();
            MetaTWO.audio.crash.play();
            // LOG END-OF-GAME INFO
            this.state.start(MetaTWO.GameOver.stateKey);
        }
    }
    
    else if ((!this.fastMusic) && (this.pileHeight() >= 15)){
        this.fastMusic = true;
        MetaTWO.audio.music.stop();
        MetaTWO.audio.music_fast.play();
    }

    if (this._49 < 0x20){
        return;
    }

    this.are = 0;
    this.sub_9caf();
    this.currentTask = this.lineCheck;
    //copy board contents into the backup board, in case there are lines to clear
    this.dummyBoard.contents = JSON.parse(JSON.stringify(this.board.contents));
  },

  lineCheck: function(){
    if(this._49 < 0x20){
        return;
    }
    let row = Math.max(0, this.zoid.y);
    
    row += this.are;

    if ((row < this.dummyBoard.height) && (this.dummyBoard.lineCheck(row))){
        this.dummyBoard.lineDrop(row); //clear lines from "backup" board, copy to actual board at end of animation
        this.lines_this++;
        this.rowsToClear.push(row);
    }

    this.are++;

    if (this.are >= 4){
        this._49 = 0;
        this.are = 0;
        if (this.lines_this !== 0){
            this.currentTask = this.lineAnim;
            // PLAY LINE SOUND
            if((this.lines_this > 0) && (this.lines_this < 4)){
                MetaTWO.audio.clear1.play();
            }
            if (this.lines_this === 4){
                MetaTWO.audio.clear4.play();
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
            MetaTWO.audio.levelup.play();
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
    if ((this.fastMusic) && (this.pileHeight() < 15)){
        this.fastMusic = false;
        MetaTWO.audio.music_fast.stop();
        MetaTWO.audio.music.play();
    }
    // LOG EPISODE info
    this.logUniversal("EP_SUMM", ["SID","ECID","session","game_type","game_number","episode_number","level","score",
    "lines_cleared", "game_duration", "avg_ep_duration", "zoid_sequence"]);
    
    this.currentTask = this.goalCheck;
  },

  goalCheck: function(){
      //not applicable in A-Type MetaTWO
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
    this.episode++;
    this.are = 0;
    this.lines_this = 0;
    this.drop_points = 0;
    this.softdrop_timer = 0;
    this.drop = 0;
    this.vy = 0;
    this.curr = this.next;
    this.next = Math.floor(MetaTWO.mt.random() * 7);
    Math.floor(MetaTWO.mt.random() * 7);
    this.zoid = this.nextZoid;
    //add to zoid buffer
    this.zoidBuff.push(this.zoid.names[this.curr]);
    this.nextZoid = Zoid.spawn(this.next);
    

    this.currentTask = this.active;
  },

  sub_94ee: function(){
    if (this.currentTask === this.lineAnim){
        if ((this.frames & 3) === 0){
            this.are++;
            //advance through line animation
            for (i=0; i < this.rowsToClear.length; i++)
                {
                    switch(this.are){
                        case 1:
                        this.board.contents[this.rowsToClear[i]+3][4] = 0;
                        this.board.contents[this.rowsToClear[i]+3][5] = 0
                        break;
                        case 2:
                        this.board.contents[this.rowsToClear[i]+3][3] = 0;
                        this.board.contents[this.rowsToClear[i]+3][6] = 0
                        if (this.rowsToClear.length === 4) {this.stage.backgroundColor = 0xffffff;}
                        break;
                        case 3:
                        this.board.contents[this.rowsToClear[i]+3][2] = 0;
                        this.board.contents[this.rowsToClear[i]+3][7] = 0
                        this.stage.backgroundColor = 0x050505; 
                        break;
                        case 4:
                        this.board.contents[this.rowsToClear[i]+3][1] = 0;
                        this.board.contents[this.rowsToClear[i]+3][8] = 0
                        if (this.rowsToClear.length === 4) {this.stage.backgroundColor = 0xffffff;}
                        break;
                        case 5:
                        this.board.contents[this.rowsToClear[i]+3][0] = 0;
                        this.board.contents[this.rowsToClear[i]+3][9] = 0
                        break;
                    }
                }
        }
        //else {this.stage.backgroundColor = 0x050505;}
        if (this.are >= this.LINECLEAR_STEPS){
            this.are = 0;
            this.currentTask = this.scoreUpdate;
            this.rowsToClear = [];
            this.stage.backgroundColor = 0x050505; 
            this.board.contents = JSON.parse(JSON.stringify(this.dummyBoard.contents)); //animation is done, copy cleared lines to board for rendering
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
        // if this.currentTask === this.lineAnim, we want to not drae certain blocks
        for(iy = 0; iy<this.board.height; iy++){
            for(ix = 0; ix<this.board.width; ix++){
                if(this.board.isFilled(ix, iy)){
                    switch(this.board.getStyle(ix, iy)){
                        case 0: //large white square, primary color
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+74, 24, 24), this.bgColors[this.level%10][0]);
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+74, 3, 3), 'rgba(255,255,255,1');
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(ix*25+279, iy*25+77, 18, 18), 'rgba(255,255,255,1');
                        break;
                        case 1: // primary color, white highlight
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+74, 24, 24), this.bgColors[this.level%10][0]);
                        this.whiteHighlight(ix*25, iy*25,276,74)
                        break;
                        case 2: //secondary color, white highlight
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(ix*25+276, iy*25+74, 24, 24), this.bgColors[this.level%10][1]);
                        this.whiteHighlight(ix*25, iy*25,276,74)
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
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+74, 24, 24), this.bgColors[this.level%10][0]);
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+74, 3, 3), 'rgba(255,255,255,1');
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+279, blocks[i][1]*25+77, 18, 18), 'rgba(255,255,255,1');
                        break;
                        case 1: // primary color, white highlight
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+74, 24, 24), this.bgColors[this.level%10][0]);
                        this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,276,74)
                        break;
                        case 2: //secondary color, white highlight
                        MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+74, 24, 24), this.bgColors[this.level%10][1]);
                        this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,276,74)
                    }
                    // MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+276, blocks[i][1]*25+99, 24, 24), 'rgba(0,0,255,1)');
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
                    MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+100, 24, 24), this.bgColors[this.level%10][0]);
                    MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+100, 3, 3), 'rgba(255,255,255,1');
                    MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+528, blocks[i][1]*25+103, 18, 18), 'rgba(255,255,255,1');
                    break;
                    case 1: // primary color, white highlight
                    MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+100, 24, 24), this.bgColors[this.level%10][0]);
                    this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,525,103)
                    break;
                    case 2: //secondary color, white highlight
                    MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+525, blocks[i][1]*25+100, 24, 24), this.bgColors[this.level%10][1]);
                    this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25,525,103)
                }
                // MetaTWO.game.debug.geom(new Phaser.Rectangle(blocks[i][0]*25+ 525, blocks[i][1]*25+125, 24, 24), 'rgba(0,0,255,1)');
                // this.whiteHighlight(blocks[i][0]*25, blocks[i][1]*25, 525, 125)
            }
        //}
    }
    else { // game is paused
        MetaTWO.game.debug.text("Paused", 360, 300, "#ffffff","24px Arial");
    }

    //MetaTWO.game.debug.text("fps: " + MetaTWO.game.time.fps, 2, 14, "#00ff00");
    // MetaTWO.game.debug.text("softdrop: " + this.softdrop_timer, 2, 30, "#00ff00");
    // MetaTWO.game.debug.text("level: " + this.level, 2, 46, "#00ff00");
    // MetaTWO.game.debug.text("line count: " + this.lines, 2, 62, "#00ff00");
    // MetaTWO.game.debug.text("vx: " + this.vx, 2, 78, "#00ff00");
    // MetaTWO.game.debug.text("are: " + this.are, 2, 94, "#00ff00");

    //let das_rect = new Phaser.Rectangle(2, 94, this.das * 10, 12);
    //MetaTWO.game.debug.geom(das_rect, 'rgba(0,255,0,1)')

    //MetaTWO.game.debug.text("score: " + this.score, 2, 110, "#00ff00", "24px Arial");
    //MetaTWO.game.debug.text("pile: " + this.pileHeight(), 2, 126, "#00ff00", "24px Arial");
    //MetaTWO.game.debug.text("Down: " + this.downCurr, 2, 142, "#ffffff");
    //MetaTWO.game.debug.text("Downhit: " + this.justPressed(this.keys.DOWN), 2, 158, "#ffffff");

    this.scoreDisplay.text = this.score.toString() + "\n\n" + this.lines.toString() + "\n\n" + this.level.toString();
    this.gameNumberDisplay.text = "Game: " + MetaTWO.gameNumber;
  },

  whiteHighlight: function(x,y,offsetx, offsety){
    MetaTWO.game.debug.geom(new Phaser.Rectangle(x + offsetx, y + offsety, 3, 3), 'rgba(255,255,255,1)');
    MetaTWO.game.debug.geom(new Phaser.Rectangle(x + offsetx + 3, y + offsety + 3, 6, 3), 'rgba(255,255,255,1)');
    MetaTWO.game.debug.geom(new Phaser.Rectangle(x + offsetx + 3, y + offsety + 6, 3, 3), 'rgba(255,255,255,1)');

  },

  poll: function(){
    this.leftPrev = this.leftCurr;
    this.rightPrev = this.rightCurr;
    this.downPrev = this.downCurr;
    this.rotatePrev = this.rotateCurr;
    this.counterRotatePrev = this.counterRotateCurr;
    this.pausePrev = this.pauseCurr;

    if (MetaTWO.game.input.gamepad.supported && MetaTWO.game.input.gamepad.active && this.gamepad.connected){
        this.AButton = this.gamepad.isDown(MetaTWO.config.AButton);
        this.BButton = this.gamepad.isDown(MetaTWO.config.BButton);
        this.downButton = this.gamepad.isDown(MetaTWO.config.downButton);
        this.leftButton = this.gamepad.isDown(MetaTWO.config.leftButton);
        this.rightButton = this.gamepad.isDown(MetaTWO.config.rightButton);
        this.startButton = this.gamepad.isDown(MetaTWO.config.startButton);
    }

    this.leftCurr =  this.leftButton || this.leftKey.isDown;
    this.rightCurr =  this.rightButton || this.rightKey.isDown;
    this.downCurr =  this.downButton || this.downKey.isDown;
    this.rotateCurr = this.AButton || this.rotateKey.isDown;
    this.counterRotateCurr = this.BButton || this.counterRotateKey.isDown;
    this.pauseCurr = this.startButton || this.pauseKey.isDown;
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

  onlyDownHit: function(){
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

  onlyDown: function(){
      //special function to determine if the down key is the only one down right now
      if (this.downCurr &&
            !this.leftCurr &&
            !this.rightCurr &&
            !this.rotateCurr &&
            !this.counterRotateCurr){
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

  shutdown: function(){

  },

  //test loglist
  //loglist = ["SID","ECID","session","game_type","game_number","episode_number","level","score","lines_cleared"];
  //LOGGING FUNCTIONS
  //def log_universal( self, event_type, loglist, complete = False, evt_id = False, evt_data1 = False, evt_data2 = False, eyes = False, features = False):
  logUniversal: function(event_type, loglist, {complete = false, evt_id = false, evt_data1 = false, evt_data2 = false}={}){
    let data = [];
    let logit = function(val, key){
        if (loglist.indexOf(key) !== -1){
            data.push(val);
        }
        else {data.push("");}
    }
    data.push(MetaTWO.game.time.totalElapsedSeconds());
    data.push(event_type);
    logit(MetaTWO.config.subjectNumber, "SID");
    logit(MetaTWO.config.ECID, "ECID");
    logit(MetaTWO.config.session, "session");
    logit(MetaTWO.config.gameType, "game_type");
    logit(MetaTWO.gameNumber, "game_number")
    logit(this.episode, "episode_number")
    logit(this.level, "level");
    logit(this.score, "score");
    logit(this.lines, "lines_cleared");
    logit(complete, "completed");
    logit(MetaTWO.game.time.totalElapsedSeconds() - this.gameStartTime, "game_duration")
    logit((MetaTWO.game.time.totalElapsedSeconds() - this.gameStartTime) / (this.episode + 1), "avg_ep_duration");
    //comes in GAME_SUMM and looks like"
    // '["T", "Z", "O", "O", "T", "I", "T", "Z", "L", "I", "I", "O", "S", "Z", "T"]'
    logit(JSON.stringify(this.zoidBuff), "zoid_sequence");
    
    if (evt_id){
        data.push(evt_id);
    }
    else {data.push("");}
    if (evt_data1){
        data.push(evt_data1);
    }
    else {data.push("");}
    if (evt_data2){
        data.push(evt_data2);
    }
    else {data.push("");}

    logit(this.zoid.names[this.curr], "curr_zoid");
    logit(this.nextZoid.names[this.next], "next_zoid");
   
    //console.log(data);
  }
};
