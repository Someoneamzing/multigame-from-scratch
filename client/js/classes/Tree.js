const DecorationProxy = require('./Decoration.js');
//const ItemProxy = require('./Item.js');

class server extends DecorationProxy.server {
  constructor(params){
    super(params);
    this.category = 'tree';
    this.variant = Math.floor(Math.random()*4);
    this.health = this.healthMax = 3;

    initPack[server.trackName][this.id] = this.getInitPkt();
  }

  get type(){
    let inst = super.type;
    inst.push('Tree');
    return inst;
  }

  kill(p){
    let n = Math.floor(Math.random()*3) + 2;
    new Item({x: this.x, y: this.y, item: 'wood', count: n, delay: 100})
    super.kill(p);
  }
}

server.trackName = 'Decoration';
module.exports = {server};
