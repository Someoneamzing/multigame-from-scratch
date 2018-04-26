/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("//---DO NOT CHANGE--------------------------------------------------------------\nObject.defineProperty(window, 'side', { value: \"SERVER\", writeable: false });\n//______________________________________________________________________________\n\n\nconst electron = __webpack_require__(/*! electron */ \"electron\");\nconst EventEmitter = __webpack_require__(/*! events */ \"events\");\nconst remote = electron.remote;\nconst Eapp = remote.app;\n\nwindow.basepath = Eapp.getAppPath();\nconsole.log(basepath);\nwindow.$ = __webpack_require__(/*! jquery */ \"jquery\");\n\n//require('bootstrap');\n\nwindow.InternalConsole = new class extends EventEmitter {\n  constructor() {\n    super();\n    this.list = [];\n  }\n\n  addEntry(entry) {\n    this.list.push(entry);\n    this.emit('change');\n  }\n}();\n\nwindow.renders = new class {\n  constructor() {}\n\n  players(ctx) {\n    for (let id in Player.list) {\n      Player.list[id].render(ctx);\n    }\n  }\n}();\n\nwindow.CollisionTree = new (__webpack_require__(/*! ./client/js/classes/QuadTree.js */ \"./client/js/classes/QuadTree.js\").server)();\n\nfor (let verb of ['log', 'warn', 'error']) {\n  console[verb] = ((method, verb) => {\n    return (...text) => {\n      method.apply(console, text);\n      if (verb != \"log\") console.log(verb);\n      for (let msg of text) window.InternalConsole.addEntry({ verb, text: msg, time: new Date(), salt: Math.random() });\n    };\n  })(console[verb].bind(console), verb);\n}\n\nconst uuid = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst loki = __webpack_require__(/*! lokijs */ \"lokijs\");\nconst CONFIG = __webpack_require__(/*! ./config.js */ \"./config.js\");\nconst express = __webpack_require__(/*! express */ \"express\");\nconst Socket = __webpack_require__(/*! socket.io */ \"socket.io\");\nconst httpModule = __webpack_require__(/*! http */ \"http\");\nconst React = __webpack_require__(/*! react */ \"react\");\nconst ReactDOM = __webpack_require__(/*! react-dom */ \"react-dom\");\n\n//const AppPage = require('./server/components/AppPage.js');\n\n// const ConnectionProxy = require('./client/js/classes/Connection.js');\n// const {server: Connection} = ConnectionProxy;\nconst EntityProxy = __webpack_require__(/*! ./client/js/classes/Entity.js */ \"./client/js/classes/Entity.js\");\nconst { server: Entity } = EntityProxy;\n//Entity.trackName = 'Entity';\nconst PlayerProxy = __webpack_require__(/*! ./client/js/classes/Player.js */ \"./client/js/classes/Player.js\");\nconst { server: Player } = PlayerProxy;\nPlayer.trackName = \"Player\";\nglobal.Tool = __webpack_require__(/*! ./client/js/classes/Tool.js */ \"./client/js/classes/Tool.js\").server;\nconst Arrow = __webpack_require__(/*! ./client/js/classes/Arrow.js */ \"./client/js/classes/Arrow.js\").server;\n//---Weapons--------------------------------------------------------------------\nlet bow = new Tool({ name: 'bow' });\nbow.use = player => {\n  let found = player.inventory.getFirst('arrow');\n  //player.socket.emit('chat', found);\n  let { slot, from } = found;\n  if (slot > -1) {\n    //player.inventory.remove(from, slot, 1);\n    arrow.use(player, slot);\n    let len = Math.sqrt(Math.pow(player.mouse.x - player.x, 2) + Math.pow(player.mouse.y - player.y, 2));\n    let hsp = (player.mouse.x - player.x) / len * Arrow.speed;\n    let vsp = (player.mouse.y - player.y) / len * Arrow.speed;\n    new Arrow({ x: player.x, y: player.y, hsp: hsp, vsp: vsp, pId: player.id });\n  }\n\n  //Player.broadcast('chat', \"Arrow from (\" + player.x + \",\" + player.y + \") to (\" + player.mouse.x + \", \" + player.mouse.y + \")\");\n};\n//______________________________________________________________________________\nglobal.Consumable = __webpack_require__(/*! ./client/js/classes/Consumable.js */ \"./client/js/classes/Consumable.js\").server;\n//---Useables-------------------------------------------------------------------\nlet bandage = new Consumable({ name: 'bandage', self: true });\nbandage.use = (p, slot) => {\n  p.inventory.remove('hotbar', slot, 1);\n  p.heal(5);\n};\n\nlet arrow = new Consumable({ name: 'arrow', self: false });\narrow.use = (p, slot) => {\n  p.inventory.remove('any', 'arrow', 1);\n};\n//______________________________________________________________________________\nconst ItemProxy = __webpack_require__(/*! ./client/js/classes/Item.js */ \"./client/js/classes/Item.js\");\nconst { server: Item } = ItemProxy;\nglobal.Item = Item;\nconst WallProxy = __webpack_require__(/*! ./client/js/classes/Wall.js */ \"./client/js/classes/Wall.js\");\nconst { server: Wall } = WallProxy;\nconst ProjectileProxy = __webpack_require__(/*! ./client/js/classes/Projectile.js */ \"./client/js/classes/Projectile.js\");\nconst { server: Projectile } = ProjectileProxy;\nconst DecorationProxy = __webpack_require__(/*! ./client/js/classes/Decoration.js */ \"./client/js/classes/Decoration.js\");\nconst { server: Decoration } = DecorationProxy;\nconst Tree = __webpack_require__(/*! ./client/js/classes/Tree.js */ \"./client/js/classes/Tree.js\").server;\nconst Rock = __webpack_require__(/*! ./client/js/classes/Rock.js */ \"./client/js/classes/Rock.js\").server;\n\nwindow.listCounts = new class {\n  constructor() {}\n\n  get Item() {\n    return Object.keys(Item.list).length;\n  }\n\n  get Player() {\n    return Object.keys(Player.list).length;\n  }\n\n  get Projectile() {\n    return Object.keys(Projectile.list).length;\n  }\n}();\n\nconst AppPage = __webpack_require__(/*! ./server/components/AppPage.js */ \"./server/components/AppPage.js\");\n\nfunction copyDefaultPkt() {\n  return JSON.parse(JSON.stringify(defaultPack));\n}\n\n//Fix node imports with the --experimental-modules flag.\n\nconst app = express();\nconst http = httpModule.Server(app);\nconst io = Socket(http);\n\n//---Handle Requests------------------------------------------------------------\napp.get('/', (req, res) => {\n  res.sendFile(basepath + \"/client/index.html\");\n});\n\napp.get('/jquery', (req, res) => {\n  res.sendFile(basepath + '/node_modules/jquery/dist/jquery.min.js');\n});\n\napp.get('/bootstrapjs', (req, res) => {\n  res.sendFile(basepath + \"/node_modules/bootstrap/dist/js/bootstrap.min.js\");\n});\n\napp.get('/bootstrapcss', (req, res) => {\n  res.sendFile(basepath + \"/node_modules/bootstrap/dist/css/bootstrap.min.css\");\n});\n\napp.use(express.static('client'));\n\n//______________________________________________________________________________\n\n//---Init Database--------------------------------------------------------------\nlet accounts;\n\nfunction initData() {\n  accounts = db.getCollection('accounts');\n  if (accounts === null) {\n    accounts = db.addCollection('accounts');\n  }\n}\n\nconst db = new loki('data.db', { autosave: true, autoload: true, autoloadCallback: initData });\n//______________________________________________________________________________\n\n//---Register Connection Tracking-----------------------------------------------\nconst defaultPack = { Player: {}, Item: {}, Wall: {}, Projectile: {}, Decoration: {} };\nglobal.updatePack = copyDefaultPkt();\nglobal.initPack = copyDefaultPkt();\nglobal.removePack = copyDefaultPkt();\nfor (let cName of Object.keys(defaultPack)) {\n  removePack[cName] = [];\n}\n//______________________________________________________________________________\n\n//---Handle Connections---------------------------------------------------------\n\nio.on('connection', socket => {\n  console.log('Socket Connection: ' + socket);\n  //console.log(io.sockets.connected);\n  socket.on('sign-in', creds => {\n    const res = accounts.count(creds);\n    if (res == 1) {\n      socket.emit('sign-in-res', { success: true });\n    } else if (res > 1) {\n      socket.emit('sign-in-res', { success: false, err: 'dupe-acc' });\n    } else {\n      socket.emit('sign-in-res', { success: false, err: 'incorrect' });\n    }\n  });\n\n  socket.on('sign-up', creds => {\n    const res = accounts.count({ user: creds.user });\n    if (res == 0) {\n      accounts.insert(creds);\n      socket.emit('sign-up-res', { success: true });\n    } else {\n      socket.emit('sign-up-res', { success: false, err: 'dupe-acc' });\n    }\n  });\n\n  socket.on('loaded', name => {\n    let connPlayer = new Player({ name, id: socket.id, socket });\n\n    let init = copyDefaultPkt();\n    init.Player = Player.getInit();\n    init.Item = Item.getInit();\n    init.Wall = Wall.getInit();\n    init.Projectile = Projectile.getInit();\n    init.Decoration = Decoration.getInit();\n    console.log(\"Hello\", init);\n    socket.emit('init', { initPkt: init, playerId: socket.id });\n    socket.on('disconnect', () => {\n      console.log(socket.id, Player.list[socket.id].name);\n      Player.list[socket.id].remove();\n    });\n\n    socket.on('mousedown', e => {\n      console.log(\"Click at (\" + e.x + \",\" + e.y + \") on the \" + [\"Left\", \"Middle\", \"Right\"][e.button] + \" button.\");\n      Player.list[socket.id].mouse = { button: e.button + 1, x: Number(e.x), y: Number(e.y) };\n      Player.list[socket.id].mouseThisTick = e.button + 1;\n    });\n\n    socket.on('mouseup', e => {\n      Player.list[socket.id].mouse = 0;\n    });\n\n    socket.on('key', keys => {\n      Player.list[socket.id].keys = keys;\n    });\n\n    let store = {};\n\n    socket.on('eval', str => {\n      try {\n        socket.emit('eval-res', eval(str));\n      } catch (err) {\n        socket.emit('eval-res', err.message, err);\n      }\n    });\n\n    socket.on('chat', str => {\n      console.log(\"CHAT:  <\" + Player.list[socket.id].name + \"> \" + str);\n      for (let id in Player.list) {\n        Player.list[id].socket.emit('chat', \"&lt;\" + Player.list[socket.id].name + \"&gt; \" + str);\n      }\n    });\n  });\n});\n\n//______________________________________________________________________________\n\n//---Begin Listening------------------------------------------------------------\nhttp.listen(CONFIG.port, () => {\n  console.log('Server Started on port ' + CONFIG.port + '.');\n});\n\nwindow.serverEval = str => {\n  try {\n    console.log(eval(str));\n  } catch (err) {\n    console.log(err.message, err);\n  }\n};\n//______________________________________________________________________________\n\n//---Start Main Loop------------------------------------------------------------\n//let checker = new Entity({});\n\nlet MAIN_LOOP = setInterval(() => {\n  Entity.registerCollidables();\n\n  updatePack = copyDefaultPkt();\n  Player.update();\n\n  Item.update();\n\n  Projectile.update();\n\n  updatePack.Player = Player.getUpdate();\n\n  updatePack.Item = Item.getUpdate();\n\n  updatePack.Wall = Wall.getUpdate();\n\n  updatePack.Projectile = Projectile.getUpdate();\n\n  // console.log(initPack);\n  for (let id in Player.list) {\n    Player.list[id].socket.emit('init-pkt', initPack);\n    Player.list[id].socket.emit('update', updatePack);\n    Player.list[id].socket.emit('remove', removePack);\n  }\n  initPack = copyDefaultPkt();\n  for (let cName of Object.keys(defaultPack)) {\n    removePack[cName] = [];\n  }\n}, 1000 / 30);\n\n//______________________________________________________________________________\n$(() => {\n  let reactApp = document.getElementById('app');\n  console.log(reactApp);\n  ReactDOM.render(React.createElement(AppPage, null), reactApp);\n  // function render() {\n  //\n  //   requestAnimationFrame(render);\n  // }\n  // requestAnimationFrame(render);\n});\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./client/js/classes/Arrow.js":
/*!************************************!*\
  !*** ./client/js/classes/Arrow.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ProjectileProxy = __webpack_require__(/*! ./Projectile.js */ \"./client/js/classes/Projectile.js\");\n\nclass server extends ProjectileProxy.server {\n  constructor(params) {\n    super(params);\n    this.damage = params.damage != undefined ? params.damage : 3;\n    this.variant = 'arrow';\n    this.h = 8;\n\n    server.list[this.id] = this;\n    initPack[server.trackName][this.id] = this.getInitPkt();\n    console.log(initPack);\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push('Arrow');\n    return inst;\n  }\n}\n\nserver.speed = 6;\n\nserver.list = {};\n\nserver.trackName = 'Projectile';\n\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/Arrow.js?");

