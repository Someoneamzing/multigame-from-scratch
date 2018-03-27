let client = class {
  constructor(ctx, {x, y, zoom}){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }
}

module.exports = {client};
