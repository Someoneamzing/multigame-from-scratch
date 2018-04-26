const React = require('react');
const ClassList = require('./ClassList.js');
const ConsoleWindow = require('./ConsoleWindow.js');
const GameView = require('./GameView.js');

class AppPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {open: 'console'};
  }

  openConsole(e){
    this.setState({open: 'console'});
    for (let i in this.refs['tabList'].childNodes){
      if (this.refs['tabList'].childNodes[i].nodeName == 'LI')this.refs['tabList'].childNodes[i].classList.remove('active');

    }
    e.target.classList.add('active');
  }

  openGameView(e){
    this.setState({open: 'game-view'});
    for (let i in this.refs['tabList'].childNodes){
      if (this.refs['tabList'].childNodes[i].nodeName == 'LI')this.refs['tabList'].childNodes[i].classList.remove('active');

    }
    e.target.classList.add('active');
  }

  render(){
    return (
      <div className="app-page">
        <div className="row">
          <div className="col-10"><ul className="tab-list" ref="tabList"><li className="active" onClick={this.openConsole.bind(this)}>Console</li><li onClick={this.openGameView.bind(this)}>Game View</li></ul>{this.state.open == 'console'?<ConsoleWindow />:<GameView />}</div>
          <div className="col-2 list-col"><ClassList /></div>
        </div>
      </div>
    )
  }
}

module.exports = AppPage;
