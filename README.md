# Simplechain - a very simple block chain example, inspired on lhartikk's example

### Introduction

This is a very simple sample of a block chain application which demostrate message hashing and add blocks to current chain.

### How to use

Type the following

npm install

```
HTTP_PORT=4000 npm start
```

### Test WEB API

We can use curl to test the web server.

##### Display blockchain
To display the current block chain:
```
curl http://localhost:4000/blocks
```
##### Add block to blockchain
To add another block to the block chain:
```
curl -H "Content-type:application/json" --data '{"data" : "additional data"}' http://localhost:4000/mineBlock
```
##### Add peer
```
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:5000"}' http://localhost:3001/addPeer
```
#### Query connected peers
```
curl http://localhost:4000/peers
```
