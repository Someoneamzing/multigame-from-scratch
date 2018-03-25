class client {
  constructor(socket){
    this.socket = socket;
    this.track = {};
    this.socket.on('connection-update', this.update);
    this.socket.on('connection-new', this.createNew);
  }

  addTrack(className, classID){
    this.track[className] = classID;
    // TODO: Handle class tracking on connection
  }

  update(updatePkt){
    for(let )
  }

  createNew(newPkt){
    for(let list in newPkt){
      for(let obj of newPkt[list]){
        new this.track[list](obj);
      }
    }
  }
}

class server {
  constructor(io){
    this.io = io;
    this.track = {};
    this.newObjs = {};
    this.updates = {};
    this.sockets = {};
    this.io.on('connection',(socket)=>{
      this.sockets[socket.id] = socket;
      socket.on('disconnect',(reason)=>{
        delete this.sockets[socket.id];
      })
      //socket.emit('connection-track-res', Object.keys(this.track)
    })
  }

  addTrack(className, classID){
    this.track[className] = classID;
    classID.trackList = this;
    classID.trackName = className;
  }

  sendUpdate(){
    this.io.emit('connection-update', this.updates);
  }


}
