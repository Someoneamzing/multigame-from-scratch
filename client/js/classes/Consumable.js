class server {
  constructor({name, self = true}) {
    this.name = name;
    this.self = self
    server.list[this.name] = this;
  }

  use(p, slot){
    p.inventory.remove('hotbar', slot, 1);
    p.socket.emit('chat', 'Useables!! but really you shouldn\'t see this. Just tell Jacob')
  }

  static get(name){
    return server.list[name];
  }
}

server.list = {};

module.exports = {server};
