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
import { Route } from 'react-router-dom'
import '../styles/app.css'
import Menu from './Menu.js'
import $ from 'jquery';
import utf8 from 'utf8';
import ProductCarousel from './container/ProductCarousel.js'
import {Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // modal: false,
      // id: 0,
      // price: 1.1
    };

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
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.contracts = TruffleContract(RealEstate)
    this.contracts.setProvider(this.web3Provider)

    // this.listenToEvents = this.listenToEvents.bind(this);
    // this.castVote = this.castVote.bind(this)
    // this.watchEvents = this.watchEvents.bind(this)
  }

  componentDidMount() {

    $(this.buyModalBox).on('show.bs.modal', e => {
      let id =  $(e.relatedTarget).parent().parent().find('.id').text();
      let price = this.web3.toWei(parseFloat($(e.relatedTarget).parent().parent().find('.price').text() || 0), "ether");

      $(e.currentTarget).find('#id').val(id);
      $(e.currentTarget).find('#price').val(price);
    });

    $(this.buyerInfoModal).on('show.bs.modal', e => {
      let id =  $(e.relatedTarget).parent().parent().find('.id').text();
      
      this.contracts.deployed().then( instance => {
        return instance.getBuyerInfo.call(id);
      }).then( buyerInfo => {
        $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
        $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1]));
        $(e.currentTarget).find('#buyerAge').text(buyerInfo[2]);
      }).catch( err => {
        console.log(err.message);
      })
    });

    // TODO: Refactor with promise chain
    // web3.eth.getCoinbase((err, account) => {
      
    //   this.setState({ account })
      
    //   this.election.deployed().then((electionInstance) => {
    //     this.electionInstance = electionInstance
    //     this.watchEvents()

    //     this.electionInstance.candidatesCount().then((candidatesCount) => {
    //       for (var i = 1; i <= candidatesCount; i++) {
    //         this.electionInstance.candidates(i).then((candidate) => {
    //           const candidates = [...this.state.candidates]
    //           candidates.push({
    //             id: candidate[0],
    //             name: candidate[1],
    //             voteCount: candidate[2]
    //           });
    //           this.setState({ candidates: candidates })
    //         });
    //       }
    //     })

    //     this.electionInstance.voters(this.state.account).then((hasVoted) => {
    //       this.setState({ hasVoted, loading: false })
    //     })
    //   })
    // })

    this.web3.eth.getAccounts( (error, accounts) => {
      if (error) console.log(error);
      
      this.listenToEvents();
    });
  }

  componentWillUnmount() {
  }

  listenToEvents = () => {
    
    this.contracts.deployed().then(  (instance) => {
      instance.LogBuyRealEstate({}, { fromBlock: 0, toBlock: 'latest' }).watch((error, event) => {
        if (!error) {
          $('#events').append('<p>' + event.args._buyer + ' From Account #' + event.args._id + ' bought this engine.' + '</p>');
        } else {
          console.error(error);
        } 
        this.loadRealEstates();
      })
    })
  }

  loadRealEstates = () => {
    console.log('loadRealEstates');
  }

  buyRealEstate = () => {

    let id = $('#id').val();
    let name = $('#name').val();
    let price = $('#price').val();
    let age = $('#age').val();

    this.web3.eth.getAccounts( (error, accounts) => {
      if (error) {
        console.log(error);
      }

      let account = accounts[0];
      // console.log('account: ' + account);
        this.contracts.deployed().then( (instance) => {
        // console.log('instance: ' + instance);
        let nameUtf8Encoded = utf8.encode(name);
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), age, { from: account, value: price });
      }).then( () => {
        $('#name').val('');
        $('#age').val('');
        $('#buyModal').modal('hide');
      }).catch( err => {
        console.log(err.message);
      } );
    });
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

        <div id="events"></div>

        {/* <div className="row"><ProductCarousel/></div> */}
      
        <div className="row">
            {
              data.map( i => {
                return (
                <div className="col-sm-4 card-body">
                  <img className="card-img-top" src={i.picture} width="240"/>

                  <div className="card-body">
                    <h5 className="card-title">{i.type}</h5>
                    <p className="card-text">{i.note}</p>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">ID: <span className="id">{i.id}</span></li>
                      <li className="list-group-item">Price: <span className="price">{i.price}</span></li>
                      <li className="list-group-item">Area: {i.area}</li>
                    </ul>
                  
                    <div className="card-body">
                     <button className="btn btn-info btn-buy" type="button" data-toggle="modal" data-target="#buyModal" value={i.id}>Buy</button>
                     <button className="btn btn-info btn-buyerInfo" type="button" data-toggle="modal" data-target="#buyerInfoModal" style={{display: "normal"}}>
                      Buyer Info
                    </button>
                    </div>
                  </div>
                  
                </div>)
              })
            }
        </div>

        <div className="modal fade" role="dialog" id="buyModal" ref={box => this.buyModalBox = box}>
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
                        <button type="button" class="btn btn-primary" onClick={this.buyRealEstate}>Submit</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" role="dialog" id="buyerInfoModal" ref={box => this.buyerInfoModal = box}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Buyer Info</h4>
                    </div>
                    <div className="modal-body">
                        <strong>Account Info</strong>: <span id="buyerAddress"></span><br/>
                        <strong>Name</strong>: <span id="buyerName"></span><br/>
                        <strong>Age</strong>: <span id="buyerAge"></span><br/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
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
