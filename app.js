const $ = require('jquery');
const uuid = require('uuid/v4');
const loki = require('lokijs');
const CONFIG = require('./config.js');
const express = require('express');
const Socket = require('socket.io');
const httpModule = require('http');

// const ConnectionProxy = require('./client/js/classes/Connection.js');
// const {server: Connection} = ConnectionProxy;
const EntityProxy = require('./client/js/classes/Entity.js');
const {server: Entity} = EntityProxy;
//Entity.trackName = 'Entity';
const PlayerProxy = require('./client/js/classes/Player.js');
const {server: Player} = PlayerProxy;
Player.trackName = "Player";
global.Tool = require('./client/js/classes/Tool.js').server;
const Arrow = require('./client/js/classes/Arrow.js').server;
//---Weapons--------------------------------------------------------------------
let bow = new Tool({name: 'bow'});
bow.use = (player)=>{
  let found = player.inventory.getFirst('arrow');
  //player.socket.emit('chat', found);
  let {slot, from} = found;
  if (slot > -1){
    //player.inventory.remove(from, slot, 1);
    arrow.use(player, slot);
    let len = Math.sqrt(Math.pow(player.mouse.x - player.x,2) + Math.pow(player.mouse.y - player.y, 2));
    let hsp = ((player.mouse.x - player.x) / len) * Arrow.speed;
    let vsp = ((player.mouse.y - player.y) / len) * Arrow.speed;
    new Arrow({x: player.x, y: player.y, hsp: hsp, vsp: vsp, pId: player.id});
  }

  //Player.broadcast('chat', "Arrow from (" + player.x + "," + player.y + ") to (" + player.mouse.x + ", " + player.mouse.y + ")");
}
//______________________________________________________________________________
global.Consumable = require('./client/js/classes/Consumable.js').server;
//---Useables-------------------------------------------------------------------
let bandage = new Consumable({name: 'bandage', self: true});
bandage.use = (p, slot)=>{
  p.inventory.remove('hotbar', slot, 1);
  p.heal(5);
}

let arrow = new Consumable({name: 'arrow', self: false});
arrow.use = (p, slot)=>{
  p.inventory.remove('any', 'arrow', 1);
}
//______________________________________________________________________________
const ItemProxy = require('./client/js/classes/Item.js');
const {server: Item} = ItemProxy;
global.Item = Item;
const WallProxy = require('./client/js/classes/Wall.js');
const {server: Wall} = WallProxy;
const ProjectileProxy = require('./client/js/classes/Projectile.js');
const {server: Projectile} = ProjectileProxy;
const DecorationProxy = require('./client/js/classes/Decoration.js');
const {server: Decoration} = DecorationProxy;
const Tree = require('./client/js/classes/Tree.js').server;
const Rock = require('./client/js/classes/Rock.js').server;

function copyDefaultPkt(){
  return JSON.parse(JSON.stringify(defaultPack));
}

//Fix node imports with the --experimental-modules flag.

const app = express();
const http = httpModule.Server(app);
const io = Socket(http);

//---Handle Requests------------------------------------------------------------
app.get('/', (req, res)=>{
  res.sendFile(__dirname + "/client/index.html")
})

app.get('/jquery', (req,res)=>{
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js')
})

app.get('/bootstrapjs', (req,res)=>{
  res.sendFile(__dirname + "/node_modules/bootstrap/dist/js/bootstrap.min.js")
})

app.get('/bootstrapcss', (req,res)=>{
  res.sendFile(__dirname + "/node_modules/bootstrap/dist/css/bootstrap.min.css")
})


app.use(express.static('client'));

//______________________________________________________________________________

//---Init Database--------------------------------------------------------------
let accounts;

function initData(){
  accounts = db.getCollection('accounts');
  if(accounts === null) {
    accounts = db.addCollection('accounts');
  }
}

const db = new loki('data.db',{autosave: true, autoload: true, autoloadCallback: initData});
//______________________________________________________________________________

