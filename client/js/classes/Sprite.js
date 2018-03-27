
class client extends Image {
  constructor({ctx, src, name = src.match(/([\w-]+)(?=\.(?:png|jpg|jpeg|mpeg|gif))/)[0], w = 32, h = 32, frames = 1, speed = 0}){
    super();
    this.ctx = ctx;
    this.name = name;
    this.w = w;
    this.h = h;
    this.frames = frames;
    this.speed = speed;
    this.path = src;
    this.loaded = false;
  }

  load(to, indicator){
    return new Promise(resolve=>{
      this.onload = ()=>{
        to.list.push(this);
        to.test(indicator);
        this.loaded = true;
        resolve();
      };
      this.onerror = ()=>{
        reject();
      }
      this.src = this.path;
    })
    // this.onload = ()=>{
    //   to.test(indicator);
    //   to.list.push(this);
    //   this.loaded = true;
    // }
    //this.src = this.path;
  }
}

module.exports = {client};
