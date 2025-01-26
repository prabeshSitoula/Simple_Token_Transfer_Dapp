// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    // Mapping to keep track of balances
    mapping(address => uint256) public balances;

    // Event to log transfers
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Constructor to assign initial supply to contract deployer
    constructor(uint256 initialSupply) {
        balances[msg.sender] = initialSupply;
    }

    // Function to transfer tokens from caller to recipient
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        
        // Deduct tokens from sender and add to recipient
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
