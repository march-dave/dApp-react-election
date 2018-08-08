var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "shaft clap gun expire course crouch magnet furnace grant shop used vacant";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
          return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/4a6614b6c7f74da5a4b635520688f6c3')
      },
      network_id: '3',
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};
