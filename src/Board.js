// Based on Alex Kerr's board

(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.Board = factory();
    }
}(this, function () {

    'use strict';
    var Board = function () {
        this.width = 10;
        this.height = 20;
        this.vanish = 3;
        this.contents = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    };

    Board.prototype.isFilled = function (x, y) {
        return (self.contents[y+self.vanish][x] !== 0);
    };

    Board.prototype.getCell = function (x, y) {
        return self.contents[y+self.vanish][x];
    };

    Board.prototype.setCell = function (x, y, val) {
        self.contents[y+self.vanish][x] = val;
    };

    Board.prototype.commit = function(zoid){
        let collide = false;
        
        for (block in zoid.getBlocks()){
            let x = block[0], y = block[1];
            if (this.isFilled(x, y)){
                collide = true;
            }
            self.setCell(x, y, zoid.type+1);
        }            
        return collide;
    };

    Board.prototype.lineCheck = function(row){
        for (i = 0; i < this.width; i++){
            if (!this.isFilled(i, row)){
                return false;
            }
        }
        return true;
    };

    Board.prototype.lineDrop = function(row){
        let bug = (row <= 0);
        let top_row = 0;
        if (bug){
            row = self.height -1;
            top_row = -this.vanish;
        }
        for (j = row; j > top_row; j--){
            for (i = 0; i < this.width; i++){
                this.contents[j+this.vanish][i] = this.contents[j-1+this.vanish][i];
            }
        }
        for (i = 0; i < this.width; i++){
            this.contents[this.vanish][i] = 0;
        }
    };

    return Board;
}));