/***/ }),

/***/ "./client/js/classes/Consumable.js":
/*!*****************************************!*\
  !*** ./client/js/classes/Consumable.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class server {\n  constructor({ name, self = true }) {\n    this.name = name;\n    this.self = self;\n    server.list[this.name] = this;\n  }\n\n  use(p, slot) {\n    p.inventory.remove('hotbar', slot, 1);\n    p.socket.emit('chat', 'Useables!! but really you shouldn\\'t see this. Just tell Jacob');\n  }\n\n  static get(name) {\n    return server.list[name];\n  }\n}\n\nserver.list = {};\n\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/Consumable.js?");

/***/ }),

/***/ "./client/js/classes/Decoration.js":
/*!*****************************************!*\
  !*** ./client/js/classes/Decoration.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EntityProxy = __webpack_require__(/*! ./Entity.js */ \"./client/js/classes/Entity.js\");\nclass client extends EntityProxy.client {\n  constructor(params) {\n    super(params);\n    const { category, variant, health, healthMax } = params;\n    this.category = category;\n    this.variant = variant;\n    console.log(category, variant);\n    this.health = health;\n    this.healthMax = healthMax;\n    this.sprite = Sprites.get('decoration_' + this.category + \"_\" + this.variant);\n\n    client.list[this.id] = this;\n  }\n\n  render(canvas) {\n    this.sprite.drawCenter(canvas, this);\n  }\n\n  remove() {\n    delete this.constructor.list[this.id];\n    super.remove();\n  }\n\n  update(pkt) {\n    this.category = pkt.category;\n    this.variant = pkt.variant;\n    super.update(pkt);\n    if (this.x > canvas.camera.x - canvas.width / 2 && this.x < canvas.camera.x + canvas.width / 2 && this.y > canvas.camera.y - canvas.height / 2 && this.y < canvas.camera.y + canvas.height / 2) client.visible.push(this);\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(client.trackName);\n    return inst;\n  }\n}\n\nclass server extends EntityProxy.server {\n  constructor(params) {\n    super(params);\n    const { category, variant, health, healthMax } = params;\n    this.category = category;\n    this.variant = variant;\n    this.health = health;\n    this.healthMax = healthMax;\n\n    server.list[this.id] = this;\n    initPack[server.trackName][this.id] = this.getInitPkt();\n  }\n\n  getInitPkt() {\n    let pkt = super.getInitPkt();\n    pkt.category = this.category;\n    pkt.variant = this.variant;\n    return pkt;\n  }\n\n  getUpdatePkt() {\n    let pkt = super.getInitPkt();\n    pkt.category = this.category;\n    pkt.variant = this.variant;\n    return pkt;\n  }\n\n  update() {\n\n    super.update();\n  }\n\n  damage(amount, p) {\n    this.health = Math.max(this.health - amount, 0);\n    if (this.health <= 0) this.kill(p);\n  }\n\n  kill(p) {\n    p.exp += Math.floor(Math.random() * 3);\n    this.remove();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  static getUpdate() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();\n    }\n    return pkt;\n  }\n\n  static getInit() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      pkt[objId] = obj.getInitPkt();\n    }\n    return pkt;\n  }\n}\n\nclient.trackName = server.trackName = \"Decoration\";\nserver.list = {};\nclient.list = {};\nclient.visible = [];\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Decoration.js?");

