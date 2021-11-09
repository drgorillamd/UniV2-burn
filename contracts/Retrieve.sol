//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPair {
    function burn(address to) external returns (uint amount0, uint amount1);
}

contract Retrieve {

    address owner;

    constructor() {
        owner = msg.sender;
    }

    function fcukItAll(address target) external {
        require(msg.sender == owner, "nope");
        IPair(target).burn(msg.sender);
    }
}
