// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Voting} from "../src/Voting.sol";

/**
 * @title VotingTest
 * @dev Suite completa de testes para o contrato Voting
 */
contract VotingTest is Test {
    Voting public voting;
    
    address public owner;
    address public voter1;
    address public voter2;
    address public voter3;

    // Eventos para teste
    event VoteCasted(address indexed voter, uint256 indexed candidateId, uint256 timestamp);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event CandidateRemoved(uint256 indexed candidateId);
    event VotingStatusChanged(bool isActive);
    event FundsWithdrawn(address indexed to, uint256 amount);

    function setUp() public {
        // Define endereços de teste
        owner = address(this);
        voter1 = makeAddr("voter1");
        voter2 = makeAddr("voter2");
        voter3 = makeAddr("voter3");

        // Deploy do contrato
        voting = new Voting();

        // Adiciona fundos aos eleitores
        vm.deal(voter1, 1 ether);
        vm.deal(voter2, 1 ether);
        vm.deal(voter3, 1 ether);
    }

    // Permite que o contrato de teste receba ETH
    receive() external payable {}

    // ========== TESTES DE INICIALIZAÇÃO ==========

    function test_InitialOwner() public view {
        assertEq(voting.owner(), owner, "Owner deveria ser o deployer");
    }

    function test_InitialVoteFee() public view {
        assertEq(voting.VOTE_FEE(), 0.025 ether, "VOTE_FEE deveria ser 0.025 ether");
    }

    function test_InitialTotalVotes() public view {
        assertEq(voting.totalVotes(), 0, "Total de votos deveria ser 0");
    }

    function test_InitialTotalFunds() public view {
        assertEq(voting.totalFunds(), 0, "Total de fundos deveria ser 0");
    }

    function test_InitialCandidateCount() public view {
        assertEq(voting.candidateCount(), 0, "Contagem de candidatos deveria ser 0");
    }

    function test_InitialVotingActive() public view {
        assertFalse(voting.votingActive(), "Votacao deveria iniciar desativada");
    }

    function test_InitialContractBalance() public view {
        assertEq(voting.getContractBalance(), 0, "Saldo do contrato deveria ser 0");
    }

    // ========== TESTES DE ADMINISTRAÇÃO DE CANDIDATOS ==========

    function test_AddCandidate() public {
        vm.expectEmit(true, false, false, true);
        emit CandidateAdded(1, "Candidato 1");

        voting.addCandidate("Candidato 1", "Descricao 1", "https://image1.com");

        assertEq(voting.candidateCount(), 1, "Deveria ter 1 candidato");
        
        Voting.Candidate memory candidate = voting.getCandidate(1);
        assertEq(candidate.id, 1, "ID do candidato incorreto");
        assertEq(candidate.name, "Candidato 1", "Nome do candidato incorreto");
        assertEq(candidate.description, "Descricao 1", "Descricao incorreta");
        assertEq(candidate.imageUrl, "https://image1.com", "URL da imagem incorreta");
        assertEq(candidate.voteCount, 0, "Votos iniciais deveriam ser 0");
    }

    function test_AddMultipleCandidates() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.addCandidate("Candidato 3", "Desc 3", "https://img3.com");

        assertEq(voting.candidateCount(), 3, "Deveria ter 3 candidatos");
    }

    function test_RevertWhen_NonOwnerAddsCandidate() public {
        vm.prank(voter1);
        vm.expectRevert("Apenas o proprietario pode executar esta funcao");
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
    }

    function test_RevertWhen_AddCandidateWithEmptyName() public {
        vm.expectRevert("Nome do candidato nao pode ser vazio");
        voting.addCandidate("", "Desc 1", "https://img1.com");
    }

    function test_RemoveCandidate() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        
        vm.expectEmit(true, false, false, false);
        emit CandidateRemoved(1);
        
        voting.removeCandidate(1);

        // Candidato removido não deve ter nome
        (,string memory name,,,) = voting.candidates(1);
        assertEq(bytes(name).length, 0, "Candidato deveria estar removido");
    }

    function test_RevertWhen_RemovingNonexistentCandidate() public {
        vm.expectRevert("Candidato nao existe");
        voting.removeCandidate(1);
    }

    // ========== TESTES DE RETORNO DE CANDIDATOS ==========

    function test_GetAllCandidates() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.addCandidate("Candidato 3", "Desc 3", "https://img3.com");

        Voting.Candidate[] memory allCandidates = voting.getAllCandidates();

        assertEq(allCandidates.length, 3, "Deveria retornar 3 candidatos");
        assertEq(allCandidates[0].name, "Candidato 1", "Nome do primeiro candidato incorreto");
        assertEq(allCandidates[1].name, "Candidato 2", "Nome do segundo candidato incorreto");
        assertEq(allCandidates[2].name, "Candidato 3", "Nome do terceiro candidato incorreto");
    }

    function test_GetActiveCandidates() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.addCandidate("Candidato 3", "Desc 3", "https://img3.com");
        
        voting.removeCandidate(2); // Remove o candidato 2

        Voting.Candidate[] memory activeCandidates = voting.getActiveCandidates();

        assertEq(activeCandidates.length, 2, "Deveria retornar 2 candidatos ativos");
        assertEq(activeCandidates[0].id, 1, "ID incorreto");
        assertEq(activeCandidates[1].id, 3, "ID incorreto");
    }

    function test_GetSpecificCandidate() public {
        voting.addCandidate("Candidato Teste", "Descricao Teste", "https://test.com");

        Voting.Candidate memory candidate = voting.getCandidate(1);

        assertEq(candidate.id, 1, "ID incorreto");
        assertEq(candidate.name, "Candidato Teste", "Nome incorreto");
        assertEq(candidate.description, "Descricao Teste", "Descricao incorreta");
        assertEq(candidate.imageUrl, "https://test.com", "URL incorreta");
    }

    function test_RevertWhen_GettingNonexistentCandidate() public {
        vm.expectRevert("Candidato nao existe");
        voting.getCandidate(999);
    }

    function test_GetCandidateVotes() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);

        assertEq(voting.getCandidateVotes(1), 1, "Candidato deveria ter 1 voto");
    }

    // ========== TESTES DE VOTAÇÃO ==========

    function test_VoteSuccess() public {
        // Setup
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        uint256 initialBalance = address(voting).balance;

        // Espera evento
        vm.expectEmit(true, true, false, false);
        emit VoteCasted(voter1, 1, block.timestamp);

        // Vota
        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);

        // Verificações
        assertTrue(voting.hasVoted(voter1), "Eleitor deveria ter votado");
        assertEq(voting.votedForCandidateId(voter1), 1, "Eleitor deveria ter votado no candidato 1");
        assertEq(voting.getCandidateVotes(1), 1, "Candidato deveria ter 1 voto");
        assertEq(voting.totalVotes(), 1, "Total de votos deveria ser 1");
        assertEq(voting.totalFunds(), 0.025 ether, "Total de fundos incorreto");
        assertEq(address(voting).balance, initialBalance + 0.025 ether, "Saldo do contrato incorreto");
    }

    function test_MultipleVotesFromDifferentVoters() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.setVotingActive(true);

        // Voter1 vota no candidato 1
        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);

        // Voter2 vota no candidato 2
        vm.prank(voter2);
        voting.vote{value: 0.025 ether}(2);

        // Voter3 vota no candidato 1
        vm.prank(voter3);
        voting.vote{value: 0.025 ether}(1);

        // Verificações
        assertEq(voting.getCandidateVotes(1), 2, "Candidato 1 deveria ter 2 votos");
        assertEq(voting.getCandidateVotes(2), 1, "Candidato 2 deveria ter 1 voto");
        assertEq(voting.totalVotes(), 3, "Total de votos deveria ser 3");
        assertEq(voting.totalFunds(), 0.075 ether, "Total de fundos deveria ser 0.075 ether");
    }

    function test_RevertWhen_VotingIsNotActive() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        // Não ativa a votação

        vm.prank(voter1);
        vm.expectRevert("A votacao nao esta ativa");
        voting.vote{value: 0.025 ether}(1);
    }

    function test_RevertWhen_VotingWithIncorrectFee() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        // Tenta votar com valor incorreto
        vm.prank(voter1);
        vm.expectRevert("Taxa de voto incorreta. Envie exatamente 0.025 ETH");
        voting.vote{value: 0.01 ether}(1);
    }

    function test_RevertWhen_VotingWithExcessFee() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        // Tenta votar com valor maior
        vm.prank(voter1);
        vm.expectRevert("Taxa de voto incorreta. Envie exatamente 0.025 ETH");
        voting.vote{value: 0.1 ether}(1);
    }

    function test_RevertWhen_VotingTwice() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        // Primeiro voto (sucesso)
        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);

        // Segundo voto (deve falhar)
        vm.prank(voter1);
        vm.expectRevert("Voce ja votou");
        voting.vote{value: 0.025 ether}(1);
    }

    function test_RevertWhen_VotingForNonexistentCandidate() public {
        voting.setVotingActive(true);

        vm.prank(voter1);
        vm.expectRevert("Candidato nao existe");
        voting.vote{value: 0.025 ether}(999);
    }

    function test_RevertWhen_VotingForRemovedCandidate() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.removeCandidate(1);
        voting.setVotingActive(true);

        vm.prank(voter1);
        vm.expectRevert("Candidato foi removido");
        voting.vote{value: 0.025 ether}(1);
    }

    // ========== TESTES DE CONSULTAS DE VOTAÇÃO ==========

    function test_HasVoterVoted() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        assertFalse(voting.hasVoterVoted(voter1), "Eleitor nao deveria ter votado ainda");

        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);

        assertTrue(voting.hasVoterVoted(voter1), "Eleitor deveria ter votado");
    }

    function test_GetVotedCandidate() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.setVotingActive(true);

        assertEq(voting.getVotedCandidate(voter1), 0, "Eleitor nao deveria ter votado ainda");

        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(2);

        assertEq(voting.getVotedCandidate(voter1), 2, "Eleitor deveria ter votado no candidato 2");
    }

    // ========== TESTES DE VENCEDOR ==========

    function test_GetWinner() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.addCandidate("Candidato 3", "Desc 3", "https://img3.com");
        voting.setVotingActive(true);

        // Candidato 2 recebe mais votos
        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(2);
        
        vm.prank(voter2);
        voting.vote{value: 0.025 ether}(2);
        
        vm.prank(voter3);
        voting.vote{value: 0.025 ether}(1);

        Voting.Candidate memory winner = voting.getWinner();

        assertEq(winner.id, 2, "Candidato vencedor deveria ser o ID 2");
        assertEq(winner.name, "Candidato 2", "Nome do vencedor incorreto");
        assertEq(winner.voteCount, 2, "Vencedor deveria ter 2 votos");
    }

    function test_GetWinnerWithNoVotes() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");

        // Com candidatos mas sem votos, deve reverter
        vm.expectRevert("Nenhum vencedor encontrado");
        voting.getWinner();
    }

    function test_RevertWhen_GettingWinnerWithNoCandidates() public {
        vm.expectRevert("Nenhum candidato cadastrado");
        voting.getWinner();
    }

    // ========== TESTES DE ESTATÍSTICAS ==========

    function test_GetVotingStats() public {
        // Estado inicial
        (uint256 totalVotes, uint256 totalFunds, uint256 candidateCount, bool votingActive) = voting.getVotingStats();
        
        assertEq(totalVotes, 0, "Total de votos inicial incorreto");
        assertEq(totalFunds, 0, "Total de fundos inicial incorreto");
        assertEq(candidateCount, 0, "Contagem de candidatos inicial incorreta");
        assertFalse(votingActive, "Status de votacao inicial incorreto");

        // Adiciona candidatos e ativa votação
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.addCandidate("Candidato 2", "Desc 2", "https://img2.com");
        voting.setVotingActive(true);

        // Realiza votos
        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);
        
        vm.prank(voter2);
        voting.vote{value: 0.025 ether}(2);

        // Verifica estatísticas atualizadas
        (totalVotes, totalFunds, candidateCount, votingActive) = voting.getVotingStats();
        
        assertEq(totalVotes, 2, "Total de votos deveria ser 2");
        assertEq(totalFunds, 0.05 ether, "Total de fundos deveria ser 0.05 ether");
        assertEq(candidateCount, 2, "Contagem de candidatos deveria ser 2");
        assertTrue(votingActive, "Votacao deveria estar ativa");
    }

    function test_GetTotalVotes() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        assertEq(voting.getTotalVotes(), 0, "Total inicial deveria ser 0");

        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);

        assertEq(voting.getTotalVotes(), 1, "Total deveria ser 1");
    }

    // ========== TESTES DE FUNÇÕES ADMINISTRATIVAS ==========

    function test_SetVotingActive() public {
        assertFalse(voting.votingActive(), "Deveria iniciar desativada");

        vm.expectEmit(false, false, false, true);
        emit VotingStatusChanged(true);

        voting.setVotingActive(true);
        assertTrue(voting.votingActive(), "Deveria estar ativa");

        voting.setVotingActive(false);
        assertFalse(voting.votingActive(), "Deveria estar desativada");
    }

    function test_RevertWhen_NonOwnerSetsVotingActive() public {
        vm.prank(voter1);
        vm.expectRevert("Apenas o proprietario pode executar esta funcao");
        voting.setVotingActive(true);
    }

    function test_WithdrawFunds() public {
        voting.addCandidate("Candidato 1", "Desc 1", "https://img1.com");
        voting.setVotingActive(true);

        // Realiza votos
        vm.prank(voter1);
        voting.vote{value: 0.025 ether}(1);
        
        vm.prank(voter2);
        voting.vote{value: 0.025 ether}(1);

        uint256 contractBalance = address(voting).balance;
        uint256 ownerBalanceBefore = owner.balance;

        assertEq(contractBalance, 0.05 ether, "Saldo do contrato incorreto");

        // Saca fundos
        voting.withdrawFunds();

        assertEq(address(voting).balance, 0, "Saldo do contrato deveria ser 0");
        assertEq(owner.balance, ownerBalanceBefore + contractBalance, "Saldo do owner incorreto");
    }

    function test_RevertWhen_WithdrawingWithNoFunds() public {
        vm.expectRevert("Nao ha fundos para sacar");
        voting.withdrawFunds();
    }

    function test_RevertWhen_NonOwnerWithdrawsFunds() public {
        vm.prank(voter1);
        vm.expectRevert("Apenas o proprietario pode executar esta funcao");
        voting.withdrawFunds();
    }

    function test_TransferOwnership() public {
        assertEq(voting.owner(), owner, "Owner inicial incorreto");

        voting.transferOwnership(voter1);

        assertEq(voting.owner(), voter1, "Novo owner incorreto");
    }

    function test_RevertWhen_TransferringToZeroAddress() public {
        vm.expectRevert("Novo owner nao pode ser endereco zero");
        voting.transferOwnership(address(0));
    }

    function test_RevertWhen_NonOwnerTransfersOwnership() public {
        vm.prank(voter1);
        vm.expectRevert("Apenas o proprietario pode executar esta funcao");
        voting.transferOwnership(voter2);
    }

    function test_ReceiveEther() public {
        uint256 balanceBefore = address(voting).balance;

        // Envia ether diretamente para o contrato
        (bool success, ) = address(voting).call{value: 0.5 ether}("");
        
        assertTrue(success, "Envio de ether deveria ter sucesso");
        assertEq(address(voting).balance, balanceBefore + 0.5 ether, "Saldo incorreto");
    }
}

