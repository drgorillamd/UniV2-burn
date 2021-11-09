const { ethers, waffle } = require("hardhat");
const { defaultAbiCoder, Interface } = require ("ethers/lib/utils");
const async = require('async');
const { bytecode } = require('../artifacts/contracts/BatchRequest.sol/BatchRequest.json');

require('dotenv').config();


const FACTORY = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4'; //deployed: 10000835

//uniswap: 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
//sushi: 0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac
//sheba : 0x115934131916C8b277DD010Ee02de363c09d037c
//sake: 0x75e48C954594d64ef9613AeEF97Ad85370F13807
//CRO : 0x9DEB29c9a4c7A88a3C0257393b7f3335338D9A9D

//pancake: 0xBCfCcbde45cE874adCB698cC183deBcF17952812
//sushi bsc: 0xc35DADB65012eC5796536bD9864eD8773aBc74C4
//pantherswap: 0x670f55c6284c629c23baE99F585e3f17E8b9FC31

const abi = ['function allPairsLength() external view returns (uint)'];

const main = async function () {
    const provider = new ethers.providers.WebSocketProvider(process.env.BSC_PROV);
    //const provider = waffle.provider;
    const step = 200;
    const fact = new ethers.Contract(FACTORY, abi, provider);
    const nb_pair = await fact.allPairsLength();
    console.log("Nb pairs : "+nb_pair.toString());

    for(let i=0; i<nb_pair; i+=step) {
        let inputData = ethers.utils.defaultAbiCoder.encode(["uint256", "uint256", "address"],[i, step, FACTORY]);
        const payload = bytecode.concat(inputData.slice(2));
        const returnedData = await provider.call({data: payload});
        const arr = '0x'+returnedData.slice(66);
        const [decoded] = ethers.utils.defaultAbiCoder.decode(['uint256['+step+']'], arr);
        for(let j=0; j<decoded.length; j++) {
            if(decoded[j].gt(0)) console.log("FOUND @ "+(i+j));
        }
        console.log(i);
    }
    console.log("done");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
