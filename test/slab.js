const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Slab", function () {

  let slab, slabGradeQuery;

  before(async function () {
    const SlabGradeQuery = await hre.ethers.getContractFactory("SlabGradeQuery");
    slabGradeQuery = await SlabGradeQuery.deploy();
    await slabGradeQuery.deployed();

    const Slab = await hre.ethers.getContractFactory("Slab");
    slab = await Slab.deploy(slabGradeQuery.address);
    await slab.deployed();
  })

  it("...", async function () {
    console.log('Compile successful')
  });
});
