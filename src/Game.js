// All gameplay logic. Algorithms genereously mined from ROM by Alex Kerr. See reference/Player.py

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
    this.masterLog = "";
    this.changeOccured = false; 
    this.renderClear = this.add.group();
    this.whitePool = this.add.group();
    this.primPool0 = this.add.group();
    this.primPool1 = this.add.group();
    this.primPool2 = this.add.group();
    this.test1 = 0;
    this.test2 = 0;
    
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
    
//     graphics.lineStyle(2, 0xFFFFFF, 1);
//     graphics.beginFill(0xFFFFFF);
//     graphics.drawRect(0, 0, 24, 24);//, this.bgColors[this.level%10][0]);
//     graphics.endFill();
//     
    
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
    this.curr = Math.floor(MetaTWO.mt.random() * 7);
    //throw away next value, because current Mersenne Twister implementation
    //only matches Python value every other iteration. No idea why
    Math.floor(MetaTWO.mt.random() * 7);

    this.next = Math.floor(MetaTWO.mt.random() * 7);
    Math.floor(MetaTWO.mt.random() * 7);
    this.zoid = Zoid.spawn(this.curr);
    
    
    this.firstDraw = 1;
    this.zoid_prim();
//     this.create_zoid_prims();
    this.pile = this.add.group();
    //add to zoid buffer
    this.zoidBuff.push(this.zoid.names[this.curr]);
    this.nextZoid = Zoid.spawn(this.next);

    this.create_zoid_render();
    this.paused = false;
        
    this.alive = true;
    if(typeof MetaTWO.config.startLevel === "string"){
        MetaTWO.config.startLevel = parseInt(MetaTWO.config.startLevel);
        }
    if(typeof MetaTWO.config.startLevel === "number"){
        this.level = MetaTWO.config.startLevel; //this.start_level;
//         this.level = 0;
        }else{
            if(MetaTWO.config.startLevel.length >= MetaTWO.gameNumber){
                this.level = MetaTWO.config.startLevel[MetaTWO.gameNumber-1]; //this.start_level;
                } else{
                this.level = MetaTWO.config.startLevel[MetaTWO.config.startLevel.length-1]; //this.start_level;
            }
        }
    
