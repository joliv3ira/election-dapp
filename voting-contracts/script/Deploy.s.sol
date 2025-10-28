// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Voting} from "../src/Voting.sol";

/**
 * @title DeployVoting
 * @dev Script para deploy do contrato Voting usando variável de ambiente
 * @notice Para executar: forge script script/Deploy.s.sol:DeployVoting --rpc-url <your_rpc_url> --broadcast
 */
contract DeployVoting is Script {
    function run() external returns (Voting) {
        // Pega a chave privada do arquivo .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Inicia o broadcast das transações com a chave privada
        vm.startBroadcast(deployerPrivateKey);

        // Deploy do contrato Voting
        Voting voting = new Voting();

        // Para o broadcast
        vm.stopBroadcast();

        return voting;
    }
}

