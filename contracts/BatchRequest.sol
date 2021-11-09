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
    constructor(uint256 from, uint256 step, address factory) {

        uint256[] memory returnData = new uint256[](step);

        for(uint256 i = 0; i < step; i++) {
            address curr = IFactory(factory).allPairs(from+i);
            returnData[i] = IERC20(curr).balanceOf(curr);
        }

        bytes memory data = abi.encode(returnData);

        assembly {
            return(add(data, 64), add(mul(step, 32), 32))
        }
    }
}
