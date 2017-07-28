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
        this.names = "TJZOSLI";
        this.all_coord = [[[[1, 2], [2, 2], [3, 2], [2, 3]], [[2, 1], [1, 2], [2, 2], [2, 3]], [[2, 1], [1, 2], [2, 2], [3, 2]], [[2, 1], [2, 2], [3, 2], [2, 3]]], 
        [[[1, 2], [2, 2], [3, 2], [3, 3]], [[2, 1], [2, 2], [1, 3], [2, 3]], [[1, 1], [1, 2], [2, 2], [3, 2]], [[2, 1], [3, 1], [2, 2], [2, 3]]],
         [[[1, 2], [2, 2], [2, 3], [3, 3]], [[3, 1], [2, 2], [3, 2], [2, 3]], [[1, 2], [2, 2], [2, 3], [3, 3]], [[3, 1], [2, 2], [3, 2], [2, 3]]], 
         [[[1, 2], [2, 2], [1, 3], [2, 3]], [[1, 2], [2, 2], [1, 3], [2, 3]], [[1, 2], [2, 2], [1, 3], [2, 3]], [[1, 2], [2, 2], [1, 3], [2, 3]]], 
         [[[2, 2], [3, 2], [1, 3], [2, 3]], [[2, 1], [2, 2], [3, 2], [3, 3]], [[2, 2], [3, 2], [1, 3], [2, 3]], [[2, 1], [2, 2], [3, 2], [3, 3]]], 
         [[[1, 2], [2, 2], [3, 2], [1, 3]], [[1, 1], [2, 1], [2, 2], [2, 3]], [[3, 1], [1, 2], [2, 2], [3, 2]], [[2, 1], [2, 2], [2, 3], [3, 3]]], 
         [[[0, 2], [1, 2], [2, 2], [3, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]], [[0, 2], [1, 2], [2, 2], [3, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]]]];
         // colors from spritesheet:
         // T, O, and I use column 0
         // J and S use column 1
         // L and Z use column 2
    };

    Zoid.spawn = function (typeofZoid) {
        let z = new Zoid();
        z.zoidType = typeofZoid;
        return z;
    };

    Zoid.prototype.getBlocks = function(){
        // add current coordinates to master list of original coordinates
        let original_coords = this.all_coord[this.zoidType][this.r];
        let current_coords = [];
        for (i = 0; i < 4; i++){
            current_coords.push([original_coords[i][0] + this.x, original_coords[i][1] + this.y]);
        }
        return current_coords;
    };

    //not ideal, but given JS doesn't have keyword arguments, this prevents me
    //from having to pass in an object each time I want the blocks.
    //this should only be called from the collision funcion below
    Zoid.prototype.getBlocksWithRotation = function(r){
        // add current coordinates to master list of original coordinates
        let original_coords = this.all_coord[this.zoidType][r];
        let current_coords = [];
        for (i = 0; i < 4; i++){
            current_coords.push([original_coords[i][0] + this.x, original_coords[i][1] + this.y]);
        }
        return current_coords;
    };

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