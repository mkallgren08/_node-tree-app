import React, { Component } from 'react';
import "./Nodes.css"
import GrandchildNode from "./GrandchildNode"

class ChildNode extends Component {
  state = {
    name: this.props.name,
    parent: this.props.parent,
    grandchildren: this.props.grandchildren,
  }

  
  render() {
    //console.log(this.state)
    let grandchildren = true;
    if (this.props.grandchildren.length===0){
      grandchildren=false
    }

    return (
      <div className='childWrapper'>
        <div className="childHeader">
          <div className="text">{this.state.name}</div>
          <button className="edit">EDIT</button>
          <button className="delete">X</button>
        </div>
        <div className="childBody">
          { grandchildren?
            this.state.grandchildren.map(item=>{
              return <GrandchildNode key={item.name} name={item.name} parent={item.parent} value={item.value}></GrandchildNode>
            }) : <div>No grandchildren to render</div>
          }
        </div>
      </div>
    )
  }

}

export default ChildNode;