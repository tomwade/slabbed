const hre = require("hardhat")
require('dotenv').config()


async function main() {
  const slab_query_contract_address = process.env.SLAB_QUERY_ADDRESS

  const to = '0x498E93Bc04955fCBAC04BCF1a3BA792f01Dbaa96'
  const contract_address = '0xe63be4ed45d32e43ff9b53ae9930983b0367330a'
  const contract_chain = '1'
  const token_id = '1'

  const SlabQuery = await hre.ethers.getContractFactory('SlabGradeQuery')
  const slabQuery = await SlabQuery.attach(slab_query_contract_address)

  let hit = await slabQuery.requestTokenGrade(to, contract_chain, contract_address, token_id)
  console.log(hit)
  
  console.log(await slabQuery.grade())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