//     this.level = MetaTWO.config.startLevel;
    this.lines = 0;
    this.score = 0;
    
    this.are = 0;
    this._49 = 0;
    this.drop = 0;
  },

  start: function(){
    
    this.currentTask = this.active; 
    //From Alex:
    //A negative value is loaded into the soft drop counter for pre-gravity on the first piece.
    //As such, pre-gravity can be canceled out of by pressing Down to start soft dropping.
    this.softdrop_timer = -this.GRAVITY_START_DELAY;
    MetaTWO.audio.music.play();
    cur = Date.now()
    this.logEvent("GAME", "BEGIN", cur);
    
  },
  
  // The "core loop" of the game, called automatically by Phaser when the player is in the Game state
  update: function () {
    if (MetaTWO.game.time.totalElapsedSeconds() > MetaTWO.config.sessionTime){
        this.alive = false;
        MetaTWO.audio.music.stop();
        MetaTWO.audio.music_fast.stop();
        // LOG END-OF-GAME info
        this.logGameSumm();
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
        this.logWorld();
    }
    //make sure, every frame, we move the current zoidRender to the right spot
    if ((this.changeOccured === true) && (this.zoidRender.children.length > 0)){
              let blocks = this.zoid.getBlocks();
                for (i=0; i< 4; i++){
                        this.zoidRender.xy(i*2, blocks[i][0]*25+278, blocks[i][1]*25+74);
                        this.zoidRender.xy(i*2+1, blocks[i][0]*25+278, blocks[i][1]*25+74);
        }
        

    }
    this.changeOccured = false; 
//     MetaTWO.game.updateRender()

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
                // right now drop_points gets reset to 0 if you're no longer holding down. 
                this.drop_points = 0;
            }
        }
    }

    if (this.justPressed(this.keys.ROTATE)){
        this.vr = 1;
        this.changeOccured = true; 
    }
    else if (this.justPressed(this.keys.COUNTERROTATE)){
        this.vr = -1;
        this.changeOccured = true; 
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
                this.changeOccured = true; 
//                 this.zoidRender.position.x += this.vx*25
                this.logEvent("ZOID", "TRANSLATE", this.vx.toString());
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
              this.logEvent("ZOID", "ROTATE", this.vr.toString());

              this.zoid.r += this.vr;
              this.zoid.r = this.zoid.r & 3;
//               this.zoidRender.angle += this.vr*90;
          }

      }
  },


  gravity: function(){
    if (this.softdrop_timer < 0){
        return;
    }
    if ((this.vy !== 0) || (this.drop >= this.speedLevels[this.level<29?this.level:29])){
        if (this.vy !== 0) {this.logEvent("ZOID", "U-DOWN", "");}
            else {this.logEvent("ZOID", "DOWN", "");}
        this.vy = 0;
        this.drop = 0;
        if (!this.zoid.collide(this.board, 0, 1, 0)){
            this.zoid.y++;
            this.changeOccured = true; 
//             this.zoidRender.position.y += 25
        }
        else{
            // we're playing the "lock" sound now, but technically the piece doesn't commit until the next frame (in updateTask)
            this.sub_9caf();
            this.currentTask = this.updateTask;
            this.logEvent("PLACED", this.zoid.names[this.curr], "");
            if (this.drop_points >= 2){
                MetaTWO.audio.slam.play();
                this.logEvent("ZOID", "SLAMMED", "");
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
            this.logGameSumm();
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
        // compile zoid to pile
        this.zoidRender.moveAll(this.pile);
        this.zoidRender = this.add.group();
        this.renderClear.addMultiple(this.pile.getAll('y', row*25+74));
        
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
            
//             this.primPool0.killAll();
//             this.primPool0.removeAll();
//             this.primPool0.destroy();
//             this.primPool1.killAll();
//             this.primPool1.removeAll();
//             this.primPool1.destroy();
//             this.primPool2.killAll();
//             this.primPool2.removeAll();
//             this.primPool2.destroy();
//             
//             this.zoid_prim();
//             this.recolor_pile();
//             var col1o = Phaser.Color.webToColor(this.bgColors[this.level%10][0]);
//             var col2o = Phaser.Color.webToColor(this.bgColors[this.level%10][1]);
            var col1 = Phaser.Color.webToColor(this.bgColors[(this.level+1)%10][0]);            
            var col2 = Phaser.Color.webToColor(this.bgColors[(this.level+1)%10][1]);
//             primPool0 = MetaTWO.game.make.bitmapData();
//             primPool0.drawGroup(this.primPool0);
//             primPool0.replaceRGB(col1o.r,col1o.g,col1o.b,col1n.r,col1n.g,col1n.b);
//             this.primPool0 = primPool0
            this.primPool0.setAllChildren('tint', Phaser.Color.RGBtoString(col1.r,col1.g,col1.b,"#")); 
            this.primPool1.setAllChildren('tint', Phaser.Color.RGBtoString(col1.r,col1.g,col1.b,"#"));
            this.primPool2.setAllChildren('tint',Phaser.Color.RGBtoString(col2.r,col2.g,col2.b,"#"));
//             primPool1 = MetaTWO.game.make.bitmapData(); 
//             primPool1.drawGroup(this.primPool1);
//             primPool1.replaceRGB(col1o.r,col1o.g,col1o.b,col1n.r,col1n.g,col1n.b);
//             this.primPool1 = primPool1;
//             
//             primPool2 = MetaTWO.game.make.bitmapData();
//             primPool2.drawGroup(this.primPool2);
//             primPool2.replaceRGB(col2o.r,col2o.g,col2o.b,col2n.r,col2n.g,col2n.b);
//             this.primPool2 = primPool2;
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
    this.logEpisode();
    this.logEvent("EPISODE", "END", "");    
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
    this.firstDraw = 1;
    //move rendered curr zoid to pile
    this.zoidRender.moveAll(this.pile);
    //render new zoid
    this.zoidNext.destroy();
    this.create_zoid_render();
    this.logEvent("ZOID", "NEW", this.zoid.names[this.curr]);
    this.logEvent("EPISODE", "BEGIN", "");
    this.currentTask = this.active;
  },
  
  sub_94ee: function(){
    if (this.currentTask === this.lineAnim){
        if ((this.frames & 3) === 0){
            this.update_pile();
            this.are++;
            //advance through line animation
            for (i=0; i < this.rowsToClear.length; i++)
                {
                    switch(this.are){
                        case 1:
                        this.board.contents[this.rowsToClear[i]+3][4] = 0;
                        this.board.contents[this.rowsToClear[i]+3][5] = 0;
                        
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(4*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(5*25 + 276, (this.rowsToClear[i])*25 + 74)));
                        break;
                        case 2:
                        this.board.contents[this.rowsToClear[i]+3][3] = 0;
                        this.board.contents[this.rowsToClear[i]+3][6] = 0;
                        if (this.rowsToClear.length === 4) {this.stage.backgroundColor = 0xffffff;}
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(3*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(6*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));

                        break;
                        case 3:
                        this.board.contents[this.rowsToClear[i]+3][2] = 0;
                        this.board.contents[this.rowsToClear[i]+3][7] = 0
                        this.stage.backgroundColor = 0x050505; 
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(2*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(7*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));

                        break;
                        case 4:
                        this.board.contents[this.rowsToClear[i]+3][1] = 0;
                        this.board.contents[this.rowsToClear[i]+3][8] = 0
                        if (this.rowsToClear.length === 4) {this.stage.backgroundColor = 0xffffff;}
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(1*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(8*25 + 276, (this.rowsToClear[i]+1)*25 + 74)));
                        
                        break;
                        case 5:
                        this.board.contents[this.rowsToClear[i]+3][0] = 0;
                        this.board.contents[this.rowsToClear[i]+3][9] = 0;
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(0*25 + 276, (this.rowsToClear[i])*25 + 74)));
//                         this.renderClear.remove(this.renderClear.getClosestTo(new Phaser.Point(9*25 + 276, (this.rowsToClear[i])*25 + 74)));
                        break;
                    }
                }
        }
        //else {this.stage.backgroundColor = 0x050505;}
        if (this.are >= this.LINECLEAR_STEPS){
            this.update_pile();
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
  
  update_pile: function(){
    curDestroy = this.add.group();
    switch(this.are){

    case 1:
    curDestroy.addMultiple(this.renderClear.getAll('x', 4*25+276));
    curDestroy.addMultiple(this.renderClear.getAll('x', 5*25+276));
    curDestroy.callAll('kill');
    curDestroy.setAllChildren('x', -1000)
    curDestroy.setAllChildren('y', -1000)
    curDestroy.callAll('revive');
//     curDestroy.destroy();
    break;
    
    case 2:
    curDestroy.addMultiple(this.renderClear.getAll('x', 3*25+276));
    curDestroy.addMultiple(this.renderClear.getAll('x', 6*25+276));
    curDestroy.callAll('kill');
    curDestroy.setAllChildren('x', -1000)
    curDestroy.setAllChildren('y', -1000)
    curDestroy.callAll('revive');
//     curDestroy.destroy();
    break;
    
    case 3:
    curDestroy.addMultiple(this.renderClear.getAll('x', 2*25+276));
    curDestroy.addMultiple(this.renderClear.getAll('x', 7*25+276));
    curDestroy.callAll('kill');
    curDestroy.setAllChildren('x', -1000)
    curDestroy.setAllChildren('y', -1000)
    curDestroy.callAll('revive');
//     curDestroy.destroy();
    break;
    
    case 4:
    curDestroy.addMultiple(this.renderClear.getAll('x', 1*25+276));
    curDestroy.addMultiple(this.renderClear.getAll('x', 8*25+276));
    curDestroy.callAll('kill');
    curDestroy.setAllChildren('x', -1000)
    curDestroy.setAllChildren('y', -1000)
    curDestroy.callAll('revive');
//     curDestroy.destroy();
    break;
    
    case 5:
    {
    this.are = 0;
    curDestroy.killAll();
//     curDestroy.destroy();
    this.renderClear.callAll('kill');
    this.renderClear.setAllChildren('x', -1000)
    this.renderClear.setAllChildren('y', -1000)
    this.renderClear.callAll('revive');
    

    curbin = this.add.group();

    this.test1 = this.renderClear.length;

//     curbin.addMultiple(this.renderClear.getAll('home', 0));
//     curbin.moveAll(this.whitePool);
    curbin.addMultiple(this.renderClear.getAll('home', 1));
    curbin.moveAll(this.primPool0);
    curbin.addMultiple(this.renderClear.getAll('home', 2));
    curbin.moveAll(this.primPool1);
    curbin.addMultiple(this.renderClear.getAll('home', 3));
    curbin.moveAll(this.primPool2);
    this.renderClear.moveAll(this.whitePool)
    this.test2 = this.renderClear.length;
//     this.renderClear.destroy();
    this.renderClear = this.add.group();
    this.stage.backgroundColor = 0x050505;
    for(i=0; i < this.rowsToClear.length; i++){
        this.tempI = this.rowsToClear[i]+1
        
        var index = -1;
        //phaser's filter isn't working, so here's it manual
        var length = this.pile.children.length;
        var results = [];

        while (++index < length){
            var child = this.pile.children[index];
            if (child.exists){
                if (child.position.y < (71+25*this.rowsToClear[i])){
                    child.position.y += 25;
                }
            }
        }
        

//         MetaTWO.game.debug.text("childs: " + Object.getOwnPropertyNames(this.tempGroup), 2, 210, "#00ff00");
//         tempGroup.addAll("position.y", 25);
    }
    }
    break;
    
   }
  //basically we need to do the Line Drop function...
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
  
  zoid_prim: function(){
    
//     this.zoidPrim0 = this.add.group();
    let zp = MetaTWO.game.add.graphics();
    
    //whitespace object
    zp.beginFill(0xffffff, 1);
    zp.drawRect(0, 0, 3, 3);
    zp.drawRect(3, 3, 6, 3);
    zp.drawRect(3, 6, 3, 3);
    zp.endFill();
    this.whitespace = zp.generateTexture();
    zp.destroy();    
    
//     zp = MetaTWO.game.add.graphics();
//     zp.lineStyle(3, Phaser.Color.webToColor(this.bgColors[this.level%10][0]).color, 1);
//     zp.beginFill(0xffffff);
//     zp.drawRect(0, 0, 24, 24);//, this.bgColors[this.level%10][0]);
//     zp.endFill();
//     this.zoidPrim0 = zp.generateTexture();
// //     this.zoidPrim0 = MetaTWO.game.add.image(274,71, zoidPrim0);
//     zp.destroy();

    
//     this.zoidPrim1 = this.add.group();
    var col1 = Phaser.Color.webToColor(this.bgColors[this.level%10][0]);
    var col2 = Phaser.Color.webToColor(this.bgColors[this.level%10][1]);
    this.zoidPrim0 = MetaTWO.game.make.bitmapData(); 
    this.zoidPrim0.ctx.lineWidth = 3;
    this.zoidPrim0.ctx.strokeStyle =  Phaser.Color.RGBtoString(col1.r,col1.g,col1.b,"#");
    this.zoidPrim0.ctx.beginPath();

    this.zoidPrim0.ctx.rect(1, 1, 20, 20);
    this.zoidPrim0.ctx.fillStyle = '#ffffff';
    this.zoidPrim0.ctx.fill();
    this.zoidPrim0.ctx.stroke();



    this.zoidPrim1 = MetaTWO.game.make.bitmapData(); 
    this.zoidPrim1.ctx.lineWidth = 3;
    this.zoidPrim1.ctx.strokeStyle =  Phaser.Color.RGBtoString(col1.r,col1.g,col1.b,"#");
    this.zoidPrim1.ctx.beginPath();

    this.zoidPrim1.ctx.rect(1, 1, 20, 20);
    this.zoidPrim1.ctx.fillStyle = Phaser.Color.RGBtoString(col1.r,col1.g,col1.b,"#");
    this.zoidPrim1.ctx.fill();
    this.zoidPrim1.ctx.stroke();
    
    
//     zp = MetaTWO.game.add.graphics();
//     zp.lineStyle(3, Phaser.Color.webToColor(this.bgColors[this.level%10][0]).color, 1);
//     zp.beginFill(Phaser.Color.webToColor(this.bgColors[this.level%10][0]).color);
//     zp.drawRect(0, 0, 24, 24);
//     zp.endFill();
//     this.zoidPrim1 = zp.generateTexture();
//     zp.destroy();   


    
//     this.zoidPrim2 = this.add.group();
//     zp = MetaTWO.game.add.graphics();
//     zp.lineStyle(3, Phaser.Color.webToColor(this.bgColors[this.level%10][1]).color, 1);
//     zp.beginFill(Phaser.Color.webToColor(this.bgColors[this.level%10][1]).color);
//     zp.drawRect(0, 0, 24, 24);
//     zp.endFill();
//     this.zoidPrim2 = zp.generateTexture();
//     zp.destroy();
    
    this.zoidPrim2 = MetaTWO.game.make.bitmapData(); 
    this.zoidPrim2.ctx.lineWidth = 3;
    this.zoidPrim2.ctx.strokeStyle =  Phaser.Color.RGBtoString(col2.r,col2.g,col2.b,"#");
    this.zoidPrim2.ctx.beginPath();

    this.zoidPrim2.ctx.rect(1, 1, 20, 20);
    this.zoidPrim2.ctx.fillStyle = Phaser.Color.RGBtoString(col2.r,col2.g,col2.b,"#");
    this.zoidPrim2.ctx.fill();
    this.zoidPrim2.ctx.stroke();
    
    //debug
    zp = MetaTWO.game.add.graphics();
    zp.beginFill(0xff00000);
    zp.drawRect(0, 0, 24, 24);
    zp.endFill();
    this.debugPrim = zp.generateTexture();
    zp.destroy();    

    this.create_zoid_prims()
  },
  create_zoid_prims: function(){
    var prim;

  // define obstacle group
  this.prims = MetaTWO.game.add.group();
  this.prims.enableBody = true;
  

    for (i = 0; i < ((MetaTWO.BOARD_WIDTH * MetaTWO.BOARD_HEIGHT)*2+10); i++) {
                        //just highlight
                        prim = this.prims.create(-1000,-1000, this.whitespace)
                        prim.checkWorldBounds = true;
                        prim.outOfBoundsKill = true;
                        prim.kill();
                        prim.home = 0;
                        this.whitePool.add(prim);

                        
                        //large white square, primary color
//                         prim = this.prims.create(-1000, -1000, this.zoidPrim0)
                        prim = MetaTWO.game.add.sprite(-1000, -1000, this.zoidPrim0);
                    
                        prim.checkWorldBounds = true;
                        prim.outOfBoundsKill = true;
                        prim.kill();
//                         prim.home = 1;
                        this.primPool0.add(prim);
                        

                         // primary color, white highlight
//                         prim = this.prims.create(-1000, -1000, this.zoidPrim1)
                        prim = MetaTWO.game.add.sprite(-1000, -1000, this.zoidPrim1);
                        prim.checkWorldBounds = true;       
                        prim.outOfBoundsKill = true;
                        prim.kill();
//                         prim.home = 2;
                        this.primPool1.add(prim);
                        

                         //secondary color, white highlight
//                         prim = this.prims.create(-1000, -1000, this.zoidPrim2)
                        prim = MetaTWO.game.add.sprite(-1000, -1000, this.zoidPrim2);
                        prim.checkWorldBounds = true;
                        prim.outOfBoundsKill = true;
                        prim.kill();
//                         prim.home = 3;
                        this.primPool2.add(prim);

        

        
        
    }
    this.whitePool.setAllChildren('home', 0);
    this.primPool0.setAllChildren('home', 1);
    this.primPool1.setAllChildren('home', 2);
    this.primPool2.setAllChildren('home', 3);
  },
  recolor_pile: function(){
    this.pile.killAll();
    this.pile.removeAll();
    this.pile.destroy();
    this.pile = this.add.group()
    for(iy = 0; iy<this.board.height; iy++){
        for(ix = 0; ix<this.board.width; ix++){
            if(this.board.isFilled(ix, iy)){
                switch(this.board.getStyle(ix, iy)){
                        case 0:
                        var zprim = this.primPool0.getFirstExists(exists=false);
                        zprim.reset(ix*25+278, iy*25+74);
                        this.pile.add(zprim)
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset(ix*25+278, iy*25+74);
                        this.pile.add(zprim)
                        break;
                        
                        case 1:
                        var zprim = this.primPool1.getFirstExists(exists=false);
                        zprim.reset(ix*25+278, iy*25+74);
                        this.pile.add(zprim);
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset(ix*25+278, iy*25+74);
                        this.pile.add(zprim)
                        break;
                        
                        case 2:
                        var zprim = this.primPool2.getFirstExists(exists=false)
                        zprim.reset(ix*25+278, iy*25+74);
                        this.pile.add(zprim);
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset(ix*25+278, iy*25+74);
                        this.pile.add(zprim)
                        break;
                        }
                    }
                }
            }
                
},
  create_zoid_render: function(){
//       let graphics = MetaTWO.game.add.graphics();
//     graphics.lineStyle(2, 0x00FF00, 1);    
//     graphics.drawRect(0, 0, 252, 503);
//     graphics.drawRect(320,0,120,120)
//     let frameImage = graphics.generateTexture();

//             let zr = MetaTWO.game.add.graphics();
            
            let blocks = this.zoid.getBlocks();
            this.zoidNext = this.add.group()
            this.zoidRender = this.add.group();
            
//             this.zoidRender.x = 276+25*this.rotCenter[this.zoid.zoidType][0];
//             this.zoidRender.y = 74+25*this.rotCenter[this.zoid.zoidType][1];


            var mask = MetaTWO.game.add.graphics(276, 74);

    //  Shapes drawn to the Graphics object must be filled.
            mask.beginFill(0x00FFFFF);

    //  Here we'll draw a rectangle for each group sprite
            mask.drawRect(0, 0, 252, 503);
            mask.endFill();

//             let group = this.add.group();
            for (i=0; i< 4; i++){
                if(blocks[i][1] >= 0){
                    switch(this.zoid.style){
                        case 0:
                        var zprim = this.primPool0.getFirstExists(exists=false);
//                         if(!zprim){
//                         MetaTWO.game.debug.text("Helpful Text: " + this.zoid.style, 2, 28, "#00ff00");
//                         }
                        zprim.reset((blocks[i][0])*25+278, (blocks[i][1])*25+74);
                        this.zoidRender.add(zprim)
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+278, (blocks[i][1])*25+74);
                        this.zoidRender.add(zprim)
                        break;
                        
                        case 1:
                        var zprim = this.primPool1.getFirstExists(exists=false);
//                         if(!zprim){
//                         MetaTWO.game.debug.text("Helpful Text: " + this.zoid.style, 2, 28, "#00ff00");
//                         }
                        zprim.reset((blocks[i][0])*25+278, (blocks[i][1])*25+74);
                        this.zoidRender.add(zprim);                        
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+278, (blocks[i][1])*25+74);
                        this.zoidRender.add(zprim)
                        break;
                        
                        case 2:
                        var zprim = this.primPool2.getFirstExists(exists=false);
                        
//                         if(!zprim){
//                         MetaTWO.game.debug.text("Helpful Text: " + this.zoid.style, 2, 28, "#00ff00");
//                         }
                        zprim.reset((blocks[i][0])*25+278, (blocks[i][1])*25+74);
                        this.zoidRender.add(zprim);
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+278, (blocks[i][1])*25+74);
                        this.zoidRender.add(zprim)
                        break;
                        
                        
                        }
                    }

                }
    
            blocks = this.nextZoid.getBlocks();
            for (i=0; i< 4; i++){
                if(blocks[i][1] >= 0){
                    switch (this.nextZoid.style){
                        case 0:
                        var zprim = this.primPool0.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+525, (blocks[i][1])*25+100);
                        this.zoidNext.add(zprim)
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+525, (blocks[i][1])*25+100);
                        this.zoidNext.add(zprim)
                        break;
                        
                        case 1:
                        var zprim = this.primPool1.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+525, (blocks[i][1])*25+100);
                        this.zoidNext.add(zprim);
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+525, (blocks[i][1])*25+100);
                        this.zoidNext.add(zprim)
                        break;
                        
                        case 2:
                        var zprim = this.primPool2.getFirstExists(exists=false)
                        zprim.reset((blocks[i][0])*25+525, (blocks[i][1])*25+100);
                        this.zoidNext.add(zprim);
                        var zprim = this.whitePool.getFirstExists(exists=false);
                        zprim.reset((blocks[i][0])*25+525, (blocks[i][1])*25+100);
                        this.zoidNext.add(zprim)
                        break;
                        
                    }

                }
            }
            this.zoidRender.mask = mask;
