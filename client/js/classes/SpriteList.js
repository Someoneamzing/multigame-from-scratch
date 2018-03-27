class client {
  constructor(){
    this.list = [];
    this.total = 0;
    this.toLoad = [];
    //this.finLoad = ()=>{;};
  }

  test(indicator){
    indicator.css('width', (this.list.length/this.total*100) + '%')
    if (this.list.length == this.total){
      this.indicator = null;
    }
  }

  add(sprite){
    this.toLoad.push(sprite);
    this.total ++;
  }

  load(indicator){
    indicator.css('width', '0');
    let promises = [];
    for(let sprite of this.toLoad){
      promises.push(sprite.load(this, indicator));
    }
    return Promise.all(promises);
  }

  get(name){
    return this.list[this.list.findIndex((sp)=>{return sp.name == name})];
  }
}

module.exports = {client};
