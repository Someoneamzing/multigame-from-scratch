const QuadNode = require('./QuadNode.js').server;

class server {
  constructor(maxChildren = 10) {
    private this.maxChildren = maxChildren;
    private this.root = new QuadNode(this.maxChildren);
  }

  insert(obj){
    this.root.insert(obj);
  }

  clear(){
    this.root.clear();
  }
}

module.exports = {server};