/***/ }),

/***/ "./client/js/classes/Entity.js":
/*!*************************************!*\
  !*** ./client/js/classes/Entity.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const TrackableProxy = __webpack_require__(/*! ./Trackable.js */ \"./client/js/classes/Trackable.js\");\n\nlet client = class extends TrackableProxy.client {\n  constructor(params) {\n    super(params);\n    const { x = 0, y = 0, world = 0, w = 32, h = 32 } = params;\n    this.x = x;\n    this.y = y;\n    this.world = world;\n    this.w = w;\n    this.h = h;\n\n    client.list[this.id] = this;\n  }\n\n  render(canvas) {\n    canvas.colour('purple');\n    canvas.centerRect(this);\n  }\n\n  update(pkt) {\n    this.x = pkt.x;\n    this.y = pkt.y;\n    this.world = pkt.world;\n    super.update(pkt);\n  }\n\n  remove() {\n    //server.trackList.remove[server.trackName].push(this.id);\n    // if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);\n    delete this.constructor.list[this.id];\n    super.remove();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(client.trackName);\n    return inst;\n  }\n};\n\nlet server = class extends TrackableProxy.server {\n  constructor(params) {\n    super(params);\n    const { x = 0, y = 0, world = 0, w = 32, h = 32, solid = false } = params;\n    this.x = x;\n    this.y = y;\n    this.world = world;\n    this.w = w;\n    this.h = h;\n    this.hsp = 0;\n    this.vsp = 0;\n    this.solid = solid;\n\n    server.list[this.id] = this;\n    console.log(super.type);\n  }\n\n  dist(obj, x = this.x, y = this.y) {\n    return Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2);\n  }\n\n  collision(x, y, onlySolid, type) {\n\n    for (let objName in CollisionTree.retrieve(this)) {\n      let obj = server.list[objName];\n      if (!obj) continue;\n      if (obj.id == this.id) continue;\n      if (typeof type != 'undefined' && !obj.type.includes(type)) continue;\n      if (onlySolid && !obj.solid) continue;\n      //if (this.dist(obj,x,y)>(Math.pow(this.w/2,2)+Math.pow(this.h/2,2))) continue;\n      if (x - this.w / 2 > obj.x + obj.w / 2 || x + this.w / 2 < obj.x - obj.w / 2) continue;\n      if (y - this.h / 2 > obj.y + obj.h / 2 || y + this.h / 2 < obj.y - obj.h / 2) continue;\n      return obj;\n    }\n    return false;\n  }\n\n  update() {\n    if (this.collision(this.x + this.hsp, this.y, true)) {\n      while (!this.collision(this.x + Math.sign(this.hsp), this.y, true)) {\n        this.x += Math.sign(this.hsp);\n      }\n      this.hsp = 0;\n    }\n\n    this.x += this.hsp;\n\n    if (this.collision(this.x, this.y + this.vsp, true)) {\n      while (!this.collision(this.x, this.y + Math.sign(this.vsp), true)) {\n        this.y += Math.sign(this.vsp);\n      }\n      this.vsp = 0;\n    }\n\n    this.y += this.vsp;\n\n    this.markDirty();\n  }\n\n  remove() {\n    super.remove();\n    delete server.list[this.id];\n  }\n\n  getInitPkt() {\n    let pkt = super.getInitPkt();\n    pkt.x = this.x;\n    pkt.y = this.y;\n    pkt.w = this.w;\n    pkt.h = this.h;\n    pkt.world = this.world;\n    return pkt;\n  }\n\n  getUpdatePkt() {\n    let pkt = super.getUpdatePkt();\n    pkt.x = this.x;\n    pkt.y = this.y;\n    pkt.world = this.world;\n    return pkt;\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  static registerCollidables() {\n    CollisionTree.clear();\n    for (let i in server.list) {\n      CollisionTree.insert(server.list[i]);\n    }\n  }\n};\n\n//console.log(server.getUpdate());\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Entity.js?");

/***/ }),

