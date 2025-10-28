# VoteChain - Votação Transparente na Blockchain

Este é um sistema de votação descentralizado e transparente que permite votos seguros e imutáveis na blockchain Ethereum.

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem
- **Smart Contract**: Solidity (Foundry)
- **Estilo**: shadcn/ui, Lucide React

## Configuração e Execução

### 1. Instalação de Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Deploy do Smart Contract

Antes de executar o frontend, você precisa deployar o contrato inteligente:

```bash
# Navegue até o diretório dos contratos
cd voting-contracts

# Compile os contratos
forge build

# Deploy na Sepolia (substitua YOUR_PRIVATE_KEY pelo seu)
forge create src/Voting.sol:Voting --rpc-url sepolia --private-key YOUR_PRIVATE_KEY
```

### 3. Configurar Variáveis de Ambiente

Atualize o arquivo `.env.local` com o endereço do contrato deployado:

```env
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/SEU_PROJETO_INFURA
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Endereço do contrato deployado
```

### 4. Executar o Projeto

```bash
# No diretório raiz
npm run dev
```

Agora você pode acessar o aplicativo em `http://localhost:3000`.

## Funcionalidades

- Conexão com carteira (MetaMask)
- Visualização de candidatos e propostas
- Votação segura na blockchain Ethereum
- Taxa de votação de 0.025 ETH
- Verificação de elegibilidade de voto
- Resultados em tempo real
- Ranking de candidatos

## Estrutura do Projeto

```
├── app/                   # Páginas Next.js
├── components/           # Componentes reutilizáveis
├── hooks/               # Hooks personalizados para Web3
├── lib/                 # Configurações e utilitários
├── types/               # Tipos TypeScript
├── voting-contracts/    # Contratos inteligentes (Foundry)  
└── README.md
```

## Como Votar

1. Conecte sua carteira (MetaMask ou outra compatível)
2. Selecione um candidato
3. Revise as informações de voto
4. Confirme a transação (custo de 0.025 ETH + taxas de gás)
5. Seu voto é registrado permanentemente na blockchain

> **Aviso**: Os votos são irreversíveis e registrados permanentemente na blockchain. Certifique-se de confirmar seu voto com cuidado.