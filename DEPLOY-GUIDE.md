# 🚀 Complete Deployment Guide - Decentralized Voting System

## 📋 Identified Problem

The error you were receiving:
```
error: a value is required for '--fork-url <URL>' but none was supplied
```

**Cause**: Environment variables were not configured in the `.env` file.

## ✅ Complete Solution

### 1️⃣ Configure Environment Variables for the Contract

**In the `voting-contracts` directory, create a `.env` file:**

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

> 📝 Use the `env-template.txt` file as reference!

### 2️⃣ Obtain Required Credentials

#### 🔗 Sepolia RPC URL (Alchemy - Recommended)

1. Go to: https://www.alchemy.com/
2. Create a free account
3. Click "Create App"
4. Configure:
   - **Name**: Voting DApp
   - **Chain**: Ethereum
   - **Network**: Sepolia
5. Copy the **HTTP URL**
6. Paste in `.env` under `SEPOLIA_RPC_URL`

#### 🔑 Private Key (MetaMask)

⚠️ **IMPORTANT**: Use a test wallet!

1. Open MetaMask
2. Click the three dots → "Account Details"
3. Click "Show Private Key"
4. Enter your password
5. Copy the key **WITHOUT the `0x` prefix**
6. Paste in `.env` under `PRIVATE_KEY`

#### 💰 Test ETH (Sepolia Faucet)

1. Go to: https://sepoliafaucet.com/
2. Paste your wallet address
3. Request test ETH (minimum 0.1 ETH)
4. Wait a few minutes

### 3️⃣ Execute Contract Deployment

**Option A - PowerShell Script (Recommended):**

```powershell
cd voting-contracts
.\deploy.ps1
```

**Option B - Manual Command (PowerShell):**

```powershell
cd voting-contracts

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# Deploy
forge script script/Deploy.s.sol:DeployVoting --rpc-url $env:SEPOLIA_RPC_URL --broadcast -vvv
```

**Option C - Bash/Linux/Mac:**

```bash
cd voting-contracts
source .env
forge script script/Deploy.s.sol:DeployVoting --rpc-url $SEPOLIA_RPC_URL --broadcast -vvv
```

### 4️⃣ Note the Contract Address

After deployment, you will see something like:

```
== Logs ==
  Deployed Voting at: 0x1234567890abcdef1234567890abcdef12345678

Transaction Hash: 0xabcdef123456...
```

**⚠️ COPY THE CONTRACT ADDRESS!**

### 5️⃣ Update Frontend Configuration

Edit the file `lib/contract-config.ts`:

```typescript
export const contractConfig = {
  address: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE" as `0x${string}`,
  abi: abi
} as const;
```

### 6️⃣ Copy Updated ABI (Optional)

If you modified the contract, update the ABI:

**PowerShell:**
```powershell
cd voting-contracts
Get-Content out/Voting.sol/Voting.json | ConvertFrom-Json | Select-Object -ExpandProperty abi | ConvertTo-Json -Depth 100 | Out-File ../abi.json -Encoding utf8
```

**Bash:**
```bash
cd voting-contracts
cat out/Voting.sol/Voting.json | jq '.abi' > ../abi.json
```

### 7️⃣ Configure Frontend Environment Variables (Optional)

Create a `.env.local` file in the **project root**:

```env
# RPC URL for frontend (can use the same as deployment)
NEXT_PUBLIC_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE

# Deployed contract address (optional, already in contract-config.ts)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
```

### 8️⃣ Add Candidates and Activate Voting

**Using Foundry Cast:**

```bash
# Set variables (PowerShell)
$CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS"
$RPC_URL = "your_rpc_url"
$PRIVATE_KEY = "your_private_key"

# Add candidate 1
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "John Smith" "Candidate focused on education and technology" "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# Add candidate 2
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "Mary Johnson" "Candidate focused on health and wellness" "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# Add candidate 3
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "Peter Williams" "Candidate focused on infrastructure" "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# Activate voting
cast send $CONTRACT_ADDRESS "setVotingActive(bool)" true --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### 9️⃣ Test the Application

```bash
# Go back to project root
cd ..

# Install dependencies (if not done yet)
npm install

# Run in development
npm run dev
```

Open http://localhost:3000 and connect your wallet!

## 📊 Created File Structure

```
election-dapp/
├── voting-contracts/
│   ├── .env                    # ⚠️ Your credentials (do not commit!)
│   ├── .gitignore              # Ignores .env and build files
│   ├── env-template.txt        # Template for .env
│   ├── deploy.ps1              # PowerShell deployment script
│   ├── SETUP.md                # Detailed setup guide
│   ├── README.md               # Contract documentation
│   ├── src/Voting.sol          # Smart contract
│   ├── script/Deploy.s.sol     # Deployment script
│   └── test/Voting.t.sol       # Contract tests
├── lib/
│   ├── contract-config.ts      # ⚠️ Update with address after deployment!
│   └── config.ts               # Wagmi configuration
├── .env.local                  # ⚠️ Frontend variables (optional)
└── DEPLOY-GUIDE.md             # This file
```

## 🔍 Verify Deployment on Etherscan

Go to: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

You will be able to see:
- ✅ Contract transactions
- ✅ Contract code
- ✅ Emitted events
- ✅ Contract balance

## 🐛 Troubleshooting

### Error: "insufficient funds"
**Solution**: Get more ETH from Sepolia faucet

### Error: "nonce too low"
**Solution**: Wait for previous transaction or reset MetaMask (Settings → Advanced → Clear Activity Tab Data)

### Error: "execution reverted"
**Solution**: Check if:
- Voting is active (`setVotingActive(true)`)
- Candidate exists
- You haven't voted before
- You're sending exactly 0.025 ETH

### Error: environment variables not loaded
**Solution (PowerShell)**:
```powershell
# Check if loaded
echo $env:SEPOLIA_RPC_URL

# If nothing shows, load manually:
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
```

## 🔐 Security

- ✅ **NEVER** commit the `.env` file
- ✅ **ALWAYS** use a test wallet
- ✅ **VERIFY** the contract address before interacting
- ✅ **STORE** the private key in a safe place
- ✅ **REVOKE** access from apps you no longer use

## 🎯 Next Steps

1. ✅ Deploy contract to Sepolia
2. ✅ Add candidates
3. ✅ Activate voting
4. ✅ Test voting with different wallets
5. 🚀 Deploy frontend to Vercel (optional)
6. 🎨 Customize interface (optional)

## 📚 Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Sepolia Testnet](https://sepolia.etherscan.io/)
- [Alchemy](https://www.alchemy.com/)
- [Infura](https://infura.io/)
- [Reference Repository](https://github.com/nrxschool/flashbootcamp04)

---

## ✨ Quick Summary

```powershell
# 1. Create .env in voting-contracts/
# 2. Fill in SEPOLIA_RPC_URL and PRIVATE_KEY
# 3. Execute deployment
cd voting-contracts
.\deploy.ps1

# 4. Copy contract address
# 5. Update lib/contract-config.ts
# 6. Add candidates via cast
# 7. Activate voting
# 8. Test application
cd ..
npm run dev
```

**Done! Your voting DApp is live! 🎉**
