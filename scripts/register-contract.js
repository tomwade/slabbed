const hre = require("hardhat");

async function main() {
  const slab_contract_address = '0x6675a925fEdF18d6Fd019e69AdB6392132695DE3'

  const contract_address = '0xe63be4ed45d32e43ff9b53ae9930983b0367330a'
  const contract_chain = '1'

  const Slab = await hre.ethers.getContractFactory('Slab')
  const slab = await Slab.attach(slab_contract_address)

  let contract = await slab.approvedTokens(contract_chain, contract_address)
  if (contract.enabled == true) {
    console.warn('Contract already exists.')
  }
  else {
    await slab.addApprovedToken(contract_chain, contract_address)

    console.log('=== Contract Added ===')
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
