Tetris.Zoid = function () {
  this.type = null;
  this.orientation = null;
  this.color = null;
  
  this.centerX = null;
  this.centerY = null;
  
  this.zoid = null;
  this.blocks = [];
  
  this.isTweening = false;
  this.tweenCounter = 0;
  
  this.tempCounter = 0;
};

Tetris.Zoid.prototype = {

  NUM_BLOCKS_IN_ZOID: 4,
  NUM_ZOID_TYPES: 7,
  NUM_ORIENTATIONS: 4,

  // Zoid type
  I: 0,
  J: 1,
  L: 2,
  O: 3,
  S: 4,
  Z: 5,
  T: 6,
  
  randomizeZoid: function () {
    
    this.type = Math.floor(Math.random() * this.NUM_ZOID_TYPES);
    this.orientation = Math.floor(Math.random() * this.NUM_ORIENTATIONS);
    this.color = Math.floor(Math.random() * Tetris.NUM_COLORS);
    
    this.initBlocks();
  },
  
  initBlocks: function () {
    
    var i;
    for(i = 0; i < this.NUM_BLOCKS_IN_ZOID; i++) {
      this.blocks[i] = new Tetris.Block();
    }
  },
  
  preview: function () {
    
    //TODO
  },
  
  clearPreview: function () {
    
    //TODO
  },
  
  activate: function () {
    this.zoid = Tetris.zoids[this.type];
    this.centerX = this.zoid.orientation[this.orientation].startingLocation.x;
    this.centerY = this.zoid.orientation[this.orientation].startingLocation.y;
    
    var i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.zoid.orientation[this.orientation].blockPosition[i].x;
      newY = this.centerY + this.zoid.orientation[this.orientation].blockPosition[i].y;
      this.blocks[i].makeBlock(newX, newY, this.color);
    }
  },
  
  clearActive: function () {
    
    this.type = null;
    this.orientation = null;
    this.color = null;

    this.centerX = null;
    this.centerY = null;

    this.blocks = null;
  },
  
  placeZoidInBoard: function () {
    
    var i, block;
    
    for(i = 0; i < this.blocks.length; i++) {
      block = this.blocks[i];
      Tetris.board[block.y][block.x] = this.blocks[i];
    }
  },
  
  isOnBoard: function (x, y) {
    
    if(x >= 0 && y >= 0 && 
       x < Tetris.BOARD_WIDTH && y < Tetris.BOARD_HEIGHT) {
      return true;
    }
    return false;
  },
  
  isOccupied: function (x, y) {

    if(Tetris.board[y][x] === null) {
      return false;
    }
    return true;
  },
  
  canMoveZoid: function (direction) {
    
    var i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Tetris.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Tetris.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Tetris.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
          break;
      }
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  },
    
  moveZoid: function (direction) {
    
    if(!this.canMoveZoid(direction)){
      throw "Cannot move active zoid in direction: " + direction;
    }
    
    var i, newX, newY;
    
    // Move the Zoid's blocks
    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Tetris.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Tetris.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Tetris.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
          break;
      }  
     this.blocks[i].moveBlock(newX, newY);
    }
    
    // Update the Zoid's center
    switch(direction) {
      case Tetris.DOWN:
        this.centerX += 0;
        this.centerY += 1;
        break;
      case Tetris.LEFT:
        this.centerX += -1;
        this.centerY += 0;
        break;
      case Tetris.RIGHT:
        this.centerX += 1;
        this.centerY += 0;
        break;
    }
  },
  
  canRotate: function () {
    
    if (this.isTweening) {
      return false;
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
    
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.zoid.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.zoid.orientation[newOrientation].blockPosition[i].y;      
      
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  },
    
  rotate: function () {
    
    if(!this.canRotate()) {
      throw "Cannot rotate active zoid";
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.zoid.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.zoid.orientation[newOrientation].blockPosition[i].y;      
      this.blocks[i].moveBlock(newX, newY);
    }
    this.orientation = newOrientation;
    this.isTweening = true;
  },
  
  updateTween: function () {
    
    if (this.tweenCounter > 10) {
      this.isTweening = false;
      this.tweenCounter = 0;
    } 
    this.tweenCounter++;
  }
};