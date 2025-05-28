import { defineChain } from "viem";
import path from "path";

// ===== Define ALL missing chains =====
export const plumeTestnet = defineChain({
  id: 161221135,
  name: "Plume Testnet",
  network: "plume-testnet",
  nativeCurrency: { name: "Plume ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.plumenetwork.xyz/rpc"] },
    public: { http: ["https://testnet.plumenetwork.xyz/rpc"] },
  },
});

export const berachainTestnet = defineChain({
  id: 80085,
  name: "Berachain Testnet",
  network: "bera-testnet",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://artio.rpc.berachain.com/"] },
    public: { http: ["https://artio.rpc.berachain.com/"] },
  },
});

export const zetachain = defineChain({
  id: 7001,
  name: "ZetaChain Testnet",
  network: "zetachain-testnet",
  nativeCurrency: { name: "ZETA", symbol: "ZETA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
    public: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
  },
});

export const polygonAmoy = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  network: "polygon-amoy",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology/"] },
    public: { http: ["https://rpc-amoy.polygon.technology/"] },
  },
});

export const degen = defineChain({
  id: 666666666,
  name: "Degen Chain",
  network: "degen",
  nativeCurrency: { name: "DEGEN", symbol: "DEGEN", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.degen.tips"] },
    public: { http: ["https://rpc.degen.tips"] },
  },
});

export const xLayer = defineChain({
  id: 196,
  name: "X Layer",
  network: "xlayer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://xlayerrpc.okx.com"] },
    public: { http: ["https://xlayerrpc.okx.com"] },
  },
});

export const cyber = defineChain({
  id: 7560,
  name: "Cyber",
  network: "cyber",
  nativeCurrency: { name: "CYBER", symbol: "CYBER", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://cyber.alt.technology"] },
    public: { http: ["https://cyber.alt.technology"] },
  },
});

export const plume = defineChain({
  // Different from plumeTestnet
  id: 17171,
  name: "Plume",
  network: "plume",
  nativeCurrency: { name: "Plume ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://plume-rpc.alt.technology"] },
    public: { http: ["https://plume-rpc.alt.technology"] },
  },
});

export const monadTestnet = defineChain({
  id: 8888,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
});
// ================================
