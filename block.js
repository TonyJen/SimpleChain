/*!
 * SimpleChain
 * Block
 * Copyright(c) 2018 Tony Jen
 * MIT Licensed
 */

// Create Block object
module.exports = class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }

}


