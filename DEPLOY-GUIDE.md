# 🚀 Guia Completo de Deploy - Sistema de Votação Descentralizada

## 📋 Problema Identificado

O erro que você estava recebendo:
```
error: a value is required for '--fork-url <URL>' but none was supplied
```

**Causa**: As variáveis de ambiente não estavam configuradas no arquivo `.env`.

## ✅ Solução Completa

### 1️⃣ Configurar Variáveis de Ambiente para o Contrato

**No diretório `voting-contracts`, crie um arquivo `.env`:**

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/SUA_API_KEY_AQUI
PRIVATE_KEY=sua_chave_privada_sem_0x
ETHERSCAN_API_KEY=sua_etherscan_api_key
```

> 📝 Use o arquivo `env-template.txt` como referência!

### 2️⃣ Obter Credenciais Necessárias

#### 🔗 RPC URL da Sepolia (Alchemy - Recomendado)

1. Acesse: https://www.alchemy.com/
2. Crie uma conta gratuita
3. Clique em "Create App"
4. Configure:
   - **Name**: Voting DApp
   - **Chain**: Ethereum
   - **Network**: Sepolia
5. Copie a **HTTP URL**
6. Cole no `.env` em `SEPOLIA_RPC_URL`

#### 🔑 Chave Privada (MetaMask)

⚠️ **IMPORTANTE**: Use uma carteira de teste!

1. Abra o MetaMask
2. Clique nos três pontos → "Account Details"
3. Clique em "Show Private Key"
4. Digite sua senha
5. Copie a chave **SEM o prefixo `0x`**
6. Cole no `.env` em `PRIVATE_KEY`

#### 💰 ETH de Teste (Sepolia Faucet)

1. Acesse: https://sepoliafaucet.com/
2. Cole o endereço da sua carteira
3. Solicite ETH de teste (mínimo 0.1 ETH)
4. Aguarde alguns minutos

### 3️⃣ Executar Deploy do Contrato

**Opção A - Script PowerShell (Recomendado):**

```powershell
cd voting-contracts
.\deploy.ps1
```

**Opção B - Comando Manual (PowerShell):**

```powershell
cd voting-contracts

# Carregar variáveis de ambiente
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# Deploy
forge script script/Deploy.s.sol:DeployVoting --rpc-url $env:SEPOLIA_RPC_URL --broadcast -vvv
```

**Opção C - Bash/Linux/Mac:**

```bash
cd voting-contracts
source .env
forge script script/Deploy.s.sol:DeployVoting --rpc-url $SEPOLIA_RPC_URL --broadcast -vvv
```

### 4️⃣ Anotar o Endereço do Contrato

Após o deploy, você verá algo como:

```
== Logs ==
  Deployed Voting at: 0x1234567890abcdef1234567890abcdef12345678

Transaction Hash: 0xabcdef123456...
```

**⚠️ COPIE O ENDEREÇO DO CONTRATO!**

### 5️⃣ Atualizar Configuração do Frontend

Edite o arquivo `lib/contract-config.ts`:

```typescript
export const contractConfig = {
  address: "0xSEU_ENDERECO_DO_CONTRATO_DEPLOYADO_AQUI" as `0x${string}`,
  abi: abi
} as const;
```

### 6️⃣ Copiar ABI Atualizado (Opcional)

Se você modificou o contrato, atualize o ABI:

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

### 7️⃣ Configurar Variáveis de Ambiente do Frontend (Opcional)

Crie um arquivo `.env.local` na **raiz do projeto**:

```env
# URL RPC para o frontend (pode usar a mesma do deploy)
NEXT_PUBLIC_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/SUA_API_KEY_AQUI

# Endereço do contrato deployado (opcional, já está no contract-config.ts)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xSEU_ENDERECO_DO_CONTRATO
```

### 8️⃣ Adicionar Candidatos e Ativar Votação

**Usando Foundry Cast:**

```bash
# Definir variáveis (PowerShell)
$CONTRACT_ADDRESS = "0xSEU_ENDERECO_DO_CONTRATO"
$RPC_URL = "sua_rpc_url"
$PRIVATE_KEY = "sua_private_key"