/***/ "./client/js/classes/Inventory.js":
/*!****************************************!*\
  !*** ./client/js/classes/Inventory.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ItemProxy = __webpack_require__(/*! ./Item.js */ \"./client/js/classes/Item.js\");\n\nlet client = class {\n  constructor({ size = 1, hotbarSize = 0 }) {\n    this.size = size - hotbarSize;\n    this.hotbarSize = hotbarSize;\n    this.totalSize = size;\n    this.list = [];\n    this.hotbar = [];\n    this.selectedSlot = 0;\n    this.clear();\n  }\n\n  get selected() {\n    return this.hotbar[this.selectedSlot];\n  }\n\n  update(hotbar, list, selectedSlot) {\n    this.hotbar = hotbar;\n    this.list = list;\n    this.selectedSlot = selectedSlot;\n  }\n\n  clear() {\n    for (let i = 0; i < this.size; i++) {\n      this.list[i] = { count: 0, item: null };\n    }\n    for (let i = 0; i < this.hotbarSize; i++) {\n      this.hotbar[i] = { count: 0, item: null };\n    }\n  }\n};\n\nlet server = class {\n  constructor({ size = 1, hotbarSize = 0 }) {\n    this.size = size - hotbarSize;\n    this.hotbarSize = hotbarSize;\n    this.totalSize = size;\n    this.list = [];\n    this.hotbar = [];\n    this.selectedSlot = 0;\n    this.clear();\n  }\n\n  get selected() {\n    return this.hotbar[this.selectedSlot];\n  }\n\n  drop(from, slot, amount = Infinity, x = 0, y = 0) {\n    let type = this[from][slot].item;\n    if (type == null) return 0;\n    let count = Math.min(this[from][slot].count, amount);\n    if (count == 0) return 0;\n    this[from][slot].count -= count;\n    if (this[from][slot].count <= 0) this[from][slot].item = null;\n    new ItemProxy.server({ item: type, count, x, y, delay: 100 });\n    return count;\n  }\n\n  remove(from, slot, amount) {\n    if (from == 'any') {\n      let int = this.getFirst(slot);\n      slot = int.slot;\n      from = int.from;\n      if (slot <= -1) return;\n    }\n    let type = this[{ 'hotbar': 'hotbar', 'inventory': 'list' }[from]][slot].item;\n    if (type == null) return 0;\n    let count = Math.min(this[from][slot].count, amount);\n    if (count == 0) return 0;\n    this[from][slot].count -= count;\n    if (this[from][slot].count <= 0) this[from][slot].item = null;\n    return count;\n  }\n\n  getFirst(type, from = 'any') {\n    switch (from) {\n      case 'inventory':\n        return this.list.findIndex(item => {\n          return item.item == type;\n        });\n        break;\n\n      case 'hotbar':\n        return this.hotbar.findIndex(item => {\n          return item.item == type;\n        });\n        break;\n\n      case 'any':\n        let i = this.hotbar.findIndex(item => {\n          return item.item == type;\n        });\n\n        if (i > -1) return { slot: i, from: 'hotbar' };\n\n        return { slot: this.list.findIndex(item => {\n            return item.item == type;\n          }), from: 'inventory' };\n    }\n  }\n\n  add(type, amount, to = 'any', slot) {\n    let total = amount;\n    if (amount == 0) {\n      console.log('Error in amount');return 0;\n    }\n    if (type == null) {\n      console.log('Error in type');return 0;\n    }\n    if (!['any', 'hotbar', 'inventory'].includes(to)) {\n      console.log('Error in to');return 0;\n    }\n    switch (to) {\n      case 'any':\n        for (let i = 0; i < this.hotbarSize; i++) {\n          if (this.hotbar[i].count > 99 || this.hotbar[i].item != null && this.hotbar[i].item != type) continue;\n          let item = this.hotbar[i];\n          let toAdd = Math.min(amount, 99 - item.count);\n          if (item.item == null) {\n            item.item = type;\n          }\n          item.count += toAdd;\n          amount -= toAdd;\n          if (amount <= 0) break;\n        }\n        if (amount <= 0) return total;\n        for (let i = 0; i < this.size; i++) {\n          if (this.list[i].count > 99 || this.list[i].item != null && this.list[i].item != type) continue;\n          let item = this.list[i];\n          let toAdd = Math.min(amount, 99 - item.count);\n          if (item.item == null) {\n            item.item = type;\n          }\n          item.count += toAdd;\n          amount -= toAdd;\n          if (amount <= 0) break;\n        }\n        if (amount <= 0) return total;\n        return total - amount;\n        break;\n\n      case 'hotbar':\n        if (typeof slot != 'undefined') {\n          if (this.hotbar[slot].count > 99 || this.hotbar[slot].item != null && this.hotbar[slot].item != type) return 0;\n          let item = this.hotbar[slot];\n          let toAdd = Math.min(amount, 99 - item.count);\n          if (item.item == null) {\n            item.item = type;\n          }\n          item.count += toAdd;\n          amount -= toAdd;\n          return total - amount;\n        }\n        for (let i = 0; i < this.hotbarSize; i++) {\n          if (this.hotbar[i].count > 99 || this.hotbar[i].item != null && this.hotbar[i].item != type) continue;\n          let item = this.hotbar[i];\n          let toAdd = Math.min(amount, 99 - item.count);\n          if (item.item == null) {\n            item.item = type;\n          }\n          item.count += toAdd;\n          amount -= toAdd;\n          if (amount <= 0) break;\n        }\n        if (amount <= 0) return total;\n        return total - amount;\n        break;\n\n      case 'inventory':\n        if (typeof slot != 'undefined') {\n          if (this.hotbar[slot].count > 99 || this.hotbar[slot].item != null && this.hotbar[slot].item != type) return 0;\n          let item = this.hotbar[slot];\n          let toAdd = Math.min(amount, 99 - item.count);\n          if (item.item == null) {\n            item.item = type;\n          }\n          item.count += toAdd;\n          amount -= toAdd;\n          return total - amount;\n        }\n        for (let i = 0; i < this.size; i++) {\n          if (this.list[i].count > 99 || this.list[i].item != null && this.list[i].item != type) continue;\n          let item = this.list[i];\n          let toAdd = Math.min(amount, 99 - item.count);\n          if (item.item == null) {\n            item.item = type;\n          }\n          item.count += toAdd;\n          amount -= toAdd;\n          if (amount <= 0) break;\n        }\n        if (amount <= 0) return total;\n        return total - amount;\n        break;\n    }\n  }\n\n  set(to, slot, amount, type) {\n    if (!['hotbar', 'inventory'].includes(to) || slot > this[to == 'inventory' ? 'list' : to].length - 1) return false;\n    this[to == 'inventory' ? 'list' : to][slot] = { type: type ? type : this[to == 'inventory' ? 'list' : to][slot].item, count: Math.min(99, Math.max(0, amount)) };\n    return true;\n  }\n\n  clear() {\n    for (let i = 0; i < this.size; i++) {\n      this.list[i] = { count: 0, item: null };\n    }\n    for (let i = 0; i < this.hotbarSize; i++) {\n      this.hotbar[i] = { count: 0, item: null };\n    }\n  }\n\n};\n\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Inventory.js?");

/***/ }),

/***/ "./client/js/classes/Item.js":
/*!***********************************!*\
  !*** ./client/js/classes/Item.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EntityProxy = __webpack_require__(/*! ./Entity.js */ \"./client/js/classes/Entity.js\");\n\nlet client = class extends EntityProxy.client {\n  constructor(params) {\n    super(params);\n    const { item, count } = params;\n    this.item = item;\n    this.count = count;\n\n    client.list[this.id] = this;\n  }\n\n  render(canvas) {\n    Sprites.get('item_' + this.item).drawCenter(canvas, this);\n    //super.render(canvas);\n  }\n\n  remove() {\n    delete this.constructor.list[this.id];\n    super.remove();\n  }\n\n  update(pkt) {\n    this.item = pkt.item;\n    this.count = pkt.count;\n    super.update(pkt);\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(client.trackName);\n    return inst;\n  }\n};\n\nlet server = class extends EntityProxy.server {\n  constructor(params) {\n    super(params);\n    const { item, count, delay } = params;\n    this.item = item;\n    this.count = count;\n    this.delay = delay;\n\n    server.list[this.id] = this;\n    initPack[server.trackName][this.id] = this.getInitPkt();\n  }\n\n  getInitPkt() {\n    let pkt = super.getInitPkt();\n    pkt.item = this.item;\n    pkt.count = this.count;\n    return pkt;\n  }\n\n  getUpdatePkt() {\n    let pkt = super.getUpdatePkt();\n    pkt.item = this.item;\n    pkt.count = this.count;\n    return pkt;\n  }\n\n  update() {\n    let p = this.collision(this.x, this.y, false, 'Player');\n    if (this.delay <= 0 && p && !p.dead) {\n      let added = p.inventory.add(this.item, this.count, 'any');\n      this.count -= added;\n      console.log(added, this.count);\n      if (this.count <= 0) this.remove();\n    }\n    this.delay = Math.max(this.delay - 1, 0);\n    super.update();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  static getUpdate() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();\n    }\n    return pkt;\n  }\n\n  static getInit() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      pkt[objId] = obj.getInitPkt();\n    }\n    return pkt;\n  }\n};\nclient.trackName = server.trackName = \"Item\";\nserver.list = {};\nclient.list = {};\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Item.js?");

/***/ }),

