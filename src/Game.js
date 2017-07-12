Tetris.Game = function (game) {
  
  this.turnLength = 60;
  this.turnCounter = 0;
  
  this.isUpdatingAfterRowClear = false;
  
  this.nextZoid = null;
  this.activeZoid = null;
  
  this.cursors = null;
  
  this.completedRows = [];
  this.rotateFlag = false;

  // CONFIG THIS
  this.startLevel = 0;

  this.level = this.startLevel;
  this.lineCount = 0;
  this.gravityTimer = 0;
  // not expecting to go past level 30?
  this.gravityThresholdArray = [48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
  this.gravityThreshold = this.gravityThresholdArray[this.level];

};

Tetris.Game.stateKey = "Game";

Tetris.Game.prototype = {
    
  create: function () {
    
    let i, j;
    
    // Create background
    this.stage.backgroundColor = 0x050505; 
    
    // Create an empty board filled with nulls
    Tetris.board = new Array(Tetris.BOARD_HEIGHT);
    for(i = 0; i < Tetris.BOARD_HEIGHT; i++) {
      Tetris.board[i] = new Array(this.BOARD_WIDTH);
      for(j = 0; j < Tetris.BOARD_WIDTH; j++) {
        Tetris.board[i][j] = null;
      }
    }
            
    // Retrieve blockPositions
    Tetris.zoidsJSON = this.game.cache.getJSON('zoids');
    Tetris.zoids = Tetris.zoidsJSON.zoids;
    
    // Set turn length and counter
    this.isUpdatingAfterRowClear = false;
    this.turnLength = 60;
    this.turnCounter = 0;
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    // Create Initial Zoids
    this.activeZoid = new Tetris.Zoid();
    this.activeZoid.randomizeZoid();
    this.activeZoid.activate();
    
    this.nextZoid = new Tetris.Zoid();
    this.nextZoid.randomizeZoid();
    this.nextZoid.preview();
    
    Tetris.game.time.advancedTiming = true;
  },
  
  update: function () {
    
    if(this.gravityTimer >= this.gravityThreshold) {
      
      if(this.activeZoid !== null && this.activeZoid.canMoveZoid(Tetris.DOWN)) {
        this.activeZoid.moveZoid(Tetris.DOWN);
        
      } else {
        
        this.activeZoid.placeZoidInBoard();
        this.completedRows = this.getCompleteRows();
        
        if (this.completedRows.length > 0) {
          
          this.clearRow(this.completedRows);
          this.isUpdatingAfterRowClear = true;
          this.lineCount += this.completedRows.length;
          // TODO: the CTWC videos show champions going from level 18 to level 19 at 130 (??) lines
          // from https://tetris.wiki/Tetris_(NES,_Nintendo) :
          // when the player line clear (startLevel * 10 + 10) or max(100,
          //  (startLevel * 10 - 50)) lines, whatever comes first, the level advances by 1. After this,
          //  the level advances by 1 for every 10 lines
          // lineCount to advance = min((startLevel * 10 + 10), max(100, (startLevel * 10 - 50)))
          // if lineCount > lineCount_to_advance, level = startLevel + math.floor(lineCount/10) - startLevel
          // def calc(startLevel, lineCount):
          //   LTA= min((startLevel * 10 + 10), max(100, (startLevel * 10 - 50)))
          //   if (lineCount >= LTA):
          //     return startLevel + math.floor((lineCount - LTA)/10) + 1
          //   else: return startLevel
          this.level = this.calcLevel(this.startLevel, this.lineCount);
          
        } else {
          this.promoteZoids();
        }
        
        this.completedRows = [];
      }
      this.gravityTimer = 0;
      
    } else if (this.isUpdatingAfterRowClear) {
      
      if(this.turnCounter >= this.turnLength/10) {
        this.isUpdatingAfterRowClear = false;
        this.promoteZoids();
      } else {
        this.turnCounter++;
      }
    } else {
      
      this.handleInput();
      this.gravityTimer++;
      
    }
  },
  
  handleInput: function() {

    if (this.cursors.up.isDown && (this.rotateFlag === false)) {
      
      this.rotateFlag = true; // don't allow rotation again until button is released
      if (this.activeZoid.canRotate()) {        
        this.activeZoid.rotate();
      }
    }

    if (!this.cursors.up.isDown){
      this.rotateFlag = false;
    }
      
    if (this.cursors.left.isDown) {
      
      if (this.activeZoid.canMoveZoid(Tetris.LEFT)) {
        this.activeZoid.moveZoid(Tetris.LEFT);
      }
      
    } else if (this.cursors.right.isDown) {
      
      if (this.activeZoid.canMoveZoid(Tetris.RIGHT)) {        
        this.activeZoid.moveZoid(Tetris.RIGHT);
      }
      
    } 
    
    if (this.cursors.down.isDown) {
      
      this.gravityThreshold = Math.ceil(this.gravityThresholdArray[this.level]/2);
    
    }
    else {
      this.gravityThreshold = this.gravityThresholdArray[this.level];
    }
  },
  
  promoteZoids: function() {

    this.activeZoid = null;

    this.nextZoid.clearPreview();
    this.activeZoid = this.nextZoid;
    this.activeZoid.activate();

    this.nextZoid = new Tetris.Zoid();
    this.nextZoid.randomizeZoid();
    this.nextZoid.preview();
  },
  
  getCompleteRows: function() {
    let i, j, max;
    let completeRows = [];
    
    for(i = 0; i < Tetris.board.length; i++) {
      if (this.isRowFull(i)) {
        completeRows.push(i);
      }      
    }
    return completeRows;
  },
    
  isRowFull: function(row) {
    
    let i;
    
    for(i = 0; i < Tetris.board[row].length; i++) {
      if (Tetris.board[row][i] === null) {
        return false;
      }
    }
    
    return true;
  },
  
  clearRow: function(completedRows) {
    
    let i, j, h, row, block, alreadyShifted, actualRowToClear;
    alreadyShifted = 0;
    
    for(i = completedRows.length-1; i >= 0 ; i--) {
      
      actualRowToClear = completedRows[i] + alreadyShifted;
        
      row = Tetris.board[actualRowToClear];
      
      for(j = 0; j < row.length; j++) {
        Tetris.board[actualRowToClear][j].clean();
        Tetris.board[actualRowToClear][j] = null;
      }
      this.dropRowsAbove(actualRowToClear-1);
      alreadyShifted++;
    }
  },
  
  dropRowsAbove: function(row) {
    
    let i, j, block;
    
    for(i = row; i >= 0; i--) {
      for(j = 0; j < Tetris.board[i].length; j++) {
        
        block = Tetris.board[i][j];
        if(block !== null) {
          Tetris.board[i][j].moveBlock(block.x, block.y+1);
          Tetris.board[i+1][j] = Tetris.board[i][j];
          Tetris.board[i][j] = null;
        }
        
      }
    }
  },
  
  setupSounds: function () {
    
    //TODO
  },
  
  render: function(){
    Tetris.game.debug.text("fps: " + Tetris.game.time.fps, 2, 14, "#00ff00");
    Tetris.game.debug.text("gravity timer: " + this.gravityTimer, 2, 30, "#00ff00");
    Tetris.game.debug.text("level: " + this.level, 2, 46, "#00ff00");
    Tetris.game.debug.text("line count: " + this.lineCount, 2, 62, "#00ff00");
  },

  calcLevel: function(startLevel, lineCount){
    let LTA= Math.min((startLevel * 10 + 10), Math.max(100, (startLevel * 10 - 50)));
    if (lineCount >= LTA){
      return startLevel + Math.floor((lineCount - LTA)/10) + 1;
    }
    else return startLevel;
  }
  
};
