const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

require('dotenv').config()

const { ethers } = require('ethers');

const fs = require('fs');

const Moralis = require('moralis/node');

app.use(cors())


CHAIN_TO_RPC = {
  1     : 'https://speedy-nodes-nyc.moralis.io/e94f9d135bce05286756f148/eth/mainnet',
  4     : 'https://speedy-nodes-nyc.moralis.io/e94f9d135bce05286756f148/eth/rinkeby',
  137   : 'https://speedy-nodes-nyc.moralis.io/e94f9d135bce05286756f148/polygon/mainnet',
  80001 : 'https://speedy-nodes-nyc.moralis.io/e94f9d135bce05286756f148/polygon/mumbai',
  43114 : 'https://speedy-nodes-nyc.moralis.io/e94f9d135bce05286756f148/avalanche/mainnet',
  43113 : 'https://speedy-nodes-nyc.moralis.io/e94f9d135bce05286756f148/avalanche/testnet'
}

CHAIN_TO_CODE = {
  1     : 'eth',
  4     : 'rinkeby',
  137   : 'polygon',
  80001 : 'mumbai',
  43114 : 'avalanche',
  43113 : 'avalanche testnet'
}


app.get('/', async (req, res) => {
  res.send('Coming soon.')
})


app.get('/slab/:tokenId', async (req, res) => {
  // https://sharp.pixelplumbing.com/api-composite
});

app.get('/meta/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId

  let meta_path = `./meta/${tokenId}.json`

  console.log(`Looking for meta file ${meta_path} : ${fs.existsSync(meta_path)}`)

  try {
    if (fs.existsSync(meta_path)) {
      // file exists
      const data = fs.readFileSync(meta_path, 'utf8')
      return res.json(JSON.parse(data))
    }
  } catch(err) {
    console.error(err)
  }

  // Connect to polygon mumbai
  const provider = await new ethers.providers.JsonRpcProvider(CHAIN_TO_RPC[80001])

  // Our contract abi
  let abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_chainlinkGrade",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        }
      ],
      "name": "ContractSupportAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        }
      ],
      "name": "ContractSupportRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "grade",
          "type": "uint256"
        }
      ],
      "name": "TokenSlabbed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        }
      ],
      "name": "addApprovedToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "approvedTokens",
      "outputs": [
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "supply",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        }
      ],
      "name": "removeApprovedToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "slabTokenId",
          "type": "uint256"
        }
      ],
      "name": "safeMintPhysical",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "slabbedTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "grade",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "minted",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_withdrawal",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

  // Connect to the contract
  const slabContract = await new ethers.Contract(process.env.SLAB_ADDRESS, abi, provider)

  // Ensure our token has been slabbed
  slab_token = await slabContract.slabbedTokens(tokenId)
  if (!slab_token.minted) {
    return res.sendStatus(404);
  }

  // Set up moralis to query additional NFT information
  const serverUrl = 'https://qrgkvnooci9p.usemoralis.com:2053/server'
  const appId = 'bFr2Sxukrsl0kRU2j5YOHOyMRJ4aIQFT0uuFrx1l'
  await Moralis.start({ serverUrl, appId })

  // Get our token meta data to help populate our data
  const options = {address: slab_token.tokenContract, token_id: String(slab_token.tokenId), chain: CHAIN_TO_CODE[slab_token.chainId]}
  const encoded_metadata = await Moralis.Web3API.token.getTokenIdMetadata(options)
  const nft_metadata = JSON.parse(encoded_metadata['metadata'])

  signature_path = './signatures/mapping.json'
  signature_name = "None"

  // Get our list of potential signatures
  try {
    if (fs.existsSync(signature_path)) {
      const signatures = JSON.parse(fs.readFileSync(signature_path, 'utf8'))

      // Check if we have a signature based on the owner address
      if (encoded_metadata.owner_of in signatures) {
        // Get our signature name
        signature_name = signatures[encoded_metadata.owner_of]['name']
      }
    }
  } catch(err) {
    console.error(err)
  }

  // Build our metadata
  nft_data = JSON.stringify({
    "name": `Slabbed ${encoded_metadata['name']} #${encoded_metadata['token_id']}`,
    "description": nft_metadata.description,
    "external_url": `https://slabbed.xyz/meta/${tokenId}`,
    "image": `https://slabbed.xyz/slab/${tokenId}.png`,
    "attributes": nft_metadata.attributes.concat([
      {
        "trait_type": "Signature",
        "value": signature_name
      },
      {
        "trait_type": "Grade",
        "value": String(slab_token.grade)
      }
    ])
  })

  // Write our file to avoid having to generate next time
  fs.writeFileSync(meta_path, nft_data)

  // Return JSON
  return res.json(JSON.parse(nft_data))
});


app.get('/grade/:owner/:chainId/:contract/:tokenId', async (req, res) => {
  const owner    = req.params.owner
  const chainId  = req.params.chainId
  const contract = req.params.contract
  const tokenId  = req.params.tokenId

  // Validate chain support
  if (!chainId in CHAIN_TO_RPC) {
    console.log(`Invalid chainId ${chainId} requested`)
    res.send('0')
    return
  }

  // Connect to our RPC
  const provider = await new ethers.providers.JsonRpcProvider(CHAIN_TO_RPC[chainId])


  let abi = [
    "function ownerOf(uint256 _tokenId) external view returns (address)"
  ]

  // Connect to the contract
  const readContract = await new ethers.Contract(contract, abi, provider)

  // Validate the owner
  if (await readContract.ownerOf(tokenId) != owner) {
    console.log('Owner does not own tokenId')
    res.send('0')
    return
  }

  // Set up moralis
  const serverUrl = 'https://qrgkvnooci9p.usemoralis.com:2053/server'
  const appId = 'bFr2Sxukrsl0kRU2j5YOHOyMRJ4aIQFT0uuFrx1l'
  await Moralis.start({ serverUrl, appId })

  // Get trade history
  const options = {address: contract, token_id: tokenId, chain: CHAIN_TO_CODE[chainId]}
  const transfers = await Moralis.Web3API.token.getWalletTokenIdTransfers(options)

  const total_transfers = transfers['total']

  // Get NFT age
  const mint_transfer = transfers['result'][total_transfers - 1]
  const mint_date = mint_transfer['block_timestamp']

  // Get the date the NFT was obtained
  const latest_transfer = transfers['result'][0]
  const obtained_ts = Date.now() - Date.parse(latest_transfer['block_timestamp'])

  const transfer_score = ((Math.min(total_transfers, 11) - 1) * 5)
  const obtained_score = Math.min(Math.floor(obtained_ts / (1000 * 60 * 60 * 24 * 30 * 3)) * 5, 50)

  const grade = 100 - transfer_score - obtained_score

  res.send(String(grade))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