/***/ "./client/js/classes/Player.js":
/*!*************************************!*\
  !*** ./client/js/classes/Player.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EntityProxy = __webpack_require__(/*! ./Entity.js */ \"./client/js/classes/Entity.js\");\nconst InventoryProxy = __webpack_require__(/*! ./Inventory.js */ \"./client/js/classes/Inventory.js\");\n\nlet client = class extends EntityProxy.client {\n  constructor(params) {\n    super(params);\n    const { name, inventory, maxMana, mana, maxHealth, health, selectedSlot, exp, toNextL, level } = params;\n    this.name = name;\n    this.maxHealth = maxHealth;\n    this.health = health;\n    this.maxMana = maxMana;\n    this.mana = mana;\n    this.exp = exp;\n    this.toNextL = toNextL;\n    this.level = level;\n    this.inventory = new InventoryProxy.client(inventory);\n\n    client.list[this.id] = this;\n  }\n\n  render(canvas) {\n    super.render(canvas);\n    canvas.minimap.colour('lime');\n    canvas.minimap.centerRect(this);\n    canvas.font('10px Arial');\n    canvas.colour('black');\n    canvas.text(this.name, this.x, this.y - this.h / 0.8);\n    canvas.text(\"Level: \" + this.level, this.x, this.y - this.h / 0.6);\n    canvas.colour('red');\n    canvas.rect({ x: this.x - this.w / 2, y: this.y - this.w, w: 32, h: 5 });\n    canvas.colour('green');\n    canvas.rect({ x: this.x - this.w / 2, y: this.y - this.w, w: 32 * (this.health / this.maxHealth), h: 5 });\n  }\n\n  update(pkt) {\n    this.inventory.update(pkt.inventory.hotbar, pkt.inventory.list, pkt.inventory.selectedSlot);\n    this.health = pkt.health;\n    this.maxHealth = pkt.maxHealth;\n    this.mana = pkt.mana;\n    this.maxMana = pkt.maxMana;\n    this.exp = pkt.exp;\n    this.toNextL = pkt.toNextL;\n    this.level = pkt.level;\n    delete pkt.inventory;\n    super.update(pkt);\n  }\n\n  remove() {\n    //server.trackList.remove[server.trackName].push(this.id);\n    // if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);\n    delete this.constructor.list[this.id];\n    super.remove();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(client.trackName);\n    return inst;\n  }\n};\n\nlet server = class extends EntityProxy.server {\n  constructor(params) {\n    super(params);\n    const { name = 'player', socket, moveSpeed = 5, maxHealth = 20, health = maxHealth, maxMana = 100, mana = maxMana } = params;\n    this.name = name;\n    this.socket = socket;\n    this.moveSpeed = moveSpeed;\n    this.keys = {};\n    this.dead = false;\n    this.deathTime = 0;\n    this.mouse = { button: 0, x: this.x, y: this.y };\n    this.mouseThisTick = 0;\n    this.maxHealth = maxHealth;\n    this.health = health;\n    this.maxMana = maxMana;\n    this.mana = mana;\n    this.exp = 0;\n    this.toNextL = 100;\n    this.level = 0;\n    this.inventory = new InventoryProxy.server({ size: 36, hotbarSize: 9 });\n\n    server.list[this.id] = this;\n    initPack[server.trackName][this.id] = this.getInitPkt();\n    //console.log(initPack[server.trackName][this.id]);\n  }\n\n  getInitPkt() {\n    let pkt = super.getInitPkt();\n    pkt.name = this.name;\n    pkt.maxHealth = this.maxHealth;\n    pkt.health = this.health;\n    pkt.maxMana = this.maxMana;\n    pkt.mana = this.mana;\n    pkt.exp = this.exp;\n    pkt.toNextL = this.toNextL;\n    pkt.level = this.level;\n    pkt.inventory = { size: this.inventory.totalSize, hotbarSize: this.inventory.hotbarSize };\n    return pkt;\n  }\n\n  update() {\n    if (!this.dead) {\n      if (this.toNextL <= this.exp) {\n        this.level++;\n        this.exp -= this.toNextL;\n        this.toNextL += this.level * 10;\n      }\n      this.hsp = (Number(Boolean(this.keys[\"D\"]) || Boolean(this.keys[\"ARROWRIGHT\"])) - Number(Boolean(this.keys[\"A\"]) || Boolean(this.keys[\"ARROWLEFT\"]))) * this.moveSpeed;\n      this.vsp = (Number(Boolean(this.keys[\"S\"]) || Boolean(this.keys[\"ARROWDOWN\"])) - Number(Boolean(this.keys[\"W\"]) || Boolean(this.keys[\"ARROWUP\"]))) * this.moveSpeed;\n\n      if (this.mouseThisTick == 1) {\n        let tool = global.Tool.get(this.inventory.selected.item);\n        if (tool) {\n          tool.use(this);\n        } else {\n          let deco = this.collision(this.x, this.y, false, 'Tree') || this.collision(this.x, this.y, false, 'Rock');\n          if (deco) {\n            deco.damage(1, this);\n          }\n        }\n      }\n\n      if (this.mouseThisTick == 3) {\n        let cons = global.Consumable.get(this.inventory.selected.item);\n        if (cons) cons.use(this, this.inventory.selectedSlot);\n      }\n\n      if (this.keys[1] || this.keys[2] || this.keys[3] || this.keys[4] || this.keys[5] || this.keys[6] || this.keys[7] || this.keys[8] || this.keys[9]) {\n        let test = [];\n        for (let i = 1; i < 10; i++) {\n          if (this.keys[i]) test.push(i);\n        }\n        this.inventory.selectedSlot = test[0] ? test[0] - 1 : this.inventory.selectedSlot;\n      }\n\n      this.mouseThisTick = 0;\n      super.update();\n    } else {\n      this.deathTime--;\n      if (this.deathTime <= 0) this.respawn();\n    }\n  }\n\n  respawn() {\n    this.x = 0;\n    this.y = 0;\n    this.dead = false;\n    this.deathTime = 0;\n    this.exp = 0;\n    this.health = this.maxHealth;\n    this.mana = this.maxMana;\n    this.socket.emit('respawn');\n  }\n\n  damage(damage, p) {\n    if (this.dead) return;\n    this.health = Math.max(this.health - damage, 0);\n    if (this.health <= 0) {\n      this.kill(p);\n    } else {\n      this.socket.emit('damage', damage);\n    }\n  }\n\n  heal(amount) {\n    if (this.dead) return;\n    this.health = Math.min(this.maxHealth, this.health + amount);\n  }\n\n  kill(p) {\n    this.dead = true;\n    this.deathTime = 300;\n    this.hsp = this.vsp = 0;\n    for (let key in this.keys) this.keys[key] = false;\n    for (let i = 0; i < this.inventory.hotbarSize; i++) {\n      this.inventory.drop('hotbar', i, Infinity, this.x, this.y);\n    }\n    for (let i = 0; i < this.inventory.size; i++) {\n      this.inventory.drop('list', i, Infinity, this.x, this.y);\n    }\n    p.exp += Math.floor(Math.random() * 10);\n    this.socket.emit('kill', p.name);\n  }\n\n  getUpdatePkt() {\n    let pkt = super.getUpdatePkt();\n    pkt.name = this.name;\n    pkt.maxHealth = this.maxHealth;\n    pkt.health = this.health;\n    pkt.maxMana = this.maxMana;\n    pkt.mana = this.mana;\n    pkt.exp = this.exp;\n    pkt.toNextL = this.toNextL;\n    pkt.level = this.level;\n    pkt.inventory = { list: this.inventory.list, hotbar: this.inventory.hotbar, selectedSlot: this.inventory.selectedSlot };\n    return pkt;\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  render(ctx) {\n    ctx.fillStyle = '#00ff00';\n    ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);\n  }\n\n  static getUpdate() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();\n    }\n    return pkt;\n  }\n\n  static getInit() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      pkt[objId] = obj.getInitPkt();\n    }\n    return pkt;\n  }\n\n  static broadcast(e, m) {\n    for (let id in server.list) {\n      server.list[id].socket.emit(e, m);\n    }\n  }\n\n  // static getRemove(){\n  //   let pkt = {};\n  //   for (let objId in server.list){\n  //     let obj = server.list[objId];\n  //     if (obj.dirty) pkt[objId] = obj.getRemovePkt();\n  //   }\n  //   return pkt;\n  // }\n};\n\nserver.list = {};\nclient.list = {};\n\n//console.log(EntityProxy.server.getUpdate());\n\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Player.js?");

/***/ }),

