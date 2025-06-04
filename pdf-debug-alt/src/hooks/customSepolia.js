const customSepolia = {
  id: 11155111,
  name: "Sepolia (Custom)",
  network: "sepolia",
  nativeCurrency: {
    name: "SepoliaETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://eth-sepolia.g.alchemy.com/v2/TjFTLeEiYoZZznTXK99sU"],
    },
    public: {
      http: ["https://ethereum-sepolia.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
    },
  },
};

export default customSepolia;
