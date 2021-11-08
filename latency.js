const { ethers } = require("ethers");
require('dotenv').config();
const providerWs = new ethers.providers.WebSocketProvider(process.env.PROV);

function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

var cnt = 0;
var s = 0;

providerWs.on('block', (blockNumber) => {
    providerWs.getBlock(blockNumber).then(
        res => {
            let ts = getTimestamp();
            let diff = ts-res.timestamp;
            cnt++;
            s+=diff;
            console.log('[' + diff + '][' + ts + '][' + res.timestamp + '][' + res.number + '][' + res.hash + '][' + res.transactions.length + ']');
            if (0 == cnt%10) {
                console.log('[' + cnt + '][' + s/cnt  + ']');
            }
        },
        err => {
            console.log('ERROR [' + err + ']');
        }
    );
});
