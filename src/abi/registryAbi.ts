export const registryAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "chamberBeacon",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "chambers",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "chamber", type: "address", internalType: "address" },
      { name: "memberToken", type: "address", internalType: "address" },
      { name: "govToken", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deploy",
    inputs: [
      { name: "erc721", type: "address", internalType: "address" },
      { name: "erc20", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getChambers",
    inputs: [
      { name: "limit", type: "uint256", internalType: "uint256" },
      { name: "skip", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IRegistry.ChamberData[]",
        components: [
          { name: "chamber", type: "address", internalType: "address" },
          { name: "memberToken", type: "address", internalType: "address" },
          { name: "govToken", type: "address", internalType: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_chamberBeacon", type: "address", internalType: "address" },
      { name: "_owner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setChamberBeacon",
    inputs: [
      { name: "_chamberBeacon", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalChambers",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ChamberDeployed",
    inputs: [
      {
        name: "chamber",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "serial",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "deployer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "memberToken",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "govToken",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      { name: "version", type: "uint8", indexed: false, internalType: "uint8" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "deployFailed", inputs: [] },
  { type: "error", name: "insufficientBalance", inputs: [] },
];
