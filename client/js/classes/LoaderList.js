export class client {
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
