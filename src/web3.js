import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider);

// if (typeof web3 !== 'undefined') {
//     App.web3Provider = web3.currentProvider;
//     web3 = new Web3(web3.currentProvider);
//   } else {
//     App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
//     web3 = new Web3(App.web3Provider);

let web3 = new Web3(window.web3.currentProvider);

if (typeof web3 != 'undefined') {
    web3 = new Web3(web3.currentProvider);
    // this.web3Provider = web3.currentProvider
  } else {
    // this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
  }

export default web3;