/***/ "./client/js/classes/Projectile.js":
/*!*****************************************!*\
  !*** ./client/js/classes/Projectile.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EntityProxy = __webpack_require__(/*! ./Entity.js */ \"./client/js/classes/Entity.js\");\n\nlet client = class extends EntityProxy.client {\n  constructor(params) {\n    super(params);\n    const { variant, rot } = params;\n    this.variant = variant;\n    this.rot = rot;\n\n    client.list[this.id] = this;\n    console.log('New Projectile', client.list);\n  }\n\n  render(canvas) {\n    Sprites.get('proj_' + this.variant).drawCenter(canvas, this);\n  }\n\n  update(pkt) {\n    this.rot = pkt.rot;\n    super.update(pkt);\n  }\n\n  remove() {\n    delete client.list[this.id];\n    super.remove();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(client.trackName);\n    return inst;\n  }\n};\n\nlet server = class extends EntityProxy.server {\n  constructor(params) {\n    super(params);\n    const { variant, damage, pId, hsp, vsp } = params;\n    this.variant = variant;\n    this.damage = damage;\n    this.pId = pId;\n    this.age = 0;\n    this.hsp = hsp;\n    this.vsp = vsp;\n\n    server.list[this.id] = this;\n    initPack[server.trackName][this.id] = this.getInitPkt();\n  }\n\n  get rot() {\n    return Math.atan2(this.vsp, this.hsp);\n  }\n\n  getInitPkt() {\n    let pkt = super.getInitPkt();\n    pkt.variant = this.variant;\n    pkt.rot = this.rot;\n    return pkt;\n  }\n\n  getUpdatePkt() {\n    let pkt = super.getUpdatePkt();\n    pkt.rot = this.rot;\n    return pkt;\n  }\n\n  remove() {\n    delete server.list[this.id];\n    super.remove();\n  }\n\n  update() {\n    super.update();\n    let p = this.collision(this.x, this.y, false, 'Player');\n\n    if (p) {\n      this.onHit(p);\n    }\n\n    this.age++;\n    if (this.age >= 1000) {\n      this.remove();\n    }\n  }\n\n  onHit(p) {\n    if (p.id != this.pId) {\n      p.damage(this.damage, p.constructor.list[this.pId]);\n      this.remove();\n    }\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  static getUpdate() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();\n    }\n    return pkt;\n  }\n\n  static getInit() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      pkt[objId] = obj.getInitPkt();\n    }\n    return pkt;\n  }\n\n  static update() {\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      obj.update();\n    }\n  }\n};\n\nclient.list = {};\nserver.list = {};\n\nclient.trackName = server.trackName = \"Projectile\";\n\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Projectile.js?");

/***/ }),

/***/ "./client/js/classes/QuadNode.js":
/*!***************************************!*\
  !*** ./client/js/classes/QuadNode.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class server {\n  constructor(bounds, maxChildren = 10, depth = 0, maxDepth = 5) {\n    this.nodes = [];\n    this.bounds = bounds;\n    this.children = [];\n    this.maxChildren = maxChildren;\n    this.depth = depth;\n    this.maxDepth = maxDepth;\n  }\n\n  insert(obj) {\n    if (this.nodes.length) {\n      let indecies = this.findCorners(obj);\n      for (let index in indecies) {\n        this.nodes[index].insert(obj);\n      }\n      return;\n    }\n\n    this.children.push(obj);\n\n    let len = this.children.length;\n    if (this.depth < this.maxDepth && len >= this.maxChildren) {\n      this.subdivide();\n\n      for (let i in this.children) {\n        this.insert(this.children[i]);\n      }\n\n      this.children.length = 0;\n    }\n  }\n\n  subdivide() {\n    let { x, y, w, h } = this.bounds;\n    w = w / 2;\n    h = h / 2;\n    this.nodes[server.TOP_LEFT] = new server({ x, y, w, h }, this.maxChildren, this.depth + 1, this.maxDepth);\n    this.nodes[server.TOP_RIGHT] = new server({ x: x + w, y, w, h }, this.maxChildren, this.depth + 1, this.maxDepth);\n    this.nodes[server.BOTTOM_LEFT] = new server({ x, y: y + h, w, h }, this.maxChildren, this.depth + 1, this.maxDepth);\n    this.nodes[server.BOTTOM_RIGHT] = new server({ x: x + w, y: y + h, w, h }, this.maxChildren, this.depth + 1, this.maxDepth);\n  }\n\n  retrieve(obj, out) {\n    let { x, y, w, h } = this.bounds;\n    if (x + w < obj.x - obj.w / 2 || x > obj.x + obj.w / 2 || y + h < obj.y - obj.h / 2 || y > obj.y + obj.h / 2) return;\n    if (this.nodes.length > 0) {\n      for (let i in this.nodes) {\n        this.nodes[i].retrieve(obj, out);\n      }\n      return;\n    }\n    //if (this.children.length > 0) console.log(this.children.length);\n    if (obj.name && this.children.length > 0) this.checkedThisTick = true;\n    for (let i in this.children) {\n      out[this.children[i].id] = this.children[i];\n    }\n  }\n\n  findCorners(obj) {\n    let res = [];\n    for (let i in this.nodes) {\n      let { x, y, w, h } = this.nodes[i].bounds;\n      if (x + w < obj.x - obj.w / 2 || x > obj.x + obj.w / 2 || y + h < obj.y - obj.h / 2 || y > obj.y + obj.h / 2) continue;\n      res.push(i);\n    }\n    return res;\n  }\n\n  draw(ctx) {\n    if (this.nodes.length > 0) {\n      for (let i in this.nodes) {\n        this.nodes[i].draw(ctx);\n      }\n      return;\n    }\n    ctx.strokeStyle = \"red\";\n    let { x, y, w, h } = this.bounds;\n    ctx.strokeRect(x, y, w, h);\n    if (this.checkedThisTick) {\n      ctx.fillStyle = \"#9999ff\";\n      ctx.fillRect(x, y, w, h);\n      this.checkedThisTick = false;\n    }\n    ctx.fillStyle = 'black';\n    ctx.textBaseline = 'middle';\n    ctx.textAlign = 'center';\n    ctx.font = '100pt Arial';\n    ctx.fillText(this.children.length, x + w / 2, y + h / 2);\n  }\n\n  clear() {\n    if (this.nodes.length > 0) {\n      for (let i in this.nodes) this.nodes[i].clear();\n      return;\n    }\n\n    this.children.length = 0;\n  }\n}\n\nserver.TOP_LEFT = 0;\nserver.TOP_RIGHT = 1;\nserver.BOTTOM_LEFT = 2;\nserver.BOTTOM_RIGHT = 3;\n\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/QuadNode.js?");

/***/ }),

/***/ "./client/js/classes/QuadTree.js":
/*!***************************************!*\
  !*** ./client/js/classes/QuadTree.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const QuadNode = __webpack_require__(/*! ./QuadNode.js */ \"./client/js/classes/QuadNode.js\").server;\n\nclass server {\n  constructor(maxChildren = 10, maxDepth = 5) {\n    this.maxChildren = maxChildren;\n    this.maxDepth = maxDepth;\n    this.root = new QuadNode({ x: -5000, y: -5000, w: 10000, h: 10000 }, this.maxChildren, 0, this.maxDepth);\n  }\n\n  draw(ctx) {\n    this.root.draw(ctx);\n  }\n\n  insert(obj) {\n    this.root.insert(obj);\n  }\n\n  clear() {\n    this.root.clear();\n  }\n\n  retrieve(obj) {\n    let res = {};\n    this.root.retrieve(obj, res);\n    return res;\n  }\n}\n\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/QuadTree.js?");

/***/ }),

/***/ "./client/js/classes/Rock.js":
/*!***********************************!*\
  !*** ./client/js/classes/Rock.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const DecorationProxy = __webpack_require__(/*! ./Decoration.js */ \"./client/js/classes/Decoration.js\");\n//const ItemProxy = require('./Item.js');\n\nclass server extends DecorationProxy.server {\n  constructor(params) {\n    super(params);\n    this.category = 'rock';\n    this.variant = Math.floor(Math.random() * 4);\n    this.health = this.healthMax = 6;\n\n    initPack[server.trackName][this.id] = this.getInitPkt();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push('Rock');\n    return inst;\n  }\n\n  kill(p) {\n    let n = Math.floor(Math.random() * 3) + 2;\n    new Item({ x: this.x, y: this.y, item: 'stone', count: n, delay: 100 });\n    super.kill(p);\n  }\n}\n\nserver.trackName = 'Decoration';\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/Rock.js?");

/***/ }),

