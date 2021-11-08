const ethers = require('ethers');
const async = require('async');
require('dotenv').config();

//const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle');


const UNI2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; //deployed: 10000835 

// const authSigner = new ethers.Wallet('0x0000000000000000000000000000000000000000000000000000000000000000')
// `authSigner` is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.
// This is an identifying key for signing payloads to establish reputation and whitelisting

// const flashbotsProvider = await FlashbotsBundleProvider.create(provider, authSigner)
// Flashbots provider requires passing in a standard provider and an auth signer

const main = async function () {
    const provider = new ethers.providers.WebSocketProvider(process.env.PROV);
    const abi = ["event PairCreated(address indexed token0, address indexed token1, address pair, uint)"];
    const factory = new ethers.Contract(UNI2_FACTORY, abi, provider);
    const filter = factory.filters.PairCreated();
/*
    for(let from = 10000835; from < 13541900; from+=step) {
        console.log("batch "+from+" to "+(from+step));
        query = await factory.queryFilter(filter, from, from+step);


        for(let i=0; i<query.length; i++) {
            const adr = query[i].args.pair;
            const tmp = new ethers.Contract(adr, ["function balanceOf(address owner) external view returns (uint)"], provider);
            console.log(adr+" : "+await tmp.balanceOf(adr));
        }
    }
*/
    const step = 10;
    let from = 10000835;
    let query;
    async.whilst
    (
        function() {return from < 13541900;},
        function(outer_cb)
        {
            let to = from+step;
            console.log("from "+from+" to "+to);
            let j = 0;
            query = factory.queryFilter(filter, from, to);
            async.whilst
            (
                function () { return j < query.length; },
                function (inner_cb) 
                {
                    const adr = query[i].args.pair;
                    const tmp = new ethers.Contract(adr, ["function balanceOf(address owner) external view returns (uint)"], provider);
                    console.log(adr+" : "+tmp.balanceOf(adr));
                    setTimeout(inner_cb, 0);
                },
                function () 
                {
                    from+=step;
                    outer_cb();
                }
            );
        }
    );
};



async function process_tx(hash) {
    for(let i=0; i<=10; i++) {
        const res = await provider.getTransaction(hash);
        if(res) return res;
    }
}

main();