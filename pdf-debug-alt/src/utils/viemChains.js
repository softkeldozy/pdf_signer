import * as viemChains from "viem/chains";
import * as customChains from "../chains";

export default {
  ...viemChains,
  ...customChains,
};