/***/ "./client/js/classes/Tool.js":
/*!***********************************!*\
  !*** ./client/js/classes/Tool.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let server = class {\n  constructor({ name }) {\n    this.name = name;\n\n    server.list[name] = this;\n  }\n\n  use(player) {\n    player.socket.emit('chat', ['POOF!', 'BANG!', 'TZZT!', 'ZAP!', 'POW!', 'You are really persistant aren\\'t you?'][Math.floor(Math.random() * 5)]);\n  }\n\n  static get(name) {\n    return typeof server.list[name] != 'undefined' ? server.list[name] : false;\n  }\n};\n\nserver.list = {};\n\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/Tool.js?");

/***/ }),

/***/ "./client/js/classes/Trackable.js":
/*!****************************************!*\
  !*** ./client/js/classes/Trackable.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("let uuid;\nif (side == 'SERVER') {\n  uuid = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\n}\n\nlet client = class {\n  constructor(initPkt) {\n    this.id = initPkt.id;\n\n    client.list[this.id] = this;\n\n    this.update = this.update.bind(this);\n  }\n\n  update(updatePkt) {\n    ;\n    //console.log(updatePkt);\n  }\n\n  remove() {\n    //server.trackList.remove[server.trackName].push(this.id);\n    //if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);\n    delete this.constructor.list[this.id];\n  }\n\n  get type() {\n    let inst = new Array();\n    inst.push(client.trackName);\n    return inst;\n  }\n\n  // static setTrack(connection, regName){\n  //   client.trackList = connection;\n  //   client.trackList = regName;\n  // }\n\n\n};\n\nclient.trackName = '';\nclient.trackList = {};\nclient.list = {};\n\nlet server = class {\n  constructor(params) {\n    this.id = typeof params.id != \"undefined\" ? params.id : uuid();\n    this.dirty = false;\n\n    server.list[this.id] = this;\n\n    this.markDirty = this.markDirty.bind(this);\n    this.remove = this.remove.bind(this);\n    this.getUpdatePkt = this.getUpdatePkt.bind(this);\n    this.getInitPkt = this.getInitPkt.bind(this);\n  }\n\n  markDirty() {\n    if (this.dirty) return;\n    //console.log(server);\n    //server.trackList.dirty[server.trackName].push(this);\n    this.dirty = true;\n  }\n\n  remove() {\n    //server.trackList.remove[server.trackName].push(this.id);\n    if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);\n    delete this.constructor.list[this.id];\n  }\n\n  getUpdatePkt() {\n    return { id: this.id };\n  }\n\n  getInitPkt() {\n    return { id: this.id };\n  }\n\n  get type() {\n    let inst = new Array();\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  static update() {\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      obj.update();\n    }\n  }\n\n  static getUpdate() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();\n    }\n    return pkt;\n  }\n\n  static getInit() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getInitPkt();\n    }\n    return pkt;\n  }\n\n  static getRemove() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getRemovePkt();\n    }\n    return pkt;\n  }\n\n  // static setTrack(connection, regName){\n  //   server.trackList = connection;\n  //   server.trackName = regName;\n  // }\n\n};\n\nserver.trackName = '';\nserver.trackList = {};\nserver.list = {};\n\n//console.log(server.getUpdate());\n\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Trackable.js?");

/***/ }),

/***/ "./client/js/classes/Tree.js":
/*!***********************************!*\
  !*** ./client/js/classes/Tree.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const DecorationProxy = __webpack_require__(/*! ./Decoration.js */ \"./client/js/classes/Decoration.js\");\n//const ItemProxy = require('./Item.js');\n\nclass server extends DecorationProxy.server {\n  constructor(params) {\n    super(params);\n    this.category = 'tree';\n    this.variant = Math.floor(Math.random() * 4);\n    this.health = this.healthMax = 3;\n\n    initPack[server.trackName][this.id] = this.getInitPkt();\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push('Tree');\n    return inst;\n  }\n\n  kill(p) {\n    let n = Math.floor(Math.random() * 3) + 2;\n    new Item({ x: this.x, y: this.y, item: 'wood', count: n, delay: 100 });\n    super.kill(p);\n  }\n}\n\nserver.trackName = 'Decoration';\nmodule.exports = { server };\n\n//# sourceURL=webpack:///./client/js/classes/Tree.js?");

/***/ }),

/***/ "./client/js/classes/Wall.js":
/*!***********************************!*\
  !*** ./client/js/classes/Wall.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const EntityProxy = __webpack_require__(/*! ./Entity.js */ \"./client/js/classes/Entity.js\");\n\nlet client = class extends EntityProxy.client {\n  constructor(params) {\n    super(params);\n\n    client.list[this.id] = this;\n  }\n\n  remove() {\n    delete this.constructor.list[this.id];\n    super.remove();\n  }\n\n  render(canvas) {\n    canvas.colour('grey');\n    canvas.centerRect(this);\n    canvas.colour('black');\n    canvas.lineWidth(2);\n    canvas.centerRect(this, true);\n    canvas.minimap.colour('grey');\n    canvas.minimap.centerRect(this);\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(client.trackName);\n    return inst;\n  }\n};\n\nlet server = class extends EntityProxy.server {\n  constructor(params) {\n    params.solid = true;\n    super(params);\n\n    server.list[this.id] = this;\n    initPack[server.trackName][this.id] = this.getInitPkt();\n  }\n\n  getInitPkt() {\n    return super.getInitPkt();\n  }\n\n  getUpdatePkt() {\n    let pkt = super.getUpdatePkt();\n    pkt.w = this.w;\n    pkt.h = this.h;\n    return pkt;\n  }\n\n  get type() {\n    let inst = super.type;\n    inst.push(server.trackName);\n    return inst;\n  }\n\n  static getUpdate() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();\n    }\n    return pkt;\n  }\n\n  static getInit() {\n    let pkt = {};\n    for (let objId in server.list) {\n      let obj = server.list[objId];\n      pkt[objId] = obj.getInitPkt();\n    }\n    return pkt;\n  }\n};\n\nclient.trackName = server.trackName = 'Wall';\n\nserver.list = {};\nclient.list = {};\n\nmodule.exports = { client, server };\n\n//# sourceURL=webpack:///./client/js/classes/Wall.js?");

/***/ }),

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  port: 2000\n};\n\n//# sourceURL=webpack:///./config.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex[i] = (i + 0x100).toString(16).substr(1);\n}\n\nfunction bytesToUuid(buf, offset) {\n  var i = offset || 0;\n  var bth = byteToHex;\n  return bth[buf[i++]] + bth[buf[i++]] +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] +\n          bth[buf[i++]] + bth[buf[i++]] +\n          bth[buf[i++]] + bth[buf[i++]];\n}\n\nmodule.exports = bytesToUuid;\n\n\n//# sourceURL=webpack:///./node_modules/uuid/lib/bytesToUuid.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/rng.js":
/*!**************************************!*\
  !*** ./node_modules/uuid/lib/rng.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Unique ID creation requires a high quality random # generator.  In node.js\n// this is pretty straight-forward - we use the crypto API.\n\nvar crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nmodule.exports = function nodeRNG() {\n  return crypto.randomBytes(16);\n};\n\n\n//# sourceURL=webpack:///./node_modules/uuid/lib/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var rng = __webpack_require__(/*! ./lib/rng */ \"./node_modules/uuid/lib/rng.js\");\nvar bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ \"./node_modules/uuid/lib/bytesToUuid.js\");\n\nfunction v4(options, buf, offset) {\n  var i = buf && offset || 0;\n\n  if (typeof(options) == 'string') {\n    buf = options === 'binary' ? new Array(16) : null;\n    options = null;\n  }\n  options = options || {};\n\n  var rnds = options.random || (options.rng || rng)();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = (rnds[6] & 0x0f) | 0x40;\n  rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    for (var ii = 0; ii < 16; ++ii) {\n      buf[i + ii] = rnds[ii];\n    }\n  }\n\n  return buf || bytesToUuid(rnds);\n}\n\nmodule.exports = v4;\n\n\n//# sourceURL=webpack:///./node_modules/uuid/v4.js?");

/***/ }),

