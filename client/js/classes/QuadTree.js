const QuadNode = require('./QuadNode.js').server;

class server {
  constructor(maxChildren = 10, maxDepth = 5) {
    this.maxChildren = maxChildren;
    this.maxDepth = maxDepth;
    this.root = new QuadNode({x:-5000, y: -5000, w: 10000, h: 10000}, this.maxChildren, 0, this.maxDepth);
  }

  draw(ctx){
    this.root.draw(ctx);
  }

  insert(obj){
    this.root.insert(obj);
  }

  clear(){
    this.root.clear();
  }

  retrieve(obj){
    let res = {}
    this.root.retrieve(obj, res);
    return res;
  }
}

module.exports = {server};
