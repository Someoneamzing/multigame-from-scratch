const React = require('react');

module.exports = class GameView extends React.Component {
  constructor(props){
    super(props);
    this.state = {size: {w: 100, h: 100}};
    this.resize = this.resize.bind(this);
  }

  componentDidMount(){
    this.canvas = this.refs['canvas'];
    window.addEventListener('resize', this.resize);
    this.resize({target: this.refs['size']});
    requestAnimationFrame(this.loop.bind(this))
  }

  componentWillUnmount(){
    this.canvas = null;
    window.removeEventListener('resize', this.resize);
  }

  resize(e){
    this.setState({size: {w: this.refs['size'].clientWidth, h: this.refs['size'].clientHeight}});
  }

  loop(){
    if (!this||!this.canvas) {return;}
    const ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    ctx.translate(this.canvas.width/2, this.canvas.height/2)
    ctx.scale(0.1,0.1);

    renders.players(ctx);

    CollisionTree.draw(ctx);
    ctx.restore()
    requestAnimationFrame(this.loop.bind(this));
  }

  render(){
    return (
      <div ref="size" className="game-view-size">
        <canvas ref="canvas" width={this.state.size.w} height={this.state.size.h}/>
      </div>
    )
  }
}
