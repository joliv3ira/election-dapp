# 🗳️ Election DApp

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-627EEA?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Decentralized, transparent, and secure voting system on the Ethereum blockchain**

[Demo](#) · [Documentation](#features) · [Contributing](#contributing)

</div>

---

## 📋 About the Project

**Election DApp** is a decentralized application for conducting transparent and immutable digital elections. Using Ethereum blockchain technology, the system ensures:

- 🔒 **Security**: Encrypted and immutable votes
- 🌐 **Transparency**: Results auditable by anyone
- 🚫 **Anti-fraud**: Impossible to alter or duplicate votes
- ⚡ **Real-time**: Instantly updated results

## 🚀 Technologies

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| **Web3** | Wagmi 2, Viem 2, TanStack Query |
| **Smart Contract** | Solidity, Foundry |
| **Blockchain** | Ethereum (Sepolia Testnet) |

## 📦 Installation

### Prerequisites

- Node.js 18+
- Web3 Wallet (MetaMask recommended)
- ETH on Sepolia Testnet (for testing)

### 1. Clone the repository

```bash
git clone https://github.com/joliv3ira/election-dapp.git
cd election-dapp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Deployed contract address
```

### 4. Run the project

```bash
npm run dev
```

Access [http://localhost:3000](http://localhost:3000) 🎉

## 🔧 Smart Contract Deployment

```bash
# Navigate to contracts directory
cd voting-contracts

# Build contracts
forge build

# Deploy to Sepolia
forge create src/Voting.sol:Voting \
  --rpc-url sepolia \
  --private-key YOUR_PRIVATE_KEY
```

## ✨ Features

- [x] Wallet connection (MetaMask, WalletConnect, etc.)
- [x] Candidate registration and viewing
- [x] Secure blockchain voting
- [x] Voter eligibility verification
- [x] Real-time results
- [x] Candidate ranking
- [x] Transaction history
- [x] Responsive interface (mobile-first)

## 📁 Project Structure

```
election-dapp/
├── app/                    # App Router (Next.js 16)
│   ├── layout.tsx          # Main layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Project components
├── hooks/                  # Custom hooks
│   └── useVote.ts          # Web3 voting hook
├── lib/                    # Configurations and utilities
│   ├── wagmi.ts            # Wagmi configuration
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript definitions
├── voting-contracts/       # Smart Contracts (Foundry)
│   └── src/Voting.sol      # Voting contract
└── README.md
```

## 🗳️ How to Vote

1. **Connect your wallet** - Click "Connect Wallet" and authorize in MetaMask
2. **Choose a candidate** - Browse the list and select your candidate
3. **Confirm your vote** - Review the information and confirm
4. **Approve the transaction** - Confirm in MetaMask (0.025 ETH + gas)
5. **Done!** - Your vote has been permanently recorded on the blockchain

> ⚠️ **Important**: Votes are irreversible and permanently recorded on the blockchain. Vote responsibly!

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add: new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

Made with ❤️ by [Jorge Oliveira](https://github.com/joliv3ira)

</div>
