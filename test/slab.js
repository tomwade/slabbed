const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Slab", function () {

  let deployer, alice, bob, users;

  let slab, slabGradeQuery;

  before(async function () {
    [deployer, alice, bob, ...users] = await ethers.getSigners();

    const SlabGradeQuery = await hre.ethers.getContractFactory("SlabGradeQuery");
    slabGradeQuery = await SlabGradeQuery.deploy();
    await slabGradeQuery.deployed();

    const Slab = await hre.ethers.getContractFactory("Slab");
    slab = await Slab.deploy(slabGradeQuery.address);
    await slab.deployed();
  })

  it("Can mint", async function () {
    expect(await slab.totalSupply()).to.equal(0)

    expect(await (await slab.approvedTokens('1', '0xe63be4ed45d32e43ff9b53ae9930983b0367330a')).enabled).to.equal(false)

    await slab.addApprovedToken('1', '0xe63be4ed45d32e43ff9b53ae9930983b0367330a')

    expect(await (await slab.approvedTokens('1', '0xe63be4ed45d32e43ff9b53ae9930983b0367330a')).enabled).to.equal(true)

    expect(
      await slab.safeMint(
        '0x498E93Bc04955fCBAC04BCF1a3BA792f01Dbaa96', '1', '0xe63be4ed45d32e43ff9b53ae9930983b0367330a', '1',
        {value: ethers.utils.parseEther('1')}
      )
    ).to.emit(slab, "TokenSlabbed")

    expect(await (await slab.approvedTokens('1', '0xe63be4ed45d32e43ff9b53ae9930983b0367330a')).supply).to.equal(1)

    expect(await slab.totalSupply()).to.equal(1)

    let token = await slab.slabbedTokens('0')
    expect(token.chainId).to.equal('1')
    expect(token.tokenContract).to.equal('0xE63bE4Ed45D32e43Ff9b53AE9930983B0367330a')
    expect(token.tokenId).to.equal('1')
    expect(token.grade).to.equal('100')
    expect(token.minted).to.equal(true)

    expect(await (await slab.approvedTokens('1', '0xe63be4ed45d32e43ff9b53ae9930983b0367330a')).supply).to.equal(1)
  });
});
