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
        return (this.contents[y+this.vanish][x] !== 0);
    };

    Board.prototype.getStyle = function (x, y) {
        let val = this.contents[y+this.vanish][x];
        if (val < 4){ return 0;}
        else if ((val ===4) || (val === 6)) {return 1;}
        else {return 2;}
    };

    Board.prototype.getCell = function (x, y) {
        return this.contents[y+this.vanish][x];
    };

    Board.prototype.setCell = function (x, y, val) {
        this.contents[y+this.vanish][x] = val;
    };

    Board.prototype.commit = function(zoid){
        let collide = false;
        let blocks = zoid.getBlocks();
        for (i = 0; i< blocks.length; i++){
            let x = blocks[i][0], y = blocks[i][1];
            if (this.isFilled(x, y)){
                collide = true;
            }
            //console.log(x + " " + y + " " + zoid.zoidType + 1);
            this.setCell(x, y, zoid.zoidType+1);
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
        let j = 0;
        if (bug){
            row = this.height -1;
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