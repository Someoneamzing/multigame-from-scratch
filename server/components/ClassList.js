const React = require('react');

class ClassList extends React.Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <div>
        <h2>Objects: </h2>
        <ul>
          <li>Players: {listCounts.Player}</li>
          <li>Items: {listCounts.Item}</li>
          <li>Projectiles: {listCounts.Projectile}</li>
        </ul>
      </div>
    )
  }
}

module.exports = ClassList;
