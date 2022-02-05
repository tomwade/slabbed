const hre = require("hardhat")
require('dotenv').config()


async function main() {
  const slab_contract_address = process.env.SLAB_ADDRESS

  let contract_address = '0xe63be4ed45d32e43ff9b53ae9930983b0367330a'
  let contract_chain = '1'

  const Slab = await hre.ethers.getContractFactory('Slab')
  const slab = await Slab.attach(slab_contract_address)

  // Approve RareBunniClub
  let contract = await slab.approvedTokens(contract_chain, contract_address)
  if (contract.enabled == true) {
    console.warn('Contract already exists.')
  }
  else {
    await slab.addApprovedToken(contract_chain, contract_address)

    console.log('=== RareBunniClub Contract Added ===')
    console.log('Address:', contract_address)
    console.log('Chain:', contract_chain)
  }

  contract_address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
  contract_chain = '1'

  // Approve BAYC
  contract = await slab.approvedTokens(contract_chain, contract_address)
  if (contract.enabled == true) {
    console.warn('Contract already exists.')
  }
  else {
    await slab.addApprovedToken(contract_chain, contract_address)

    console.log('=== BAYC Contract Added ===')
    console.log('Address:', contract_address)
    console.log('Chain:', contract_chain)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
