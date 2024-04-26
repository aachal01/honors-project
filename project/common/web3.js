const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuedBy",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuedTo",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "createdAt",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "expireAt",
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
        "indexed": false,
        "internalType": "struct CertificateContract.Certificate",
        "name": "certificate",
        "type": "tuple"
      }
    ],
    "name": "CertificateWrite",
    "type": "event"
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
      },
      {
        "internalType": "string",
        "name": "expireAt",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "createdAt",
        "type": "string"
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
        "internalType": "string",
        "name": "createdAt",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expireAt",
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
  }
]

async function main() {
  
  const contractAddress = '0x03398008418eBb0711B545f4AE25503AEb93A593';
  const contract = new web3.eth.Contract(abi, contractAddress);
  contract.
}

main()