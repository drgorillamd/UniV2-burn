const { ethers, waffle } = require("hardhat");
const { defaultAbiCoder, Interface } = require ("ethers/lib/utils");
const async = require('async');
const { bytecode } = require('../artifacts/contracts/BatchRequest.sol/BatchRequest.json');

require('dotenv').config();

const main = async function () {
  // Set the scene and check how many pairs to check
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROV);
  const step = 2; // Batch 200 calls

  // Get the bytecode and append the consturcot args
  let inputData = ethers.utils.defaultAbiCoder.encode(["uint256"], [step]);
  const payload = bytecode.concat(inputData.slice(2));

  // Call the deployment transaction
  const returnedData = await provider.call({ data: payload });

  console.log(returnedData.slice(2).replace(/(.{64})/g, "$1\n"));

  //Parse the returned value:
  // Remove the first word which is the call success (bool success)
  // and keep '0x' at the start
  //const arr = "0x" + returnedData.slice(66);

  // The uint array length is the number of elements returned minus one
  // (ie the initial size) - this is for reusability, as step can be used/is known upfront
  //const arrLen = (arr.length - 2 - 64) / 32;

  //console.log(arrLen);
  // Abi decode the array as a fixed length array of uint256
  const [decoded] = ethers.utils.defaultAbiCoder.decode(
    ["tuple(address,address,uint256[])[]"],
    returnedData
  );
  console.log(decoded);
};;;;

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
