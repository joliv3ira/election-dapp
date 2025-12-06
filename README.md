# 🗳️ Election DApp

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-627EEA?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sistema de votação descentralizado, transparente e seguro na blockchain Ethereum**

[Demo](#) · [Documentação](#funcionalidades) · [Contribuir](#contribuindo)

</div>

---

## 📋 Sobre o Projeto

O **Election DApp** é uma aplicação descentralizada para condução de eleições digitais transparentes e imutáveis. Utilizando a tecnologia blockchain Ethereum, o sistema garante:

- 🔒 **Segurança**: Votos criptografados e imutáveis
- 🌐 **Transparência**: Resultados auditáveis por qualquer pessoa
- 🚫 **Anti-fraude**: Impossível alterar ou duplicar votos
- ⚡ **Tempo real**: Resultados atualizados instantaneamente

## 🚀 Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Estilização** | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| **Web3** | Wagmi 2, Viem 2, TanStack Query |
| **Smart Contract** | Solidity, Foundry |
| **Blockchain** | Ethereum (Sepolia Testnet) |

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- Carteira Web3 (MetaMask recomendado)
- ETH na Sepolia Testnet (para testes)

### 1. Clone o repositório

```bash
git clone https://github.com/joliv3ira/election-dapp.git
cd election-dapp
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SEPOLIA_RPC=https://sepolia.infura.io/v3/SEU_PROJETO_INFURA
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Endereço do contrato deployado
```

### 4. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

## 🔧 Deploy do Smart Contract

```bash
# Navegue até o diretório dos contratos
cd voting-contracts

# Compile os contratos
forge build

# Deploy na Sepolia
forge create src/Voting.sol:Voting \
  --rpc-url sepolia \
  --private-key YOUR_PRIVATE_KEY
```

## ✨ Funcionalidades

- [x] Conexão com carteira (MetaMask, WalletConnect, etc.)
- [x] Cadastro e visualização de candidatos
- [x] Votação segura na blockchain
- [x] Verificação de elegibilidade do eleitor
- [x] Resultados em tempo real
- [x] Ranking de candidatos
- [x] Histórico de transações
- [x] Interface responsiva (mobile-first)

## 📁 Estrutura do Projeto

```
election-dapp/
├── app/                    # App Router (Next.js 16)
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página inicial
├── components/             # Componentes React
│   ├── ui/                 # Componentes shadcn/ui
│   └── ...                 # Componentes do projeto
├── hooks/                  # Hooks personalizados
│   └── useVote.ts          # Hook de votação Web3
├── lib/                    # Configurações e utilitários
│   ├── wagmi.ts            # Configuração Wagmi
│   └── utils.ts            # Funções utilitárias
├── types/                  # Definições TypeScript
├── voting-contracts/       # Smart Contracts (Foundry)
│   └── src/Voting.sol      # Contrato de votação
└── README.md
```

## 🗳️ Como Votar

1. **Conecte sua carteira** - Clique em "Conectar Carteira" e autorize no MetaMask
2. **Escolha um candidato** - Navegue pela lista e selecione seu candidato
3. **Confirme seu voto** - Revise as informações e confirme
4. **Aprove a transação** - Confirme no MetaMask (0.025 ETH + gas)
5. **Pronto!** - Seu voto foi registrado permanentemente na blockchain

> ⚠️ **Importante**: Os votos são irreversíveis e registrados permanentemente na blockchain. Vote com responsabilidade!

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ❤️ por [Jorge Oliveira](https://github.com/joliv3ira)

</div>