# Adicionar candidato 1
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "João Silva" "Candidato com foco em educação e tecnologia" "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# Adicionar candidato 2
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "Maria Santos" "Candidata com foco em saúde e bem-estar" "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# Adicionar candidato 3
cast send $CONTRACT_ADDRESS "addCandidate(string,string,string)" "Pedro Costa" "Candidato com foco em infraestrutura" "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# Ativar votação
cast send $CONTRACT_ADDRESS "setVotingActive(bool)" true --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### 9️⃣ Testar a Aplicação

```bash
# Voltar para raiz do projeto
cd ..

# Instalar dependências (se ainda não fez)
npm install

# Executar em desenvolvimento
npm run dev
```

Abra http://localhost:3000 e conecte sua carteira!

## 📊 Estrutura de Arquivos Criados

```
votacao-descentralizada/
├── voting-contracts/
│   ├── .env                    # ⚠️ Suas credenciais (não fazer commit!)
│   ├── .gitignore              # Ignora .env e arquivos de build
│   ├── env-template.txt        # Template para .env
│   ├── deploy.ps1              # Script de deploy para PowerShell
│   ├── SETUP.md                # Guia de configuração detalhado
│   ├── README.md               # Documentação do contrato
│   ├── src/Voting.sol          # Contrato inteligente
│   ├── script/Deploy.s.sol     # Script de deploy
│   └── test/Voting.t.sol       # Testes do contrato
├── lib/
│   ├── contract-config.ts      # ⚠️ Atualizar com endereço após deploy!
│   └── config.ts               # Configuração Wagmi
├── .env.local                  # ⚠️ Variáveis do frontend (opcional)
└── DEPLOY-GUIDE.md             # Este arquivo
```

## 🔍 Verificar Deploy no Etherscan

Acesse: https://sepolia.etherscan.io/address/SEU_ENDERECO_DO_CONTRATO

Você poderá ver:
- ✅ Transações do contrato
- ✅ Código do contrato
- ✅ Eventos emitidos
- ✅ Saldo do contrato

## 🐛 Troubleshooting

### Erro: "insufficient funds"
**Solução**: Obtenha mais ETH no faucet da Sepolia

### Erro: "nonce too low"
**Solução**: Aguarde transação anterior ou reset do MetaMask (Settings → Advanced → Clear Activity Tab Data)

### Erro: "execution reverted"
**Solução**: Verifique se:
- A votação está ativa (`setVotingActive(true)`)
- O candidato existe
- Você não votou antes
- Está enviando exatamente 0.025 ETH

### Erro: variáveis de ambiente não carregadas
**Solução (PowerShell)**:
```powershell
# Verificar se carregou
echo $env:SEPOLIA_RPC_URL

# Se não mostrou nada, carregue manualmente:
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
```

## 🔐 Segurança

- ✅ **NUNCA** faça commit do arquivo `.env`
- ✅ **SEMPRE** use uma carteira de teste
- ✅ **VERIFIQUE** o endereço do contrato antes de interagir
- ✅ **GUARDE** a chave privada em local seguro
- ✅ **REVOGUE** acesso de apps que não usa mais

## 🎯 Próximos Passos

1. ✅ Deploy do contrato na Sepolia
2. ✅ Adicionar candidatos
3. ✅ Ativar votação
4. ✅ Testar votação com diferentes carteiras
5. 🚀 Deploy do frontend na Vercel (opcional)
6. 🎨 Personalizar interface (opcional)

## 📚 Recursos Adicionais

- [Foundry Book](https://book.getfoundry.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Sepolia Testnet](https://sepolia.etherscan.io/)
- [Alchemy](https://www.alchemy.com/)
- [Infura](https://infura.io/)
- [Repositório de Referência](https://github.com/nrxschool/flashbootcamp04)

---

## ✨ Resumo Rápido

```powershell
# 1. Criar .env em voting-contracts/
# 2. Preencher SEPOLIA_RPC_URL e PRIVATE_KEY
# 3. Executar deploy
cd voting-contracts
.\deploy.ps1

# 4. Copiar endereço do contrato
# 5. Atualizar lib/contract-config.ts
# 6. Adicionar candidatos via cast
# 7. Ativar votação
# 8. Testar aplicação
cd ..
npm run dev
```

**Pronto! Sua DApp de votação está no ar! 🎉**

