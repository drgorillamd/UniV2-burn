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

    struct Result {
        address balance;
        address pool;
        uint256[] bla;
    }

    constructor(uint256 step) {
        // There is a max number of pool as a too big returned data times out the rpc
        Result[] memory returnData = new Result[](step);

        for(uint256 i = 0; i < step; i++) {
            returnData[i].balance = address(6969);
            returnData[i].pool = address(69);
            returnData[i].bla = new uint256[](2);
            returnData[i].bla[1] = 1;
        }

        bytes memory res = abi.encode(returnData);

        assembly {
            // abi encode store the mem address of the original data as first word, skip it
            // then skip the head (which is 32b offset), rest is length+data
            // load number of elements * 32 * 2 (2 words per element) + 32 (head)
            return(add(res, 32), mul(16, 32))
            // return(res, mload(0x40))
        }
    }
}