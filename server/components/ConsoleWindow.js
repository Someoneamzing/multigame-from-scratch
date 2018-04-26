const React = require('react');

class ConsoleWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {current: "", consoleList: []};
    this.scrollView = null;
    this.boundConsoleUpdate = this.consoleUpdate.bind(this);
  }

  componentDidMount(){
    this.consoleUpdate();
    this.scrollToBottom();
    InternalConsole.on('change', this.boundConsoleUpdate);
  }

  componentWillUnmount(){
    InternalConsole.removeListener('change', this.boundConsoleUpdate);
  }

  scrollToBottom(){
    this.scrollView.scrollIntoView({behaviour: 'smooth'});
  }

  consoleUpdate(){
    const {consoleList} = this.refs;
    this.setState({consoleList: InternalConsole.list});
    if (consoleList.scrollHeight - consoleList.clientHeight <= 10) this.scrollToBottom();
  }

  handleChange(e){
    this.setState({current: e.target.value});
  }

  handleEval(e){
    e.preventDefault();
    serverEval(this.state.current);
    this.setState({current: ""})
  }

  render(){
    return (
      <div className="console-window">
        <div className="card"><div className="card-body">
          <ul className="list-unstyled console-output" ref="consoleList">
            {this.state.consoleList.map((item)=>{
              let style = {"log": "info", "warn": "warning", "error": "danger"}[item.verb];
              return <li key={item.time.toUTCString() + item.salt} className={"console-" + style + " text-" + style}>{item.text?item.text.toString():item.text}</li>
            })}
            <li ref={scrollView => {this.scrollView = scrollView;}} />
          </ul>
        </div><div className="card-footer">
          <form onSubmit={this.handleEval.bind(this)} className="console-input"><input type="text" value={this.state.current} onChange={this.handleChange.bind(this)} /><button type="submit">Send</button></form>
        </div></div>
      </div>
    )
  }
}

module.exports = ConsoleWindow;