//---Register Connection Tracking-----------------------------------------------
const defaultPack = {Player: {}, Item: {}, Wall: {}, Projectile: {}, Decoration: {}};
global.updatePack = copyDefaultPkt();
global.initPack = copyDefaultPkt();
global.removePack = copyDefaultPkt();
for (let cName of Object.keys(defaultPack)){
  removePack[cName] = [];
}
//______________________________________________________________________________

//---Handle Connections---------------------------------------------------------

io.on('connection',(socket)=>{
  console.log('Socket Connection: ' + socket);
  //console.log(io.sockets.connected);
  socket.on('sign-in',(creds)=>{
    const res = accounts.count(creds);
    if (res == 1) {
      socket.emit('sign-in-res', {success: true});
    } else if (res > 1) {
      socket.emit('sign-in-res', {success: false, err: 'dupe-acc'});
    } else {
      socket.emit('sign-in-res', {success: false, err: 'incorrect'});
    }
  })

  socket.on('sign-up',(creds)=>{
    const res = accounts.count({user: creds.user});
    if (res == 0) {
      accounts.insert(creds);
      socket.emit('sign-up-res', {success: true});
    } else {
      socket.emit('sign-up-res', {success: false, err: 'dupe-acc'});
    }
  });

  socket.on('loaded',(name)=>{
    let connPlayer = new Player({name,id:socket.id,socket});

    let init = copyDefaultPkt();
    init.Player = Player.getInit();
    init.Item = Item.getInit();
    init.Wall = Wall.getInit();
    init.Projectile = Projectile.getInit();
    init.Decoration = Decoration.getInit();
    console.log("Hello", init);
    socket.emit('init',{initPkt: init,playerId: socket.id});
    socket.on('disconnect',()=>{
      console.log(socket.id, Player.list[socket.id].name);
      Player.list[socket.id].remove();
    })

    socket.on('mousedown', (e)=>{
      console.log("Click at (" + e.x + "," + e.y + ") on the " + ["Left","Middle","Right"][e.button] + " button.");
      Player.list[socket.id].mouse = {button: e.button + 1, x: Number(e.x), y: Number(e.y)};
      Player.list[socket.id].mouseThisTick = e.button + 1;
    })

    socket.on('mouseup', (e)=>{
      Player.list[socket.id].mouse = 0;
    })

    socket.on('key', (keys)=>{
      Player.list[socket.id].keys = keys;
    })

    let store = {};

    socket.on('eval', (str)=>{
      try {
        socket.emit('eval-res',eval(str));
      } catch(err) {
        socket.emit('eval-res',err.message,err);
      }
    })

    socket.on('chat', (str)=>{
      console.log("CHAT:  <" + Player.list[socket.id].name + "> " + str);
      for(let id in Player.list){
        Player.list[id].socket.emit('chat',"&lt;" + Player.list[socket.id].name + "&gt; " + str);
      }
    })
  })
})


//______________________________________________________________________________

//---Begin Listening------------------------------------------------------------
http.listen(CONFIG.port, ()=>{
  console.log('Server Started on port ' + CONFIG.port + '.');
})
//______________________________________________________________________________

//---Start Main Loop------------------------------------------------------------
//let checker = new Entity({});

let MAIN_LOOP = setInterval(()=>{
  updatePack = copyDefaultPkt();
  Player.update();

  Item.update();

  Projectile.update();

  updatePack.Player = Player.getUpdate();

  updatePack.Item = Item.getUpdate();

  updatePack.Wall = Wall.getUpdate();

  updatePack.Projectile = Projectile.getUpdate();

  // console.log(initPack);
  for(let id in Player.list){
    Player.list[id].socket.emit('init-pkt',initPack);
    Player.list[id].socket.emit('update',updatePack);
    Player.list[id].socket.emit('remove', removePack)
  }
  initPack = copyDefaultPkt();
  for (let cName of Object.keys(defaultPack)){
    removePack[cName] = [];
  }
},1000/30)

//______________________________________________________________________________
