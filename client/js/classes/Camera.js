let client = class {
  constructor(ctx, {x, y, zoom}){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }

  setPos(x = 0,y = 0){
    if(typeof x == 'object'){
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }
}

module.exports = {client};
