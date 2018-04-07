EntityProxy = require('./Entity.js');

let client = class extends EntityProxy.client {
  constructor(params){
    super(params);
  }

  render(canvas){
    super.render(canvas);
    canvas.text(this.name,this.x,this.y-this.w)
  }
}

let server = class extends EntityProxy.server {
  constructor(params){
    super(params);
    const {name = player,socket} = params;
    this.name = name;
    this.socket = socket;
  }
}

module.exports = {client, server};
