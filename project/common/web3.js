const { certificateHash } = require("./utils");
const { readCertificate } = require('./fs');
const { Web3, HttpProvider } = require('web3')

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "issuedBy",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "issuedTo",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "issuedTo",
				"type": "address"
			}
		],
		"name": "create",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			}
		],
		"name": "getCertificateHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const provider = new HttpProvider('https://sepolia.infura.io/v3/5a0dc84ebd18421d9178a59c873fcbb5');
const web3 = new Web3(provider);

const privateKey = '0x8b1f4c6222571f6f49dfae21b635214a5b2ee739762ebf4df2dc2356d252f5ff';

// Call the create function on the smart contract
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Address of the deployed CertificateContract
const contractAddress = '0x5c112888624971fBb0189C09486054800D507105';

// Create a contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Example function to interact with the smart contract
async function saveToBlockchain(certificate) {
  const { id, issuedTo } = certificate;
  const hash = await certificateHash(certificate);
  try {
    // console.log(account, id, issuedTo, hash)
    const method_abi = contract.methods.create(id, hash, issuedTo, "kkk", "iii").encodeABI();

    const tx = {
      from: account.address,
      to: contract.options.address,
      data: method_abi,
      value: '0',
      gasPrice: '100000000000',
    };

    const gas_estimate = await web3.eth.estimateGas(tx);
    tx.gas = gas_estimate;
    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
    console.log("Raw transaction data: " + ( signedTx).rawTransaction);
    // Sending the transaction to the network
    const receipt = await web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .once("transactionHash", (txhash) => {
        console.log(`Certificate Created Successfully!`);
        console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
      });
  } catch (error) {
    console.error('Error creating certificate:', error);
  }
}

async function readCertificateHashFromBlockchain(id) {
  try {
    const result = await contract.methods.getCertificateHash(id).call();
    return result;
  } catch (error) {
    console.error('Error creating certificate:', error);
  }
}

module.exports = {
  readCertificateHashFromBlockchain,
  saveToBlockchain,
}

// async function main(account) {
//   // const certificate = await readCertificate();
//   // await saveToBlockchain(certificate, account);
//   await readCertificateHashFromBlockchain("20b9b90ddfed580b1cdc")
// }

// main(account)