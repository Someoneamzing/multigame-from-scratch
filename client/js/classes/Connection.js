class client {
  constructor(socket){
    this.socket = socket;
    this.track = {};
    this.socket.on('connection-track-res',(trackList)=>{
      for (let name of trackList){
        this.track[name] = [];
      }
    })
  }
}

class server {
  constructor(io){
    this.io = io;
    this.track = {};
    this.sockets = {};
    this.io.on('connection',(socket)=>{
      this.sockets[socket.id] = socket;
      socket.emit('connection-track-res', Object.keys(this.track)
    })
  }
}
