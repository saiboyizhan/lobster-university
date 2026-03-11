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

// ---------- KARMA TOKEN ABI ----------
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
  // Write: mint(address to, uint256 amount, string reason)
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "reason", type: "string" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write: spend(uint256 amount, string reason)
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "reason", type: "string" },
    ],
    name: "spend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ---------- CERTIFICATE NFT ABI ----------
export const CERTIFICATE_NFT_ABI = [
  // Read
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
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getCertificate",
    outputs: [
      {
        components: [
          { name: "skillName", type: "string" },
          { name: "level", type: "uint8" },
          { name: "score", type: "uint16" },
          { name: "timestamp", type: "uint64" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Write: issueCertificate(address to, string skillName, uint8 level, uint16 score)
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "skillName", type: "string" },
      { name: "level", type: "uint8" },
      { name: "score", type: "uint16" },
    ],
    name: "issueCertificate",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write: setCertifier(address certifier, bool enabled)
  {
    inputs: [
      { name: "certifier", type: "address" },
      { name: "enabled", type: "bool" },
    ],
    name: "setCertifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
