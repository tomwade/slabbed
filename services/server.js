const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

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

SLAB_CONTRACT = '0xf8458c0D0b2Ba7bf8A760c9257B3333cDb4F803E';


app.get('/', async (req, res) => {
  res.send('Coming soon.')
})


app.get('/meta/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId

  // Connect to polygon mumbai
  const provider = await new ethers.providers.JsonRpcProvider(CHAIN_TO_RPC[80001])

  console.log('bbb')
  let abi = [
    'function slabbedTokens(uint256 _tokenId) public view'
  ]

  // Connect to the contract
  const slabContract = await new ethers.Contract(SLAB_CONTRACT, abi, provider)

  console.log(await slabContract.slabbedTokens(tokenId))
  res.send('OK')
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

  console.log(`connected on chain ${chainId}`)

  // Connect to our RPC
  const provider = await new ethers.providers.JsonRpcProvider(CHAIN_TO_RPC[chainId])
  
  console.log('Provider has been connected')

  let abi = [
    "function ownerOf(uint256 _tokenId) external view returns (address)"
  ]

  // Connect to the contract
  const readContract = await new ethers.Contract(contract, abi, provider)
  
  console.log('Contract has read access')

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

  res.send((grade).toString())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
