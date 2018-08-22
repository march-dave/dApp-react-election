import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'

// import web3 from '../web3.js'
import TruffleContract from 'truffle-contract'
import RealEstate from '../../build/contracts/RealEstate.json'
// import Content from './Content'
import data from '../data.json';
// import {Table, Input, Row, Grid, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap/dist/js/bootstrap.js";
// import 'bootstrap'
import { Route } from 'react-router-dom'
import '../styles/app.css'
import Menu from './Menu.js'
import ProductCarousel from './container/ProductCarousel.js'
import {Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      id: 0,
      price: 1.1
    };

    this.toggle = this.toggle.bind(this);

    this.handleShowBsCollapse = this.handleShowBsCollapse.bind(this);
    
    // this.state = {
    //   account: '0x0',
    //   candidates: [],
    //   hasVoted: false,
    //   loading: true,
    //   voting: false,
    // }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.realEstate = TruffleContract(RealEstate)
    this.realEstate.setProvider(this.web3Provider)

    // this.castVote = this.castVote.bind(this)
    // this.watchEvents = this.watchEvents.bind(this)
  }

  toggle(e) {
    // console.log("toggle");
    // console.log(e.target);
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.election.deployed().then((electionInstance) => {
        this.electionInstance = electionInstance
        this.watchEvents()
        this.electionInstance.candidatesCount().then((candidatesCount) => {
          for (var i = 1; i <= candidatesCount; i++) {
            this.electionInstance.candidates(i).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                id: candidate[0],
                name: candidate[1],
                voteCount: candidate[2]
              });
              this.setState({ candidates: candidates })
            });
          }
        })
        this.electionInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted, loading: false })
        })
      })
    })

    // this.myShowCollapse.addEventListener('show.bs.collapse', this.handleShowBsCollapse)
  }

  componentWillUnmount() {
    // this.myShowCollapse.removeEventListener('show.bs.collapse', this.handleShowBsCollapse)
  }

  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.electionInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  castVote(candidateId) {
    this.setState({ voting: true })
    this.electionInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }

  render() {
    return (
      <div className="container-fluid">

        <div className="row" style={{background: "#333", height: "37px", color: "#FFF" }}>
          <div className="col-sm">
            Logo
          </div>
          <div className="col-sm-8">
            <Menu />
          </div>
          <div className="col-sm">
            Login
          </div>
        </div>

        {/* <div className="row"><ProductCarousel/></div> */}
      
        <div className="row">
            {
              data.map( i => {
                return (
                <div className="col-sm-4 card-body">
                  <img className="card-img-top"  src={i.picture} width="240"/>

                  <div className="card-body">
                    <h5 className="card-title">{i.type}</h5>
                    <p className="card-text">{i.note}</p>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">ID: {i.id}</li>
                      <li className="list-group-item">Price: {i.price}</li>
                      <li className="list-group-item">Area: {i.area}</li>
                    </ul>
                  
                    <div className="card-body">
                     <button className="btn btn-info btn-buy" type="button" data-toggle="modal" data-target="#buyModal">Buy</button>
                    </div>
                    {/* <div className="card-body">
                      <Button color="primary" onClick={this.toggle}>{this.props.buttonLabel}
                      Buy
                      </Button>
                      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Buyer Info</ModalHeader>
                        <ModalBody>
                          {i.id} {i.price}
                          <Input type="hidden" id={i.id} />
                          <Input type="hidden" id={i.price} />
                          <Input id="name" placeholder="Name" /><br/>
                          <Input id="age" placeholder="Age" /> 
                        </ModalBody>

                        <ModalFooter>
                          <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                      </Modal>
                    </div> */}

                  </div>
                  
                </div>)
              })
            }
        </div>

        <div className="modal fade" tabindex="-1" role="dialog" id="buyModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Buyer Info</h4>
                    </div>
                    <div className="modal-body">
                        <input type="hidden" id="id" />
                        <input type="hidden" id="price" />
                        <input type="text" className="form-control" id="name" placeholder="Name" /><br/>
                        <input type="number" className="form-control" id="age" placeholder="Age" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onclick="App.buyRealEstate(); return false;">Submit</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
          <div className="col-sm">
            
            <div className="input-group mb-3">
              <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
              {/* <div className="input-group-append"></div>
                <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
              </div> */}
            </div>
          </div>
          

          <div className="col-sm">
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Category
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <a className="dropdown-item" href="#">Something else here</a>
              </div>
            </div>
          </div>

          <div className="col-sm">
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Genuine Filter Category
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
          </div>

        </div>

        <div className="row">
          <div className="col-sm">Grid</div>
          <div className="col-sm">Drop Down Box</div>
        </div>

      </div>
    )
  }
}

export default App;
