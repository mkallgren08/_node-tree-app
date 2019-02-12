import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
// import DeleteBtn from "../../components/DeleteBtn";
import { Modal } from "react-bootstrap";
import { /*Col,*/ Row, Container } from "../../components/Grid";
// import history from '../../history.js';
// import { List, ListItem } from "../../components/List";
import { RootNode } from "../../components/Nodes";
import ChildNode from "../../components/Nodes/ChildNode";
import  CustomForm  from "../../components/Form/CustomForm";

class MainPage extends Component {
  // type, name, parent,value
  state = {
    nodes: [],
    show: false,
    showNameEdit: false,
    showChildEdit:false,
    childName: "",
    numGrandChildren: null,
    minVal: null,
    maxVal: null,
    openid: null,
    errorFields: [],
    sampleData:{
      numGrandChildren:3,
      newName: 'Updatarooney',
      minVal: 22,
      maxVal: 5800,
      nodetype: 'child',
      parent: null,
      name: 'Test Entry',
      value: null
    }
  };


  //==============================================================
  //==============================================================
  // Component Mounting Functions
  //==============================================================

  componentWillMount() {
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalShow = this.handleModalShow.bind(this)
    this.handleNameEditModal = this.handleNameEditModal.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  
  // Initial load of saved items
  componentDidMount() {
    this.loadNodeData();
  };
  
  // =============================================================
  //  DB Read/Write Functions
  // =============================================================
  loadNodeData = () => {
    API.getNodeData()
      .then(
        res => {
          // console.log("test data: " + JSON.stringify(res.data, null, 2))
          this.parseNodes(res.data);
        })
      .catch(err => console.log(err));
  };

  sendNode = () => {
    console.log('sending node')
    let newNode = {
      nodetype:'child',
      parent: null,
      name: this.state.childName,
      value: null
    }
    this.postNodes(newNode,true)
  }

  postNodes = (nodes,grandkids) =>{
    console.log(nodes)
    API.saveNode(nodes)
    .then(res=> {
      console.log(res)
      //console.log(res.data._id)
      if (grandkids){
        this.generateGrndchld(res.data._id)
      } else {
        this.loadNodeData()
      }
    })
    .catch(err => console.log(err))
  }

  // Deletes a node with the given id, then goes back and clears out the grandchildren of that node
  deleteNode = (id) => {
    console.log(`Started the deletion process on id ${id}`)
    API.deleteNode(id).then(res =>{
      console.log(res)
      API.deleteMany(id).then(
        res=>{console.log(res)
        this.loadNodeData()
        })
      
    })
  }

  changeNodeName = (id, newName) => {
    let newNameObj = {newName:newName}
    console.log(`Started the editing process on id ${id} to change the name to ${newName}`)
    API.editNode(id, newNameObj).then(
      res => {
        console.log(res);
        this.loadNodeData();
      }
    )
  }

  changeNodeChildren = (id) =>{
    console.log(`Started the deletion process on id ${id}`)
    API.deleteMany(id).then(res =>{
      console.log(res)
      this.generateGrndchld(id)
    })
  }
  // =============================================================
  //  Data Manipulation Functions
  // =============================================================
  generateGrndchld = (id) => {
    // console.log(id)
    // let x = this.state.sampleData.numGrandChildren
    // let min = this.state.sampleData.minVal
    // let max = this.state.sampleData.maxVal
    let x = this.state.numGrandChildren
    let min = this.state.minVal
    let max = this.state.maxVal
    let grandkids =[];
    console.log(x,min,max)
    let generateVal = (min, max) => {
      min = parseInt(min, 10)
      max = parseInt(max, 10)
      let res = Math.floor(Math.random()* max ) + min
      console.log(res)
      return res
    }

    for (let i=0;i<x;i++){
      let grandkid ={
        nodetype: 'grandchild',
        parent: id,
        name: null,
        value: generateVal(min,max)
      };
      grandkids.push(grandkid);
    }
    console.log(grandkids)
    this.postNodes(grandkids,false)
  }
  // Takes the data retrived from Mongo and parses the relationships between child
  // and grandchild node - also hides any open Modals
  parseNodes = (data) => {
    let nodes = [];
    console.log(data)
    data.forEach((item) => {
      if (item.nodetype === "child") {
        let child = {
          name: item.name,
          parent: 'rootNode',
          id: item._id,
          grandchildren: []
        }
        data.forEach((sub) => {
          if (sub.nodetype === "grandchild" && child.id === sub.parent) {
            console.log("We found a grandchild!")
            let grandchild = {
              name: sub.name,
              parent: sub.parent,
              id: sub._id,
              value: sub.value
            }
            child.grandchildren.push(grandchild)
          }
        })
        nodes.push(child)
      }
    })
    console.log(nodes)
    this.setState({ nodes: nodes, show:false, showNameEdit: false, showChildEdit: false })
  }

  // Handles the closing of a modal
  handleModalClose(e) {
    e.preventDefault();
    this.setState({
      show: false,
      showNameEdit:false,
      showChildEdit: false,
      childName: "",
      numGrandChildren: null,
      minVal: null,
      maxVal: null
    })
  }
  // Handles the opening of a modal
  handleModalShow() {
    this.setState({ show: true });
  }

  handleNameEditModal() {
    console.log('Heard the click')
    this.setState({ showNameEdit: true });
  }

  // handle form input as it's entered
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    console.log(name, value)
    this.setState({
      [name]: value
    })
  };
  // Handles factory Creation and form validation
  handleFormSubmit = e => {
    e.preventDefault();
    console.log("Submission heard")
    let count = 0;
    let errorFields=[]; 
    console.log(count,errorFields)
    if (this.state.childName.length>0 && isNaN(this.state.childName)){
      count++;
    } else {errorFields.push('Factory Name')}
    if(this.state.numGrandChildren>0 && this.state.numGrandChildren<16){
      count++;
    } else {errorFields.push('Number of Nodes')}
    if(this.state.minVal>0 && !isNaN(this.state.minVal)){
      count++;
    }else { errorFields.push('Min Range Val')}
    if(this.state.maxVal>0 && this.state.maxVal>this.state.minVal && !isNaN(this.state.maxVal) ){
      count++;
    }else { errorFields.push('Max Range Val')}
    console.log(count, errorFields)
    if (count === 4){ 
      // this.handleModalClose(()=>{
      //   this.sendNode()
      // });
      this.sendNode()
    } else {
      let message = "\n"
      errorFields.forEach(val=>{
        message += `* ${val}\n`
      })
      alert(`You have errors in one or more of the following fields: ${message}`)
    }
    
  }
  // Handles factory Name edits and form validation
  handleNameEdit = (e,id) => {
    e.preventDefault();
    let count =0;
    let errorFields = this.state.errorFields
    if (this.state.childName.length>0 && isNaN(this.state.childName)){
      count++;
    } else {errorFields.push('Factory Name')}
    if (count === 1){ 
      this.changeNodeName(id, this.state.childName)
    } else {
      let message = "\n"
      errorFields.forEach(val=>{
        message += `* ${val}\n`
      })
      alert(`You have errors in one or more of the following fields: ${message}`)
    }
  }
  // Handles factory range edits and form validation
  handleRangeEdit =e => {

  }

