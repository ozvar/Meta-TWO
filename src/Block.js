MetaTWO.Block = function () {

  this.color = null;
  this.x = null;
  this.y = null;
  
  this.sprite = null;
  
  return this;
};

MetaTWO.Block.prototype = {
  
  makeBlock: function (newX, newY, newColor) {

    this.x = newX;
    this.y = newY;
    this.color = newColor;
    
    let spriteLocation = this.getSpriteLocation();
    
    this.sprite = MetaTWO.game.add.sprite(spriteLocation.x, spriteLocation.y, 'block', this.color);
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
    
    spriteX = MetaTWO.LINING_WIDTH + (this.x * MetaTWO.BLOCK_WIDTH);
    spriteY = MetaTWO.BANNER_HEIGHT + (this.y * MetaTWO.BLOCK_WIDTH);
    
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
  }
};
