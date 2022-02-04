const hre = require("hardhat");

async function main() {
  await hre.run('compile');

  // We get the contract to deploy
  const SlabGradeQuery = await hre.ethers.getContractFactory("SlabGradeQuery");
  const slabGradeQuery = await SlabGradeQuery.deploy();

  await slabGradeQuery.deployed();

  console.log("SlabGradeQuery deployed to:", slabGradeQuery.address);

  const Slab = await hre.ethers.getContractFactory("Slab");
  const slab = await Slab.deploy(slabGradeQuery.address);

  await slab.deployed();

  console.log("Slab deployed to:", slab.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