  // This is the function that renders the page in the client's window.
  render() {

    let children = false;
    if (this.state.nodes.length > 0) {
      children = true;
    }
    // let factory = this.state.factory

    return (
      <Container fluid>
        {/* <Row>
          <Nav2 user={this.state.profile} auth={this.props.auth} />
        </Row> */}
        <Row>
          <Jumbotron>
            <h1> Hello! Time to get Coding! </h1>
          </Jumbotron>
        </Row>
        <Row>
          <button className="primary" onClick={this.handleModalShow}>New Factory</button>
          <button className="primary" onClick={this.sendNode}>Send Sample Data</button>
          <button className="primary" onClick={()=>this.generateGrndchld('1010101')}>Generate Grandchild Sample Data</button>
          <Modal show={this.state.show} onHide={this.handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Factory Function</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CustomForm
              errors = {this.state.errorFields}
              handleInputChange={this.handleInputChange}
              name={this.state.childName}
              number={this.state.numChildren}
              minVal={this.state.minValue}
              maxVal={this.state.maxValue}
              handleModalClose={this.handleModalClose}
              handleFormSubmit={this.handleFormSubmit}
              />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </Row>
        <Row>

          <RootNode id="rootNode">
            {children ?
              this.state.nodes.map(item => {
                return (<ChildNode 
                          key={item.id}
                          id = {item.id} 
                          name={item.name}
                          newName = {this.state.childName}
                          errrors={this.state.errorFields} 
                          grandchildren={item.grandchildren} 
                          parent={item.parent}
                          handleInputChange={this.handleInputChange}
                          handleDelete={this.deleteNode}
                          handleNameEdit={this.handleNameEdit}
                          handleRangeEdit={this.handleRangeEdit}
                          showName={this.state.showNameEdit}
                          showNameEdit={this.handleNameEditModal}
                          showChildEdit={this.state.showChildEdit}
                          handleModalClose={this.handleModalClose}
                          >
                          </ChildNode>
              )}) : <h4>No Children to Display</h4>
            }
          </RootNode>
        </Row>
      </Container >
    );
  }
}

export default MainPage;
