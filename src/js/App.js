import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import RealEstate from '../../build/contracts/RealEstate.json'
// import Content from './Content'
import data from '../data.json';
import 'bootstrap/dist/css/bootstrap.css'
import { Route } from 'react-router-dom'
import '../styles/app.css'
import Menu from './Menu.js'

import ProductCarousel from './container/ProductCarousel.js'

class App extends React.Component {
  constructor(props) {
    super(props)
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

  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
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
     
        <div className="row card-header">
              <div className="col-xs-2">Icon</div>
              <div className="col-xs-8 menu"><Menu /></div>
              <div className="col-xs-2">Login</div>
        </div>

        <div className="row card-block">
         
            {/* <ProductCarousel /> */}

             {/* <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>
               
                <tbody>
                  <tr>
                    <td>IPFS Hash # stored on Eth Contract</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Tx Hash # </td>
                    <td></td>
                  </tr>
                             
                </tbody>
            </Table> */}


            {/* <ul>
                {
                  data.map( i => {
                    return (<li> {i.type} - {i.price}  </li>)
                  })
                }

            </ul> */}
         
        </div>

        <div className="row card-footer">
          <div className="footer">
            Footer
          </div>
        </div>
          


            {/* { this.state.loading || this.state.voting
              ? <p className='text-center'>Loading...</p>
              : <Content
                  account={this.state.account}
                  candidates={this.state.candidates}
                  hasVoted={this.state.hasVoted}
                  castVote={this.castVote} />
            } */}
          {/* <div id="events"></div>

          <div className="row" id="list">
              Real Estate List
          </div> */}


      </div>
    )
  }
}

export default App;


// ReactDOM.render(
//   (<BrowserRouter>
//    <App />
//   </BrowserRouter>),
//   document.querySelector('#root')
// )
