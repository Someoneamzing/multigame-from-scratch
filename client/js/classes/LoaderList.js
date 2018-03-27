let client = class {
  constructor(loaders){
    this.loaders = loaders;
  }

  async load(indicator, cb){
    for (let loader of this.loaders){
      await loader.load(indicator);
    }
    cb();
  }
}
module.exports = {client};
