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

        for(uint256 i = 0; i < step; i++) {
            address curr = IFactory(factory).allPairs(from+i);
            returnData[i] = IERC20(curr).balanceOf(curr);
        }
    
        bytes memory data = abi.encode(returnData);
        
        // This is the way to return data from a constructor
        assembly {
            return(add(data, 64), add(mul(step, 32), 32))
        }
    }
    
}
