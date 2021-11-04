const ethers = require('ethers');
require('dotenv').config();
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle');
let provider;

const UNI2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; //deployed: 10000835 

// const authSigner = new ethers.Wallet('0x0000000000000000000000000000000000000000000000000000000000000000')
// `authSigner` is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.
// This is an identifying key for signing payloads to establish reputation and whitelisting

// const flashbotsProvider = await FlashbotsBundleProvider.create(provider, authSigner)
// Flashbots provider requires passing in a standard provider and an auth signer

const main = async function () {
    //provider = new ethers.providers.WebSocketProvider(process.env.PROV);
    provider = new ethers.providers.JsonRpcProvider(process.env.HTTP_PROV);
    //provider = new ethers.providers.WebSocketProvider(process.env.MORALIS_PROV);
    const abi = ["event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
                    "function allPairsLength() external view returns (uint)"]
    const factory = new ethers.Contract(UNI2_FACTORY, abi, provider);

    const filter = factory.filters.PairCreated();
    console.log(filter);

    provider.resetEventsBlock(10000835);

    //const query = await factory.queryFilter(filter);
    const query = await provider.getLogs(filter);
    console.log(query);

/*
    factory.on('PairCreated', (token0, token1, pair) => {
        console.log(token0+" x "+token1+" @ "+pair);
    })
    */

/*
    provider.on("pending", async (tx) => {
        console.log(tx);
    });
*/
    provider._websocket.on("error", async () => {
        console.log(`Unable to connect, retrying in 3s...`);
        setTimeout(init, 3000);
    }); 
    
    provider._websocket.on("close", async (code) => {
        console.log(
        `Connection lost with code ${code}! Attempting reconnect in 3s...`
        );
        provider._websocket.terminate();
        setTimeout(init, 3000);
    });

};

async function process_tx(hash) {
    for(let i=0; i<=10; i++) {
        const res = await provider.getTransaction(hash);
        if(res) return res;
    }
}

main();



/*
const signedBundle = await flashbotsProvider.signBundle([
    {
        signer: SOME_SIGNER_TO_SEND_FROM,
        transaction: SOME_TRANSACTION_TO_SEND
    }
])

const bundleReceipt = await flashbotsProvider.sendRawBundle(signedBundle, TARGET_BLOCK_NUMBER)
*/