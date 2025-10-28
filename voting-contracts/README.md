# Voting Smart Contract

Contrato inteligente para sistema de votação descentralizada desenvolvido com Foundry.

## 🚀 Pré-requisitos

- [Foundry](https://book.getfoundry.sh/getting-started/installation) instalado
- Uma carteira com ETH de teste na Sepolia ([Faucet Sepolia](https://sepoliafaucet.com/))
- Chave API da Alchemy ou Infura para RPC

## 📝 Configuração

1. **Copie o arquivo de exemplo**:
```bash
cp .env.example .env
```

2. **Edite o arquivo `.env`** e preencha:
   - `SEPOLIA_RPC_URL`: URL RPC da Sepolia (obtenha em [Alchemy](https://www.alchemy.com/) ou [Infura](https://infura.io/))
   - `PRIVATE_KEY`: Sua chave privada (sem o prefixo `0x`)
   - `ETHERSCAN_API_KEY`: API Key do Etherscan (opcional, para verificação)

⚠️ **IMPORTANTE**: Nunca compartilhe ou faça commit do arquivo `.env`!

## 🧪 Executar Testes

```bash
forge test
```

Testes com verbosidade:
```bash
forge test -vvvv
```

## 📦 Build

```bash
forge build
```

## 🚀 Deploy

### Deploy na Sepolia Testnet

```bash
forge script script/Deploy.s.sol:DeployVoting --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
```

Ou usando o valor direto da variável:
```bash
source .env
forge script script/Deploy.s.sol:DeployVoting --rpc-url $SEPOLIA_RPC_URL --broadcast
```

### No PowerShell (Windows)

```powershell
# Carregar variáveis de ambiente
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# Deploy
forge script script/Deploy.s.sol:DeployVoting --rpc-url $env:SEPOLIA_RPC_URL --broadcast
```

## 📋 Após o Deploy

Após o deploy bem-sucedido, você receberá:
- **Contract Address**: Endereço do contrato deployado
- **Transaction Hash**: Hash da transação de deploy
- **Deployment Receipt**: Recibo completo no arquivo `broadcast/`

### Copiar ABI para o Frontend

```bash
# Copiar ABI do contrato
cat out/Voting.sol/Voting.json | jq '.abi' > ../abi.json
```

Ou manualmente copie o conteúdo de `out/Voting.sol/Voting.json` (campo `abi`) para o arquivo `abi.json` na raiz do projeto frontend.

## 🔧 Funções Principais do Contrato

### Funções de Votação
- `vote(uint256 _candidateId)` - Votar em um candidato (requer 0.025 ETH)

### Funções de Consulta
- `getAllCandidates()` - Retorna todos os candidatos
- `getActiveCandidates()` - Retorna apenas candidatos ativos
- `getCandidate(uint256 _candidateId)` - Retorna dados de um candidato
- `getTotalVotes()` - Retorna total de votos
- `getWinner()` - Retorna o candidato vencedor
- `hasVoterVoted(address _voter)` - Verifica se endereço já votou
- `getVotedCandidate(address _voter)` - Retorna ID do candidato votado

### Funções Administrativas (apenas owner)
- `addCandidate(string memory _name, string memory _description, string memory _imageUrl)` - Adiciona candidato
- `removeCandidate(uint256 _candidateId)` - Remove candidato
- `setVotingActive(bool _status)` - Ativa/desativa votação
- `withdrawFunds()` - Saca fundos do contrato
- `transferOwnership(address _newOwner)` - Transfere propriedade

## 📊 Estruturas de Dados

```solidity
struct Candidate {
    uint256 id;
    string name;
    string description;
    string imageUrl;
    uint256 voteCount;
}
```

## 🔒 Segurança

- ✅ Validação de entrada em todas as funções
- ✅ Modificadores de acesso (onlyOwner)
- ✅ Prevenção de votos duplicados
- ✅ Taxa fixa de votação
- ✅ Eventos para transparência
- ✅ Testes abrangentes

## 📄 Licença

MIT
