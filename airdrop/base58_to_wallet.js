// base58_to_wallet.js
const readline = require('readline');
const bs58 = require('bs58');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your base58 string: ', (base58) => {
  try {
    const wallet = bs58.decode(base58);
    console.log(wallet);
  } catch (error) {
    console.error('Error decoding base58:', error);
  } finally {
    rl.close();
  }
});

