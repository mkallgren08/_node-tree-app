import React, { Component } from 'react';
import {Modal} from "react-bootstrap";
import "./Nodes.css"
import GrandchildNode from "./GrandchildNode"
import  EditNameForm  from '../Form/EditNameForm/index';

class ChildNode extends Component {

  
  render() {
    //console.log(this.state)
    let grandchildren = true;
    if (this.props.grandchildren.length===0){
      grandchildren=false
    }

    return (
      <div className='childWrapper'>
        <div className="childHeader">
          <div className="text" key={this.props.id}>{this.props.name}</div>
          <button className="edit" onClick={this.props.showNameEdit}>EDIT NAME</button>
          <button className="delete" onClick={() => this.props.handleDelete(this.props.id)}>X</button>
        </div>
        <div className="childBody">
          { grandchildren?
            this.props.grandchildren.map(item=>{
              return <GrandchildNode key={item.id} name={item.name} parent={item.parent} value={item.value}></GrandchildNode>
            }) : <div>No grandchildren to render</div>
          }
        </div>
        <Modal show={this.props.showName} onHide={this.props.handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Factory Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditNameForm
              errors = {this.props.errorFields}
              handleInputChange={this.props.handleInputChange}
              name={this.props.name}
              newName={this.props.newName}
              handleModalClose={this.props.handleModalClose}
              handleFormSubmit={this.props.handleNameEdit}
              id = {this.props.id}
              />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
      </div>
    )
  }

}

export default ChildNode;