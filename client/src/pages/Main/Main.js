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
import  CustomForm  from "../../components/Form";

class MainPage extends Component {
  // type, name, parent,value
  state = {
    nodes: [],
    show: false,
    childName: "",
    numGrandChildren: null,
    minVal: null,
    maxVal: null,
    errorFields: []
  };


  //==============================================================
  //==============================================================
  // Component Mounting Functions
  //==============================================================

  componentWillMount() {
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalShow = this.handleModalShow.bind(this)
    // this.handleInputChange = this.handleInputChange.bind(this)

  }
  

  // Initial load of saved items
  componentDidMount() {
    this.loadNodeData();
  };

  loadNodeData = () => {
    API.getNodeData()
      .then(
        res => {
          // console.log("test data: " + JSON.stringify(res.data, null, 2))
          this.parseNodes(res.data);
        })
      .catch(err => console.log(err));
  };

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
            // data.splice(ind,1)
          }
        })

        nodes.push(child)

      }
    })
    console.log(nodes)
    this.setState({ nodes: nodes })
  }

  handleModalClose(e) {
    this.setState({
      show: false,
      childName: "",
      numGrandChildren: null,
      minVal: null,
      maxVal: null
    })
  }

  handleModalShow() {
    this.setState({ show: true });
  }

  // handle form input
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    console.log(name, value)
    this.setState({
      [name]: value
    }, () => {
      if (this.state.show){
      }
    });

  };

  handleFormSubmit = e => {
    e.preventDefault();
    console.log("Submission heard")
    let count = 0;
    let errorFields=[]; 
    console.log(count,errorFields)
    if (this.state.childName.length>0 && isNaN(this.state.childName)){
      count++;
    } else {errorFields.push('Factory Name')}
    if(this.state.numGrandchildren>0 && this.state.numGrandchildren<16){
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
      this.handleModalClose();
    } else {
      let message = "\n"
      errorFields.forEach(val=>{
        message += `* ${val}\n`
      })
      alert(`You have errors in one or more of the following fields ${message}`)
    }
    
  }

  // This is the function that renders the page in the client's window.
  render() {
    const { isAuthenticated } = this.props.auth;
    let children = false;
    if (this.state.nodes.length > 0) {
      children = true;
    }
    let factory = this.state.factory

    return (
      <Container fluid>
        {/* <Row>
          <Nav2 user={this.state.profile} auth={this.props.auth} />
        </Row> */}
        <Row>
          <Jumbotron>
            {
              isAuthenticated() ?
                <h1>Hello {this.state.profile.nickname}: Time to Get Coding!!</h1> :
                <h1> Hello! Time to get Coding! </h1>
            }
          </Jumbotron>
        </Row>
        <Row>
          <button className="primary" onClick={this.handleModalShow}>New Factory</button>
          <Modal show={this.state.show} onHide={this.handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
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
                return <ChildNode key={item.name} name={item.name} grandchildren={item.grandchildren} parent={item.parent}></ChildNode>
              }) : <h4>No Children to Display</h4>
            }
          </RootNode>
        </Row>
      </Container >
    );
  }
}

export default MainPage;
