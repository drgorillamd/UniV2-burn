//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IFactory {
    function allPairs(uint256 idx) external returns (address);
    function allPairsLength() external view returns (uint);
}

interface IERC20 {
    function balanceOf(address adr) external returns (uint256);
}

contract BatchRequest {
    constructor(uint256 from, uint256 step) {

        uint256[] memory returnData = new uint256[](step);

        for(uint256 i = 0; i < step; i++) {
            address curr = IFactory(address(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f)).allPairs(from+i);
            returnData[i] = IERC20(curr).balanceOf(curr);
            console.log(returnData[i]);
        }

        bytes memory data = abi.encode(returnData);

        assembly {
            return(returnData, 96)
        }
    }
}
