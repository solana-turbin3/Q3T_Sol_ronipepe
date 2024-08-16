// wallet_to_base58.js
const bs58 = require("bs58");
const walletKey = require("./wba-wallet.json");

const wallet = Buffer.from(walletKey);

const base58 = bs58.encode(wallet);
console.log(base58);
