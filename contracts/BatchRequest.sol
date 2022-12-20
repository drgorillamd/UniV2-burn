//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFactory {
    function allPairs(uint256 idx) external returns (address);
    function allPairsLength() external view returns (uint);
}

interface IERC20 {
    function balanceOf(address adr) external returns (uint256);
}

/**
 @dev This contract is not meant to be deployed. Instead, use a static call with the
      deployment bytecode as payload.
 */
contract BatchRequest {
    constructor(uint256 from, uint256 step, address factory) {
        // There is a max number of pool as a too big returned data times out the rpc
        uint256[] memory returnData = new uint256[](step);

        // Query every pool balance
        for(uint256 i = 0; i < step; i++) {
            address curr = IFactory(factory).allPairs(from+i);
            returnData[i] = IERC20(curr).balanceOf(curr);
        }

        assembly {
            // Return from the start of the array up to 32*nb of elements
            // and add another 32 words for the size (ie the first data)
            return(returnData, add(mul(step, 32), 32))
        }
    }
}