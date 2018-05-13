class server {
  constructor(bounds, maxChildren = 10, depth = 0, maxDepth = 5) {
    this.nodes = [];
    this.bounds = bounds;
    this.children = [];
    this.maxChildren = maxChildren;
    this.depth = depth;
    this.maxDepth = maxDepth;
    this.stuckChildren = [];
    this.drawNodes = [];
  }

  insert(obj){
    let {x,y,w,h} = obj;
    let {x: bx,y: by,w: bw,h: bh} = this.bounds;
    if (!(bx < x + w/2 && bx + bw > x - w/2 && by < y + h/2 && by + bh > y - h/2)) {return;}


    if(this.nodes.length > 0){
      let corners = this.findCorners(obj);
      for (let i of corners){
        this.nodes[i].insert(obj);
      }
      return;
    }


    this.children.push(obj);

    if (this.children.length > this.maxChildren && this.depth < this.maxDepth) {
      this.subdivide();
      for(let child of this.children){
        this.insert(child);
      }
      this.children.length = 0;
    }
  }

  subdivide(){
    let {x, y, w, h} = this.bounds;
    this.nodes[server.TOP_LEFT] =     new server({x: x      , y: y      , w: w/2, h: h/2}, this.maxChildren, this.depth + 1, this.maxDepth);
    this.nodes[server.TOP_RIGHT] =    new server({x: x + w/2, y: y      , w: w/2, h: h/2}, this.maxChildren, this.depth + 1, this.maxDepth);
    this.nodes[server.BOTTOM_LEFT] =  new server({x: x      , y: y + h/2, w: w/2, h: h/2}, this.maxChildren, this.depth + 1, this.maxDepth);
    this.nodes[server.BOTTOM_RIGHT] = new server({x: x + w/2, y: y + h/2, w: w/2, h: h/2}, this.maxChildren, this.depth + 1, this.maxDepth);
  }

  retrieve(obj, out){
    let {x,y,w,h} = obj;
    let {x: bx,y: by,w: bw,h: bh} = this.bounds;
    if (!(bx < x + w/2 && bx + bw > x - w/2 && by < y + h/2 && by + bh > y - h/2)) {
      return;
    }
    if (this.nodes.length) {
      for (let i in this.nodes){
        this.nodes[i].retrieve(obj, out);
      }
      return;
    }
    //if (this.children.length > 0) console.log(this.children.length);
    if (obj.name && this.children.length > 0) this.checkedThisTick = true;
    for (let i in this.children){
      out[this.children[i].id] = this.children[i];
    }
  }

  findCorners(obj){
    let res = [];
    let {x,y,w,h} = obj;
    let {x: bx,y: by,w: bw,h: bh} = this.bounds;
    if (!(bx < x + w/2 && bx + bw > x - w/2 && by < y + h/2 && by + bh > y - h/2)) {
      return [];
    }
    for (let n in this.nodes) {
      let node = this.nodes[n];
      let {x: nx,y: ny,w: nw,h: nh} = node.bounds;
      let left = (nx + nw > x - w/2);
      let right = (nx < x + w/2);
      let top = (ny + nh > y - h/2);
      let bottom = (ny < y + h/2);
      if (!(left && right && top && bottom)) {
        continue;
      }
      res.push(n);
    }
    return res;
  }

  draw(ctx){
    if(this.nodes.length){
      for (let i in this.nodes){
        this.nodes[i].draw(ctx);
      }
      return;
    }
    if(this.drawNodes.length){
      for (let i in this.drawNodes){
        ctx.strokeStyle = "lightblue";
        let {x,y,w,h} = this.drawNodes[i];
        ctx.strokeRect(x,y,w,h);
      }
      return;
    }
    ctx.strokeStyle = "red";
    let {x,y,w,h} = this.bounds;
    ctx.strokeRect(x,y,w,h);
    if (this.checkedThisTick){
      ctx.fillStyle = "#9999ff";
      ctx.fillRect(x,y,w,h);
      this.checkedThisTick = false;
    }
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '100pt Arial';
    ctx.fillText(this.children.length, x + w/2, y + h/2);
    for (let i in this.children){
      let c = this.children[i];
      ctx.fillRect(c.x-c.w/2, c.y - c.h/2, c.w, c.h);
    }
  }

  clear(){
    for (let i in this.nodes) this.nodes[i].clear();

    this.nodes.length = 0;
    this.drawNodes.length = 0;

    this.children.length = 0;
    this.stuckChildren.length = 0;
  }
}

server.TOP_LEFT = 0;
server.TOP_RIGHT = 1;
server.BOTTOM_LEFT = 2;
server.BOTTOM_RIGHT = 3;

module.exports = {server}
