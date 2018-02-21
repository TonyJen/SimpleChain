/*!
 * SimpleChain
 * Server
 * Copyright(c) 2018 Tony Jen
 * MIT Licensed
 */

'use strict';
var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require('body-parser');
var peerServer = require('./peerServer');
var Block = require('./block');

// Setting up the correct ports
var http_port = process.env.HTTP_PORT || 4000;

 // Very first block
var getGenesisBlock = () => {
    return new Block(0, "0", 21920180124, "very first block", "6aa3333126f7060113fb3c38c62ac807af3b76a22cf68ca111fc500d9b697a6f");
};

// create a new block
global.blockchain = [getGenesisBlock()];

// get latest block
var getLatestBlock = () => blockchain[blockchain.length - 1];

// start the web server and accept requests
var startHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());
    // request for current state of blockchain
    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
    // create a new block and add to blockchain
    app.post('/mineBlock', (req, res) => {
        var newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });
    // send messages to all the peers in the network
    app.get('/peers', (req, res) => {
        res.send(peerServer.sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    // add peer to the network
    app.post('/addPeer', (req, res) => {
        peerServer.connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Listening on port: ' + http_port));

};

// create the next block on the block chain
var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
       return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};


var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

// Add created block to the block chain.
var addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

// check for valid block
var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previous hash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

// start the application
startHttpServer();
peerServer.connectToPeers(peerServer.initialPeers);
peerServer.startPeerServer();