import * as viemChains from "viem/chains";
import {
  plumeTestnet,
  berachainTestnet,
  // Import other chains as needed
} from "../../vite.config.js";

// Combine default and custom chains
const allChains = {
  ...viemChains,
  plumeTestnet,
  berachainTestnet,
  // Add other chains here
};

export default allChains;
