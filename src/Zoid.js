// Based on Alex Kerr's piece

(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.Zoid = factory();
    }
}(this, function () {

    'use strict';
    var Zoid = function () {
        this.x = 3;
        this.y = -2;
        this.r = 0;
        this.zoidType = 0;
        this.names = "IOTSZJL"; // Lindstedt's order - important for consistent random pieces
        this.all_coord = [
            [[[0, 2], [1, 2], [2, 2], [3, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]], [[0, 2], [1, 2], [2, 2], [3, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]]], //I
            [[[1, 2], [2, 2], [1, 3], [2, 3]], [[1, 2], [2, 2], [1, 3], [2, 3]], [[1, 2], [2, 2], [1, 3], [2, 3]], [[1, 2], [2, 2], [1, 3], [2, 3]]], //O
            [[[1, 2], [2, 2], [3, 2], [2, 3]], [[2, 1], [1, 2], [2, 2], [2, 3]], [[2, 1], [1, 2], [2, 2], [3, 2]], [[2, 1], [2, 2], [3, 2], [2, 3]]], //T 
            [[[2, 2], [3, 2], [1, 3], [2, 3]], [[2, 1], [2, 2], [3, 2], [3, 3]], [[2, 2], [3, 2], [1, 3], [2, 3]], [[2, 1], [2, 2], [3, 2], [3, 3]]], //S
            [[[1, 2], [2, 2], [2, 3], [3, 3]], [[3, 1], [2, 2], [3, 2], [2, 3]], [[1, 2], [2, 2], [2, 3], [3, 3]], [[3, 1], [2, 2], [3, 2], [2, 3]]], //Z
            [[[1, 2], [2, 2], [3, 2], [3, 3]], [[2, 1], [2, 2], [1, 3], [2, 3]], [[1, 1], [1, 2], [2, 2], [3, 2]], [[2, 1], [3, 1], [2, 2], [2, 3]]], //J
            [[[1, 2], [2, 2], [3, 2], [1, 3]], [[1, 1], [2, 1], [2, 2], [2, 3]], [[3, 1], [1, 2], [2, 2], [3, 2]], [[2, 1], [2, 2], [2, 3], [3, 3]]] //L          
        ];
         // style refers to one of the three ways a NES block is drawn: 0) large white block with primary border,
         // 1) primary bg with white highlight, or 2) secondary bg with white highlight
         // so, for IOTSZJL, it's 0001212
         this.style = 0;
    };

    Zoid.spawn = function (typeofZoid) {
        let z = new Zoid();
        z.zoidType = typeofZoid;
        if ((typeofZoid === 3) || (typeofZoid ===5)){ z.style = 1;}
        else if (typeofZoid > 2) {z.style = 2;}
        return z;
    };

    Zoid.prototype.getBlocks = function(){
        // add current coordinates to master list of original coordinates
        let original_coords = this.all_coord[this.zoidType][this.r];
        let current_coords = [];
        for (i = 0; i < 4; i++){
            current_coords.push([original_coords[i][0] + this.x, original_coords[i][1] + this.y]);
        }
        current_coords.style = this.style;
        return current_coords;
    };

    //not ideal, but given JS doesn't have keyword arguments, this prevents me
    //from having to pass in an object each time I want the blocks.
    //this should only be called from the collision function below
    Zoid.prototype.getBlocksWithRotation = function(r){
        // add current coordinates to master list of original coordinates
        let original_coords = this.all_coord[this.zoidType][r];
        let current_coords = [];
        for (i = 0; i < 4; i++){
            current_coords.push([original_coords[i][0] + this.x, original_coords[i][1] + this.y]);
        }
        return current_coords;
    };

    Zoid.prototype.zoidRep = function(){
        // translate [[4,18],[5,18],[5,19],[6,19]]
        // into [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,5,5,0,0,0,0],[0,0,0,0,0,5,5,0,0,0]]
        let coords = this.getBlocks();
        let tempBoard = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        let index = 0;
        for (index = 0; index < coords.length ; ++index){
            let row = coords[index][1];
            let column = coords[index][0];
            if (row >= 0 && column >= 0){
                tempBoard[row][column] = this.zoidType + 1;
            }
        }
        return tempBoard;
    }

    Zoid.prototype.collide = function(board, vx, vy, vr){
        vr = (this.r + vr) & 3;
        let ix = 0, iy = 0;
        let rotateBlocks = this.getBlocksWithRotation(vr);
        for (i = 0; i< 4; i++){
            ix = rotateBlocks[i][0] + vx;
            iy = rotateBlocks[i][1] + vy;
            if ((ix < 0) || (ix >= board.width)){ return true}
            if (iy >= board.height) {return true}
            if (board.isFilled(ix, iy)) {return true}
        }
        return false;
    };

    return Zoid;
}));