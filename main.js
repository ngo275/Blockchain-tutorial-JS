const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(index, timestamp, data, prevHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.prevHash = prevHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash() {
    return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("Block mined: " + this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 4
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2018", "Genesis block", "0")
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash
    // newBlock.hash = newBlock.calculateHash()
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const prevBlock = this.chain[i - 1]
      
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.prevHash !== prevBlock.hash) {
        return false
      }

      return true
    }
  }
}

let coin = new Blockchain()

console.log("mining block 1...")
coin.addBlock(new Block(1, "10/02/2018", { amount: 4 }))

console.log("mining block 2...")
coin.addBlock(new Block(2, "12/02/2018", { amount: 10 }))
console.log(JSON.stringify(coin, null, 4))
console.log('Is this chain valid? > ' + coin.isChainValid())

coin.chain[1].data = { amount: 100 } // change the value of a block
console.log('Is this chain valid? > ' + coin.isChainValid())

