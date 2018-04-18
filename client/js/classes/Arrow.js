const ProjectileProxy = require('./Projectile.js');

class server extends ProjectileProxy.server {
  constructor(params){
    super(params);
    this.damage = params.damage != undefined?params.damage:3;
    this.variant = 'arrow';
    this.h = 8;

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
    console.log(initPack);
  }

  get type(){
    let inst = super.type;
    inst.push('Arrow');
    return inst;
  }
}

server.speed = 6;

server.list = {};

server.trackName = 'Projectile';

module.exports = {server};
