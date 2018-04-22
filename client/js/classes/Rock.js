const DecorationProxy = require('./Decoration.js');
//const ItemProxy = require('./Item.js');

class server extends DecorationProxy.server {
  constructor(params){
    super(params);
    this.category = 'rock';
    this.variant = Math.floor(Math.random()*4);
    this.health = this.healthMax = 6;

    initPack[server.trackName][this.id] = this.getInitPkt();
  }

  get type(){
    let inst = super.type;
    inst.push('Rock');
    return inst;
  }

  kill(p){
    let n = Math.floor(Math.random()*3) + 2;
    new Item({x: this.x, y: this.y, item: 'stone', count: n, delay: 100})
    super.kill(p);
  }
}

server.trackName = 'Decoration';
module.exports = {server};
