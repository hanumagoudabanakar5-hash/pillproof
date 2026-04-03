const algosdk = require('algosdk');

// Algorand Testnet
const ALGORAND_SERVER = 'https://testnet-api.algonode.cloud';
const ALGORAND_PORT = '';
const ALGORAND_TOKEN = '';

// Create Algod client
const algodClient = new algosdk.Algodv2(
  ALGORAND_TOKEN,
  ALGORAND_SERVER,
  ALGORAND_PORT
);

module.exports = {
  algodClient,
  ALGORAND_SERVER,
};
