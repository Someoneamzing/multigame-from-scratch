let server = class {
  constructor({name}) {
    this.name = name;

    server.list[name] = this;
  }

  use(player){
    player.socket.emit('chat',['POOF!','BANG!','TZZT!', 'ZAP!', 'POW!', 'You are really persistant aren\'t you?'][Math.floor(Math.random()*5)])
  }

  static get(name){
    return typeof server.list[name] != 'undefined'?server.list[name]:false;
  }
}

server.list = {};

module.exports = {server};
