const Arrow = require('../classes/Arrow.js').server;

let bow = new Tool({name: 'bow'});
bow.use = (player)=>{
  let len = Math.sqrt(Math.pow(player.x - player.mouse.x,2) + Math.pow(player.y - player.mouse.y));
  let hsp = ((player.x - player.mouse.x) / len) * Arrow.speed;
  let vsp = ((player.y - player.mouse.y) / len) * Arrow.speed;
  new Arrow({x: player.x, y: player.y, hsp, vsp, pId: player.id});
}
