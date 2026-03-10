import { http, createConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected(), // MetaMask, Trust Wallet
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "" }),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

// Contract addresses (BSC Testnet)
export const CONTRACTS = {
  karmaToken: process.env.NEXT_PUBLIC_KARMA_TOKEN_ADDRESS ?? "",
  certificateNFT: process.env.NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS ?? "",
  skillMarketplace: process.env.NEXT_PUBLIC_SKILL_MARKETPLACE_ADDRESS ?? "",
} as const;

// Minimal ABIs for reading
export const KARMA_TOKEN_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const CERTIFICATE_NFT_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "tokensOfOwner",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
