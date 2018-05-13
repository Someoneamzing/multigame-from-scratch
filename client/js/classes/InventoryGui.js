import React from 'react';
import ReactDOM from 'react-dom';

export class client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedSlot: 0, selectedRecipe: 0, list: null, id: null, error: {has: false, msg: ''}, iSearch: '', rSearch: ''};
  }

  handleInventorySearch(e){
    this.setState({iSearch: e.target.value});
  }

  handleRecipeSearch(e){
    this.setState({rSearch: e.target.value});
  }

  render(){
    let title = "";
    switch (this.state.list.trackName) {
      case "Player":
        title = "Inventory";
        break;

      case "Building":
        if (this.state.list == null || this.state.inventoryId == null) this.setState({error:{has: true, msg: "Invalid Inventory"}})
        title = this.state.list[this.state.id.build];
        break;

      default:
        this.setState({error:{has: true, msg: "Invalid Inventory"}});
    }

    if (this.state.error.has){
      return (
        <div id={this.props.id}>
          <div className="error"><h3>Error</h3></div>
          <div>
            <p>{this.state.error.msg}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div><h3>{title}</h3></div>
          <table>
            <thead><tr><th><input type="text" placeholder="Search" onChange={this.handleInventorySearch.bind(this)} /></th><th></th><th>Crafting</th><th><input type="text" placeholder="Search" onChange={this.handleRecipeSearch.bind(this)} /></th></tr></thead>
            <tbody>
              <tr>
                <td><ul>{this.state.list.list[this.state.inventoryId].list.map((item, slot)=>{return (<li key={slot} className='i-list-item'>{global.toLocale('item.' + item.item)}</li>)})}</ul></td>
                <td>
                  <h2>{window.toLocale('item.' + this.state.list.list[this.state.inventoryId].list[this.state.selectedSlot].item)}</h2>
                  <img src={Sprites.get(this.state.list.list[this.state.inventoryId].list[this.state.selectedSlot].item).image} />

                </td>
                <td>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  }
}
