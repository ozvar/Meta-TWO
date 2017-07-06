Tetris.Block = function () {

  this.color = null;
  this.x = null;
  this.y = null;
  
  this.sprite = null;
  this.tween = null;
  
  return this;
};

Tetris.Block.prototype = {
  
  makeBlock: function (newX, newY, newColor) {

    this.x = newX;
    this.y = newY;
    this.color = newColor;
    
    let spriteLocation = this.getSpriteLocation();
    
    this.sprite = Tetris.game.add.sprite(spriteLocation.x, spriteLocation.y, 'block', this.color);
    //this.tween.frameBased = true;
  },
  
  clean: function() {
    
    this.x = null;
    this.y = null;
    this.color = null;
    this.sprite.destroy();
    this.sprite = null;
  },
  
  getSpriteLocation: function () {
    
    let spriteX, spriteY;
    
    spriteX = Tetris.LINING_WIDTH + (this.x * Tetris.BLOCK_WIDTH);
    spriteY = Tetris.BANNER_HEIGHT + (this.y * Tetris.BLOCK_WIDTH);
    
    return {"x": spriteX, "y": spriteY};
  },
  
  moveBlock: function(newX, newY) {
    
    this.x = newX;
    this.y = newY;
    
    let spriteLocation = this.getSpriteLocation(newX, newY);
    
    let duration = 55;
    let repeat = 0;
    let ease = Phaser.Easing.Quadratic.In;
    let autoStart = false;
    let delay = 0;
    let yoyo = false;

    this.sprite.x = spriteLocation.x;
    this.sprite.y = spriteLocation.y;

    
    //this.tween = Tetris.game.add.tween(this.sprite).to(spriteLocation, duration, ease, autoStart, delay, repeat, yoyo);
    //this.tween.start();
  }
};
