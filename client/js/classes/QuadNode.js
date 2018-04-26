class server {
  constructor(bounds, maxChildren = 10, depth = 0, maxDepth = 5) {
    this.nodes = [];
    this.bounds = bounds;
    this.children = [];
    this.maxChildren = maxChildren;
    this.depth = depth;
    this.maxDepth = maxDepth;
  }

  insert(obj){
    if(this.nodes.length){
      let indecies = this.findCorners(obj);
      for (let index in indecies){
        this.nodes[index].insert(obj);
      }
      return;
    }

    this.children.push(obj)

    let len = this.children.length;
    if (this.depth < this.maxDepth && len >= this.maxChildren){
      this.subdivide();

      for(let i in this.children){
        this.insert(this.children[i]);
      }

      this.children.length = 0;
    }
  }

  subdivide(){
    let {x,y,w,h} = this.bounds;
    w = w/2;
    h = h/2;
    this.nodes[server.TOP_LEFT]     =  new server({x       , y       , w, h}, this.maxChildren, this.depth + 1, this.maxDepth);
    this.nodes[server.TOP_RIGHT]    =  new server({x: x + w, y       , w, h}, this.maxChildren, this.depth + 1, this.maxDepth);
    this.nodes[server.BOTTOM_LEFT]  =  new server({x       , y: y + h, w, h}, this.maxChildren, this.depth + 1, this.maxDepth);
    this.nodes[server.BOTTOM_RIGHT] =  new server({x: x + w, y: y + h, w, h}, this.maxChildren, this.depth + 1, this.maxDepth);
  }

  retrieve(obj, out){
    let {x,y,w,h} = this.bounds;
    if (x + w < obj.x - obj.w/2 || x > obj.x + obj.w/2 || y + h < obj.y - obj.h/2 || y > obj.y + obj.h/2) return;
    if (this.nodes.length > 0) {
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
    for(let i in this.nodes){
      let {x,y,w,h} = this.nodes[i].bounds;
      if (x + w < obj.x - obj.w/2 || x > obj.x + obj.w/2 || y + h < obj.y - obj.h/2 || y > obj.y + obj.h/2) continue;
      res.push(i);
    }
    return res;
  }

  draw(ctx){
    if(this.nodes.length > 0){
      for (let i in this.nodes){
        this.nodes[i].draw(ctx);
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
  }

  clear(){
    if (this.nodes.length > 0){
      for (let i in this.nodes) this.nodes[i].clear();
      return;
    }

    this.children.length = 0;
  }
}

server.TOP_LEFT = 0;
server.TOP_RIGHT = 1;
server.BOTTOM_LEFT = 2;
server.BOTTOM_RIGHT = 3;

module.exports = {server}
