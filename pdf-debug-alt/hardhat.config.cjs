require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config({ path: `${__dirname}/.env` });

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.VITE_ALCHEMY_SEPOLIA_RPC_URL,
      accounts: process.env.VITE_DEPLOYER_PRIVATE_KEY
        ? [process.env.VITE_DEPLOYER_PRIVATE_KEY]
        : [],
    },
  },
  etherscan: {
    apiKey: process.env.VITE_ETHERSCAN_API_KEY,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
