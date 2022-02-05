require('@nomiclabs/hardhat-waffle')
require('dotenv').config()


/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  defaultNetwork: 'matic',
  networks: {
    hardhat: {
      //
    },
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [process.env.PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}
