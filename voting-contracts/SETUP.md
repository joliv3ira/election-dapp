# 🚀 Guia de Configuração e Deploy

## ✅ Checklist Pré-Deploy

- [ ] Foundry instalado (`foundryup`)
- [ ] Conta na [Alchemy](https://www.alchemy.com/) ou [Infura](https://infura.io/)
- [ ] Carteira com ETH de teste na Sepolia ([Faucet](https://sepoliafaucet.com/))
- [ ] Chave privada da carteira exportada do MetaMask

## 📝 Passo a Passo

### 1️⃣ Criar arquivo `.env`

No diretório `voting-contracts`, crie um arquivo chamado `.env` com o seguinte conteúdo (baseado no `env-template.txt`):

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/SUA_API_KEY_AQUI
PRIVATE_KEY=sua_chave_privada_sem_0x
ETHERSCAN_API_KEY=sua_etherscan_api_key
```

### 2️⃣ Obter URL RPC da Sepolia

#### Usando Alchemy (Recomendado)

1. Acesse [alchemy.com](https://www.alchemy.com/)
2. Crie uma conta gratuita
3. Clique em "Create App"
4. Escolha:
   - Chain: Ethereum
   - Network: Sepolia
5. Copie a URL HTTP do seu app
6. Cole no `.env` em `SEPOLIA_RPC_URL`

#### Usando Infura

1. Acesse [infura.io](https://infura.io/)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Selecione "Sepolia" como network
5. Copie a URL do endpoint
6. Cole no `.env` em `SEPOLIA_RPC_URL`

### 3️⃣ Obter Chave Privada

⚠️ **ATENÇÃO**: Use uma carteira de teste! Nunca use sua carteira principal!

**MetaMask:**
1. Abra o MetaMask
2. Clique nos três pontos
3. Selecione "Account Details"
4. Clique em "Show Private Key"
5. Digite sua senha
6. Copie a chave (SEM o prefixo `0x`)
7. Cole no `.env` em `PRIVATE_KEY`

### 4️⃣ Obter ETH de Teste

1. Acesse [sepoliafaucet.com](https://sepoliafaucet.com/)
2. Cole o endereço da sua carteira
3. Solicite ETH de teste
4. Aguarde alguns minutos

Você vai precisar de aproximadamente **0.1 ETH** para:
- Deploy do contrato (~0.05 ETH)
- Transações de teste (~0.05 ETH)

### 5️⃣ Executar Deploy

#### Opção A: Usando o Script PowerShell (Windows)

```powershell
cd voting-contracts
.\deploy.ps1
```

#### Opção B: Comando Manual

```powershell
# Carregar variáveis de ambiente
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# Deploy
forge script script/Deploy.s.sol:DeployVoting --rpc-url $env:SEPOLIA_RPC_URL --broadcast
```

#### Opção C: Bash/Linux/Mac

```bash
# Carregar variáveis
source .env

# Deploy
forge script script/Deploy.s.sol:DeployVoting --rpc-url $SEPOLIA_RPC_URL --broadcast
```

### 6️⃣ Após o Deploy

O output vai mostrar algo como:

```
== Logs ==
  Deployed Voting at: 0x1234567890abcdef...

Transaction Hash: 0xabcdef123456...
```

**IMPORTANTE**: Copie o endereço do contrato!

### 7️⃣ Copiar ABI para o Frontend

Execute este comando no PowerShell dentro da pasta `voting-contracts`:

```powershell
Get-Content out/Voting.sol/Voting.json | ConvertFrom-Json | Select-Object -ExpandProperty abi | ConvertTo-Json -Depth 100 | Out-File ../abi.json -Encoding utf8
```

Ou manualmente:
1. Abra `voting-contracts/out/Voting.sol/Voting.json`
2. Copie o campo `"abi": [...]`
3. Cole no arquivo `abi.json` na raiz do projeto

### 8️⃣ Atualizar Configuração do Frontend

Edite o arquivo `lib/contract-config.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xSEU_ENDERECO_DO_CONTRATO_AQUI'
```

### 9️⃣ Testar a Aplicação

```bash
cd ..  # Voltar para raiz do projeto
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) e conecte sua carteira!

## 🎯 Adicionar Candidatos

Após o deploy, você precisa adicionar candidatos. Execute os comandos abaixo no terminal dentro de `voting-contracts`:

```bash
# Carregar variáveis
source .env  # Linux/Mac
# ou
Get-Content .env | ForEach-Object { ... }  # Windows PowerShell

# Adicionar candidato 1
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "João Silva" "Candidato com foco em educação" "https://exemplo.com/joao.jpg" --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY

# Adicionar candidato 2
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "Maria Santos" "Candidata com foco em saúde" "https://exemplo.com/maria.jpg" --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY

# Ativar votação
cast send $CONTRACT_ADDRESS "setVotingActive(bool)" true --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

## 🔍 Verificar Contrato no Etherscan (Opcional)

```bash
forge verify-contract $CONTRACT_ADDRESS \
  src/Voting.sol:Voting \
  --chain-id 11155111 \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## ❓ Troubleshooting

### Erro: "a value is required for '--fork-url'"

**Solução**: O arquivo `.env` não existe ou as variáveis não foram carregadas. 
- Verifique se o arquivo `.env` existe
- Carregue as variáveis de ambiente antes de executar o comando

### Erro: "insufficient funds"

**Solução**: Sua carteira não tem ETH suficiente.
- Obtenha mais ETH no [faucet da Sepolia](https://sepoliafaucet.com/)

### Erro: "nonce too low"

**Solução**: Transação anterior ainda está pendente.
- Aguarde a transação anterior ser confirmada
- Ou aumente o nonce manualmente

### Erro: "invalid private key"

**Solução**: A chave privada está incorreta.
- Verifique se copiou a chave completa
- Certifique-se de remover o prefixo `0x`

## 🔗 Links Úteis

- [Foundry Book](https://book.getfoundry.sh/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy](https://www.alchemy.com/)
- [Infura](https://infura.io/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