//             this.zoidRender.add(zr);
  },

  render: function(){
//     c2 =Phaser.Color.webToColor(this.bgColors[this.level%10][0])
//     this.zoidRender.pivot.x += 1
//     this.zoidRender.pivot.y += 1
//     if(this.rowsToClear.length >0){
//     this.test2 = this.rowsToClear;
//     }
//     this.renderClear = this.pile.getAll('y', 19*25+74)
// 
//     var col1 = Phaser.Color.webToColor(this.bgColors[this.level%10][0]);
//         MetaTWO.game.debug.text("childs: " + Phaser.Color.RGBtoString(col1.r,col1.g,col1.b,"#"), 2, 195, "#00ff00");
        
//     MetaTWO.game.debug.text("fps: " + Object.getOwnPropertyNames(this.zoidRender.children[0]), 2, 15, "#00ff00");
//     MetaTWO.game.debug.text("pivotx: " + Object.getOwnPropertyNames(this.primPool0.children[0]), 2, 30, "#00ff00");
//     MetaTWO.game.debug.text("pivoty: " + Object.getOwnPropertyNames(this.zoidRender.children[1]), 2, 45, "#00ff00");
//     MetaTWO.game.debug.text("top: " + Phaser.Color.webToColor(this.bgColors[this.level%10][0]).r, 2, 60, "#00ff00");
//     MetaTWO.game.debug.text("left: " + Phaser.Color.webToColor(this.bgColors[this.level%10][0]).g, 2, 75, "#00ff00");
    MetaTWO.game.debug.text("deadW: " + this.whitePool.countDead(), 2, 90, "#00ff00");
    MetaTWO.game.debug.text("dead0: " + this.primPool0.countDead(), 2, 105, "#00ff00");
    MetaTWO.game.debug.text("dead1: " + this.primPool1.countDead(), 2, 120, "#00ff00");
// 
//     
        MetaTWO.game.debug.text("dead2: " + this.primPool1.countDead(), 2, 135, "#00ff00");
// 
//         MetaTWO.game.debug.text("childs: " + this.test1, 2, 150, "#00ff00");
//         MetaTWO.game.debug.text("childs: " + this.test2, 2, 165, "#00ff00");
//         this.excount2 = this.primPool0.getAll('home', 1).length;
//          MetaTWO.game.debug.text("childs: " + this.primPool0.children[0].home, 2, 180, "#00ff00");
// 
//     MetaTWO.game.debug.text("pileliving: " + this.pile.countLiving(), 2, 195, "#00ff00");
//     MetaTWO.game.debug.text("piledead: " + this.pile.countDead(), 2, 210, "#00ff00");
// 
//     MetaTWO.game.debug.text("fps: " + this.zoid.type, 2, 34, "#00ff00");
//     
    if (this.paused){ // game is paused
        MetaTWO.game.debug.text("Paused", 360, 300, "#ffffff","24px Arial");
    }

    MetaTWO.game.debug.text("fps: " + MetaTWO.game.time.fps, 2, 14, "#00ff00");
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
        if(MetaTWO.config.pad === "axis"){
                if(this.downCurr){
                this.downButton = (this.gamepad.axis(Phaser.Gamepad.AXIS_1) > MetaTWO.config.releaseSensitivity);
                } else{
                this.downButton = (this.gamepad.axis(Phaser.Gamepad.AXIS_1) > MetaTWO.config.pressSensitivity);
                }
                if(this.leftCurr){
                this.leftButton = (this.gamepad.axis(Phaser.Gamepad.AXIS_0) < -(MetaTWO.config.releaseSensitivity));
                }else{
                this.leftButton = (this.gamepad.axis(Phaser.Gamepad.AXIS_0) < -(MetaTWO.config.pressSensitivity));
                }
                if(this.rightCurr){
                this.rightButton = (this.gamepad.axis(Phaser.Gamepad.AXIS_0) > MetaTWO.config.releaseSensitivity);
                }else{
                this.rightButton = (this.gamepad.axis(Phaser.Gamepad.AXIS_0) > MetaTWO.config.pressSensitivity);
                }
                } else{
        this.downButton = this.gamepad.isDown(MetaTWO.config.downButton);
        this.leftButton = this.gamepad.isDown(MetaTWO.config.leftButton);
        this.rightButton = this.gamepad.isDown(MetaTWO.config.rightButton);
        }
        this.startButton = this.gamepad.isDown(MetaTWO.config.startButton);
    }

    this.leftCurr =  this.leftButton || this.leftKey.isDown;
    this.rightCurr =  this.rightButton || this.rightKey.isDown;
    this.downCurr =  this.downButton || this.downKey.isDown;
    this.rotateCurr = this.AButton || this.rotateKey.isDown;
    this.counterRotateCurr = this.BButton || this.counterRotateKey.isDown;
    this.pauseCurr = this.startButton || this.pauseKey.isDown;

    if (this.leftCurr && !this.leftPrev) {this.logEvent("KEYPRESS", "PRESS", "LEFT");}
    if (!this.leftCurr && this.leftPrev) {this.logEvent("KEYPRESS", "RELEASE", "LEFT");}
    if (this.rightCurr && !this.rightPrev) {this.logEvent("KEYPRESS", "PRESS", "RIGHT");}
    if (!this.rightCurr && this.rightPrev) {this.logEvent("KEYPRESS", "RELEASE", "RIGHT");}
    if (this.downCurr && !this.downPrev) {this.logEvent("KEYPRESS", "PRESS", "DOWN");}
    if (!this.downCurr && this.downPrev) {this.logEvent("KEYPRESS", "RELEASE", "DOWN");}
    if (this.rotateCurr && !this.rotatePrev) {this.logEvent("KEYPRESS", "PRESS", "A");}
    if (!this.rotateCurr && this.rotatePrev) {this.logEvent("KEYPRESS", "RELEASE", "A");}
    if (this.counterRotateCurr && !this.counterRotatePrev) {this.logEvent("KEYPRESS", "PRESS", "B");}
    if (!this.counterRotateCurr && this.counterRotatePrev) {this.logEvent("KEYPRESS", "RELEASE", "B");}
    if (this.pauseCurr && !this.pausePrev) {this.logEvent("KEYPRESS", "PRESS", "PAUSE");}
    if (!this.pauseCurr && this.pausePrev) {this.logEvent("KEYPRESS", "RELEASE", "PAUSE");}
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
        if(MetaTWO.config.logging == true){
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
    
    //Timers!
    logit(this.are.toString(), "are");
    logit(this.das.toString(), "das");
    logit(this.softdrop_timer.toString(), "softdrop");

    logit(JSON.stringify(this.board.contents.slice(3,23)), "board_rep"); //hiding the three invisible rows at the top
    logit(JSON.stringify(this.zoid.zoidRep()), "zoid_rep");
   
    data = data.join("\t");
    this.masterLog += data + '\n';
    }
    //console.log();
  },

  logEpisode: function(){
      if(MetaTWO.config.logging == true){
      let loglist = ["SID","ECID","session","game_type","game_number","episode_number",
      "level","score","lines_cleared",
      "curr_zoid","next_zoid","danger_mode",
      "zoid_rot","zoid_col","zoid_row",
      "board_rep","zoid_rep","evt_sequence","rots","trans","path_length",
      "min_rots","min_trans","min_path",
      "min_rots_diff","min_trans_diff","min_path_diff",
      "u_drops","s_drops","prop_u_drops",
      "initial_lat","drop_lat","avg_lat",
      "tetrises_game","tetrises_level",
      "agree"];
    this.logUniversal("EP_SUMM", loglist);
    let data = new FormData();
    data.append("data" , this.masterLog);
    let xhr = new XMLHttpRequest();
    xhr.open( 'post', '/data/datastorage.php', true );
    xhr.send(data);
    this.masterLog = "";
    }
    
  },

  logWorld: function(){
      if(MetaTWO.config.logging == true){
    let loglist = ["SID","ECID","session","game_type","game_number","episode_number",
    "level","score","lines_cleared","danger_mode",
    "delaying","dropping","curr_zoid","next_zoid",
    "zoid_rot","zoid_col","zoid_row", "are","das","softdrop","board_rep","zoid_rep",];
    this.logUniversal("GAME_STATE", loglist);
    }
  },

  logGameSumm: function(){
      if(MetaTWO.config.logging == true){
    let loglist = ["SID","ECID","session","game_type","game_number","episode_number",
    "level","score","lines_cleared","completed",
    "game_duration","avg_ep_duration","zoid_sequence"]
    this.logUniversal("GAME_SUMM", loglist);
    // EXCEEDED QUOTA ON A FIVE-MINUTE GAME
    //localStorage.setItem("data", this.masterLog);    

    let data = new FormData();
    data.append("data" , this.masterLog);
    let xhr = new XMLHttpRequest();
    xhr.open( 'post', '/data/datastorage.php', true );
    xhr.send(data);
    }
    
    //This code was used to ensure that the data streaming issue was caused by data size not by connection termination.
//     var data2 = new FormData();
//     curd = this.masterLog.length + "\n"
//     data2.append('data', curd);
//     xhr.send(data2);
  },

  logEvent: function(id, evt_data1, evt_data2){
    if(MetaTWO.config.logging == true){
      let loglist = ["SID","ECID","session","game_type","game_number","episode_number",
      "level","score","lines_cleared",
      "curr_zoid","next_zoid","danger_mode",
      "delaying","dropping",
      "zoid_rot","zoid_col","zoid_row", "das","are", "softdrop"];
    this.logUniversal("GAME_EVENT", loglist, {"evt_id":id, "evt_data1": evt_data1, "evt_data2":evt_data2});
  }
  }
};
