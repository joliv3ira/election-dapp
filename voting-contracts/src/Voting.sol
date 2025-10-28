// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @dev Smart contract para sistema de votação descentralizada
 * @notice Este contrato permite votação com taxa, gerenciamento de candidatos e consulta de resultados
 */
contract Voting {
    // ========== STRUCTS ==========
    
    /**
     * @dev Estrutura para armazenar dados de um candidato
     */
    struct Candidate {
        uint256 id;
        string name;
        string description;
        string imageUrl;
        uint256 voteCount;
    }

    // ========== VARIÁVEIS DE ESTADO ==========
    
    /// @notice Endereço do proprietário/deployer do contrato
    address public owner;
    
    /// @notice Taxa fixa para votar (0.025 ETH)
    uint256 public constant VOTE_FEE = 0.025 ether;
    
    /// @notice Total de votos registrados no sistema
    uint256 public totalVotes;
    
    /// @notice Total de fundos arrecadados com as taxas de votação
    uint256 public totalFunds;
    
    /// @notice Contador de candidatos cadastrados
    uint256 public candidateCount;
    
    /// @notice Status da votação (true = ativa, false = inativa)
    bool public votingActive;

    // ========== MAPEAMENTOS ==========
    
    /// @notice Mapeia ID do candidato para seus dados completos
    mapping(uint256 => Candidate) public candidates;
    
    /// @notice Mapeia endereço da carteira para verificar se já votou
    mapping(address => bool) public hasVoted;
    
    /// @notice Mapeia endereço da carteira para o ID do candidato votado
    mapping(address => uint256) public votedForCandidateId;

    // ========== EVENTOS ==========
    
    /// @notice Emitido quando um voto é registrado
    event VoteCasted(address indexed voter, uint256 indexed candidateId, uint256 timestamp);
    
    /// @notice Emitido quando um candidato é adicionado
    event CandidateAdded(uint256 indexed candidateId, string name);
    
    /// @notice Emitido quando um candidato é removido
    event CandidateRemoved(uint256 indexed candidateId);
    
    /// @notice Emitido quando o status da votação é alterado
    event VotingStatusChanged(bool isActive);
    
    /// @notice Emitido quando fundos são sacados
    event FundsWithdrawn(address indexed to, uint256 amount);

    // ========== MODIFICADORES ==========
    
    /// @notice Restringe acesso apenas ao proprietário do contrato
    modifier onlyOwner() {
        require(msg.sender == owner, "Apenas o proprietario pode executar esta funcao");
        _;
    }
    
    /// @notice Verifica se a votação está ativa
    modifier votingIsActive() {
        require(votingActive, "A votacao nao esta ativa");
        _;
    }
    
    /// @notice Verifica se o candidato existe
    modifier candidateExists(uint256 _candidateId) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Candidato nao existe");
        require(bytes(candidates[_candidateId].name).length > 0, "Candidato foi removido");
        _;
    }

    // ========== CONSTRUCTOR ==========
    
    /**
     * @dev Inicializa o contrato definindo o deployer como owner
     * @notice A votação inicia desativada por padrão
     */
    constructor() {
        owner = msg.sender;
        votingActive = false;
        candidateCount = 0;
        totalVotes = 0;
        totalFunds = 0;
    }

    // ========== FUNÇÕES DE VOTAÇÃO ==========
    
    /**
     * @notice Permite que um eleitor vote em um candidato pagando a taxa
     * @dev Requer pagamento exato da VOTE_FEE e que o eleitor não tenha votado antes
     * @param _candidateId ID do candidato a receber o voto
     */
    function vote(uint256 _candidateId) 
        external 
        payable 
        votingIsActive 
        candidateExists(_candidateId) 
    {
        require(!hasVoted[msg.sender], "Voce ja votou");
        require(msg.value == VOTE_FEE, "Taxa de voto incorreta. Envie exatamente 0.025 ETH");

        // Registra o voto
        hasVoted[msg.sender] = true;
        votedForCandidateId[msg.sender] = _candidateId;
        
        // Atualiza contadores
        candidates[_candidateId].voteCount++;
        totalVotes++;
        totalFunds += msg.value;

        emit VoteCasted(msg.sender, _candidateId, block.timestamp);
    }

    // ========== FUNÇÕES DE CONSULTA ==========
    
    /**
     * @notice Retorna o total de votos no sistema
     * @return Total de votos registrados
     */
    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }

    /**
     * @notice Retorna o total de votos de um candidato específico
     * @param _candidateId ID do candidato
     * @return Quantidade de votos do candidato
     */
    function getCandidateVotes(uint256 _candidateId) 
        external 
        view 
        candidateExists(_candidateId) 
        returns (uint256) 
    {
        return candidates[_candidateId].voteCount;
    }

    /**
     * @notice Retorna informações completas de um candidato
     * @param _candidateId ID do candidato
     * @return Estrutura completa do candidato
     */
    function getCandidate(uint256 _candidateId) 
        external 
        view 
        candidateExists(_candidateId) 
        returns (Candidate memory) 
    {
        return candidates[_candidateId];
    }

    /**
     * @notice Retorna todos os candidatos cadastrados
     * @dev Retorna array com todos os candidatos, incluindo removidos (com name vazio)
     * @return Array de candidatos
     */
    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        
        return allCandidates;
    }

    /**
     * @notice Retorna apenas candidatos ativos (não removidos)
     * @return Array de candidatos ativos
     */
    function getActiveCandidates() external view returns (Candidate[] memory) {
        // Conta candidatos ativos
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (bytes(candidates[i].name).length > 0) {
                activeCount++;
            }
        }

        // Cria array com tamanho exato
        Candidate[] memory activeCandidates = new Candidate[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (bytes(candidates[i].name).length > 0) {
                activeCandidates[currentIndex] = candidates[i];
                currentIndex++;
            }
        }
        
        return activeCandidates;
    }

    /**
     * @notice Retorna o candidato com mais votos (vencedor)
     * @dev Em caso de empate, retorna o primeiro candidato encontrado com maior votação
     * @return Estrutura do candidato vencedor
     */
    function getWinner() external view returns (Candidate memory) {
        require(candidateCount > 0, "Nenhum candidato cadastrado");
        
        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;

        for (uint256 i = 1; i <= candidateCount; i++) {
            if (bytes(candidates[i].name).length > 0 && candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        require(winningCandidateId > 0, "Nenhum vencedor encontrado");
        return candidates[winningCandidateId];
    }

    /**
     * @notice Retorna o saldo do contrato
     * @return Saldo em wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Verifica se um endereço já votou
     * @param _voter Endereço a ser verificado
     * @return true se já votou, false caso contrário
     */
    function hasVoterVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
    }

    /**
     * @notice Retorna o ID do candidato que um endereço votou
     * @param _voter Endereço do eleitor
     * @return ID do candidato (0 se não votou)
     */
    function getVotedCandidate(address _voter) external view returns (uint256) {
        return votedForCandidateId[_voter];
    }

    /**
     * @notice Retorna estatísticas gerais da votação
     * @return _totalVotes Total de votos
     * @return _totalFunds Total de fundos arrecadados
     * @return _candidateCount Quantidade de candidatos
     * @return _votingActive Status da votação
     */
    function getVotingStats() external view returns (
        uint256 _totalVotes,
        uint256 _totalFunds,
        uint256 _candidateCount,
        bool _votingActive
    ) {
        return (totalVotes, totalFunds, candidateCount, votingActive);
    }

    // ========== FUNÇÕES ADMINISTRATIVAS ==========

    /**
     * @notice Adiciona um novo candidato ao sistema
     * @dev Apenas o owner pode executar
     * @param _name Nome do candidato
     * @param _description Descrição do candidato
     * @param _imageUrl URL da imagem do candidato
     */
    function addCandidate(
        string memory _name,
        string memory _description,
        string memory _imageUrl
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Nome do candidato nao pode ser vazio");
        
        candidateCount++;
        
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            description: _description,
            imageUrl: _imageUrl,
            voteCount: 0
        });

        emit CandidateAdded(candidateCount, _name);
    }

    /**
     * @notice Remove um candidato do sistema
     * @dev Apenas o owner pode executar. Não exclui, apenas limpa os dados
     * @param _candidateId ID do candidato a ser removido
     */
    function removeCandidate(uint256 _candidateId) 
        external 
        onlyOwner 
        candidateExists(_candidateId) 
    {
        // Armazena votos antes de remover
        uint256 votesToSubtract = candidates[_candidateId].voteCount;
        
        // Remove o candidato limpando seus dados
        delete candidates[_candidateId];
        
        // Atualiza total de votos
        if (votesToSubtract > 0) {
            totalVotes -= votesToSubtract;
        }

        emit CandidateRemoved(_candidateId);
    }

    /**
     * @notice Ativa ou desativa a votação
     * @dev Apenas o owner pode executar
     * @param _status true para ativar, false para desativar
     */
    function setVotingActive(bool _status) external onlyOwner {
        votingActive = _status;
        emit VotingStatusChanged(_status);
    }

    /**
     * @notice Permite que o owner saque os fundos do contrato
     * @dev Apenas o owner pode executar
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nao ha fundos para sacar");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Falha ao transferir fundos");

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @notice Transfere a propriedade do contrato para um novo owner
     * @dev Apenas o owner atual pode executar
     * @param _newOwner Endereço do novo proprietário
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Novo owner nao pode ser endereco zero");
        owner = _newOwner;
    }

    /**
     * @notice Permite que o contrato receba ETH diretamente
     */
    receive() external payable {}
}

