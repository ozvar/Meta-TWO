Tetris.Game = function (game) {
  
  this.turnLength = 60;
  this.turnCounter = 0;
  
  this.isUpdatingAfterRowClear = false;
  
  this.nextZoid = null;
  this.activeZoid = null;
  
  this.cursors = null;
  
  this.completedRows = [];
};

Tetris.Game.stateKey = "Game";

Tetris.Game.prototype = {
    
  create: function () {
    
    let i, j;
    
    // Create background
    this.stage.backgroundColor = 0x171642; 
    this.add.sprite(0,0,'background');
    this.add.sprite(0,0,'banner');
    
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
    
    // Create Zoids
    this.nextZoid = new Tetris.Zoid();
    this.nextZoid.randomizeZoid();
    this.nextZoid.preview();
    
    this.activeZoid = new Tetris.Zoid();
    this.activeZoid.randomizeZoid();
    this.activeZoid.activate();
  },
  
  update: function () {
    
    if(this.turnCounter >= this.turnLength) {
      
      if(this.activeZoid !== null && this.activeZoid.canMoveZoid(Tetris.DOWN)) {
        this.activeZoid.moveZoid(Tetris.DOWN);
        
      } else {
        
        this.activeZoid.placeZoidInBoard();
        this.completedRows = this.getCompleteRows();
        
        if (this.completedRows.length > 0) {
          
          this.clearRow(this.completedRows);
          this.isUpdatingAfterRowClear = true;
          
        } else {
          this.promoteZoids();
        }
        
        this.completedRows = [];
      }
      this.turnCounter = 0;
      
    } else if (this.isUpdatingAfterRowClear) {
      
      if(this.turnCounter >= this.turnLength/10) {
        this.isUpdatingAfterRowClear = false;
        this.promoteZoids();
      } else {
        this.turnCounter++;
      }
    } else {
      
      this.handleInput();
      this.turnCounter++;
      
    }
  },
  
  handleInput: function() {
    
    if (this.activeZoid.isTweening) {
      
      this.activeZoid.updateTween();
      
    } else if (this.cursors.up.isDown) {
      
      if (this.activeZoid.canRotate()) {        
        this.activeZoid.rotate();
      }
      
    } else if (this.cursors.left.isDown) {
      
      if (this.activeZoid.canMoveZoid(Tetris.LEFT)) {
        this.activeZoid.moveZoid(Tetris.LEFT);
        this.activeZoid.isTweening = true;
      }
      
    } else if (this.cursors.right.isDown) {
      
      if (this.activeZoid.canMoveZoid(Tetris.RIGHT)) {        
        this.activeZoid.moveZoid(Tetris.RIGHT);
        this.activeZoid.isTweening = true;
      }
      
    } else if (this.cursors.down.isDown) {
      
      this.turnCounter += this.turnLength/5;
    
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
  }
  
};
