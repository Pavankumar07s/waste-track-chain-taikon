import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  defaultNetwork: 'taiko',
  networks: {
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    taiko: {
      url: process.env.RPC_URL,
      accounts: [process.env.YOUR_PRIVATE_KEY],
    },
  },
}

export default config
