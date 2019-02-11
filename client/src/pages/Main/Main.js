import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
// import DeleteBtn from "../../components/DeleteBtn";
import { Modal, Button } from "react-bootstrap";
import { /*Col,*/ Row, Container } from "../../components/Grid";
// import history from '../../history.js';
// import { List, ListItem } from "../../components/List";
import Nav2 from "../../components/Nav2";
import { RootNode } from "../../components/Nodes";
import ChildNode from "../../components/Nodes/ChildNode";
import  CustomForm  from "../../components/Form";

class MainPage extends Component {
  // type, name, parent, grandchildren,value
  state = {
    nodes: [
      {
        nodetype: 'child',
        name: 'Child1',
        parent: 'Root',
        grandchildren: [
          {
            nodetype: 'grandchild',
            name: 'Grandchild1',
            parent: 'Child1 ObjectId',
            value: 422
          },
          {
            nodetype: 'grandchild',
            name: 'Grandchild2',
            parent: 'Child1 ObjectId',
            value: 224
          },
        ],
        value: null
      }
    ],
    profile: {},
    show: false,
    factory: {
      name: "",
      numChildren: 0,
      minVal: 0,
      maxVal: 1
    }
  };


  //==============================================================
  //==============================================================
  // Component Mounting Functions
  //==============================================================

  componentWillMount() {
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalShow = this.handleModalShow.bind(this)
    // this.handleInputChange = this.handleInputChange.bind(this)

    const { userProfile, getProfile, isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      if (!userProfile) {
        getProfile((err, profile) => {
          this.setState({ profile: profile });
        });
      } else {
        this.setState({ profile: userProfile });
      }
    }
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

  handleModalClose() {
    this.setState({ show: false });
  }

  handleModalShow() {
    this.setState({ show: true });
  }

  // handle form input
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    console.log(value)
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
  }

  // This is the function that renders the page in the client's window.
  render() {
    const { isAuthenticated } = this.props.auth;
    // let profile = this.state.profile
    // let navData = {
    //   user: this.state.profile,
    //   auth:this.props.auth
    // }
    // console.log(this.state.profile)
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
              handleInputChange={this.handleInputChange}
              name={this.state.factory.name}
              number={this.state.factory.numChildren}
              minVal={this.state.factory.minVal}
              maxVal={this.state.factory.maxVal}
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