/***/ "./server/components/AppPage.js":
/*!**************************************!*\
  !*** ./server/components/AppPage.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const React = __webpack_require__(/*! react */ \"react\");\nconst ClassList = __webpack_require__(/*! ./ClassList.js */ \"./server/components/ClassList.js\");\nconst ConsoleWindow = __webpack_require__(/*! ./ConsoleWindow.js */ \"./server/components/ConsoleWindow.js\");\nconst GameView = __webpack_require__(/*! ./GameView.js */ \"./server/components/GameView.js\");\n\nclass AppPage extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { open: 'console' };\n  }\n\n  openConsole(e) {\n    this.setState({ open: 'console' });\n    for (let i in this.refs['tabList'].childNodes) {\n      if (this.refs['tabList'].childNodes[i].nodeName == 'LI') this.refs['tabList'].childNodes[i].classList.remove('active');\n    }\n    e.target.classList.add('active');\n  }\n\n  openGameView(e) {\n    this.setState({ open: 'game-view' });\n    for (let i in this.refs['tabList'].childNodes) {\n      if (this.refs['tabList'].childNodes[i].nodeName == 'LI') this.refs['tabList'].childNodes[i].classList.remove('active');\n    }\n    e.target.classList.add('active');\n  }\n\n  render() {\n    return React.createElement(\n      'div',\n      { className: 'app-page' },\n      React.createElement(\n        'div',\n        { className: 'row' },\n        React.createElement(\n          'div',\n          { className: 'col-10' },\n          React.createElement(\n            'ul',\n            { className: 'tab-list', ref: 'tabList' },\n            React.createElement(\n              'li',\n              { className: 'active', onClick: this.openConsole.bind(this) },\n              'Console'\n            ),\n            React.createElement(\n              'li',\n              { onClick: this.openGameView.bind(this) },\n              'Game View'\n            )\n          ),\n          this.state.open == 'console' ? React.createElement(ConsoleWindow, null) : React.createElement(GameView, null)\n        ),\n        React.createElement(\n          'div',\n          { className: 'col-2 list-col' },\n          React.createElement(ClassList, null)\n        )\n      )\n    );\n  }\n}\n\nmodule.exports = AppPage;\n\n//# sourceURL=webpack:///./server/components/AppPage.js?");

/***/ }),

/***/ "./server/components/ClassList.js":
/*!****************************************!*\
  !*** ./server/components/ClassList.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const React = __webpack_require__(/*! react */ \"react\");\n\nclass ClassList extends React.Component {\n  constructor(props) {\n    super(props);\n  }\n\n  render() {\n    return React.createElement(\n      'div',\n      null,\n      React.createElement(\n        'h2',\n        null,\n        'Objects: '\n      ),\n      React.createElement(\n        'ul',\n        null,\n        React.createElement(\n          'li',\n          null,\n          'Players: ',\n          listCounts.Player\n        ),\n        React.createElement(\n          'li',\n          null,\n          'Items: ',\n          listCounts.Item\n        ),\n        React.createElement(\n          'li',\n          null,\n          'Projectiles: ',\n          listCounts.Projectile\n        )\n      )\n    );\n  }\n}\n\nmodule.exports = ClassList;\n\n//# sourceURL=webpack:///./server/components/ClassList.js?");

/***/ }),

/***/ "./server/components/ConsoleWindow.js":
/*!********************************************!*\
  !*** ./server/components/ConsoleWindow.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const React = __webpack_require__(/*! react */ \"react\");\n\nclass ConsoleWindow extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { current: \"\", consoleList: [] };\n    this.scrollView = null;\n    this.boundConsoleUpdate = this.consoleUpdate.bind(this);\n  }\n\n  componentDidMount() {\n    this.consoleUpdate();\n    this.scrollToBottom();\n    InternalConsole.on('change', this.boundConsoleUpdate);\n  }\n\n  componentWillUnmount() {\n    InternalConsole.removeListener('change', this.boundConsoleUpdate);\n  }\n\n  scrollToBottom() {\n    this.scrollView.scrollIntoView({ behaviour: 'smooth' });\n  }\n\n  consoleUpdate() {\n    const { consoleList } = this.refs;\n    this.setState({ consoleList: InternalConsole.list });\n    if (consoleList.scrollHeight - consoleList.clientHeight <= 10) this.scrollToBottom();\n  }\n\n  handleChange(e) {\n    this.setState({ current: e.target.value });\n  }\n\n  handleEval(e) {\n    e.preventDefault();\n    serverEval(this.state.current);\n    this.setState({ current: \"\" });\n  }\n\n  render() {\n    return React.createElement(\n      'div',\n      { className: 'console-window' },\n      React.createElement(\n        'div',\n        { className: 'card' },\n        React.createElement(\n          'div',\n          { className: 'card-body' },\n          React.createElement(\n            'ul',\n            { className: 'list-unstyled console-output', ref: 'consoleList' },\n            this.state.consoleList.map(item => {\n              let style = { \"log\": \"info\", \"warn\": \"warning\", \"error\": \"danger\" }[item.verb];\n              return React.createElement(\n                'li',\n                { key: item.time.toUTCString() + item.salt, className: \"console-\" + style + \" text-\" + style },\n                item.text ? item.text.toString() : item.text\n              );\n            }),\n            React.createElement('li', { ref: scrollView => {\n                this.scrollView = scrollView;\n              } })\n          )\n        ),\n        React.createElement(\n          'div',\n          { className: 'card-footer' },\n          React.createElement(\n            'form',\n            { onSubmit: this.handleEval.bind(this), className: 'console-input' },\n            React.createElement('input', { type: 'text', value: this.state.current, onChange: this.handleChange.bind(this) }),\n            React.createElement(\n              'button',\n              { type: 'submit' },\n              'Send'\n            )\n          )\n        )\n      )\n    );\n  }\n}\n\nmodule.exports = ConsoleWindow;\n\n//# sourceURL=webpack:///./server/components/ConsoleWindow.js?");

/***/ }),

/***/ "./server/components/GameView.js":
/*!***************************************!*\
  !*** ./server/components/GameView.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const React = __webpack_require__(/*! react */ \"react\");\n\nmodule.exports = class GameView extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { size: { w: 100, h: 100 } };\n    this.resize = this.resize.bind(this);\n  }\n\n  componentDidMount() {\n    this.canvas = this.refs['canvas'];\n    window.addEventListener('resize', this.resize);\n    this.resize({ target: this.refs['size'] });\n    requestAnimationFrame(this.loop.bind(this));\n  }\n\n  componentWillUnmount() {\n    this.canvas = null;\n    window.removeEventListener('resize', this.resize);\n  }\n\n  resize(e) {\n    this.setState({ size: { w: this.refs['size'].clientWidth, h: this.refs['size'].clientHeight } });\n  }\n\n  loop() {\n    if (!this || !this.canvas) {\n      return;\n    }\n    const ctx = this.canvas.getContext('2d');\n    ctx.save();\n    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);\n    ctx.scale(0.1, 0.1);\n\n    renders.players(ctx);\n\n    CollisionTree.draw(ctx);\n    ctx.restore();\n    requestAnimationFrame(this.loop.bind(this));\n  }\n\n  render() {\n    return React.createElement(\n      'div',\n      { ref: 'size', className: 'game-view-size' },\n      React.createElement('canvas', { ref: 'canvas', width: this.state.size.w, height: this.state.size.h })\n    );\n  }\n};\n\n//# sourceURL=webpack:///./server/components/GameView.js?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");\n\n//# sourceURL=webpack:///external_%22events%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jquery\");\n\n//# sourceURL=webpack:///external_%22jquery%22?");

/***/ }),

/***/ "lokijs":
/*!*************************!*\
  !*** external "lokijs" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lokijs\");\n\n//# sourceURL=webpack:///external_%22lokijs%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-dom\");\n\n//# sourceURL=webpack:///external_%22react-dom%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ })

/******/ });