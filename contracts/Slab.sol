     // SPDX-License-Identifier: MIT
pragma solidity >=0.7.5;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import '../interfaces/ISlabGradeQuery.sol';


/**
 * @author Slabbed.xyz
 * @title Slab
 */

contract Slab is ERC721, Pausable, AccessControl, ERC721Burnable {

    using Counters for Counters.Counter;

    struct approvedTokenData {
        bool enabled;                       // If we are currently accepting this contract
        uint256 supply;                     // Number of minted slabs
        mapping(uint256 => address) slabs;  // Maps tokenId => original minter
    }

    struct slabbedToken {
        uint256 chainId;
        address tokenContract;
        uint256 tokenId;
        uint256 grade;
        bool minted;
    }

    // A mapping of chain => contract => data
    mapping(uint256 => mapping(address => approvedTokenData)) public approvedTokens;

    // A mapping of tokenId => slabbedToken
    mapping(uint256 => slabbedToken) public slabbedTokens;

    Counters.Counter private _tokenIdCounter;

    event TokenSlabbed(address to, uint tokenId, uint256 grade);
    event ContractSupportAdded(uint256 chainId, address tokenContract);
    event ContractSupportRemoved(uint256 chainId, address tokenContract);

    uint MINT_PRICE     = 1000000000000000000;  // 1 MATIC
    uint PHYSICAL_PRICE = 50000000000000000000; // 50 MATIC

    mapping(uint256 => bool) physicalDispatched;

    address chainlinkGrade;


    /**
     * @dev Initialises our contract.
     */

    constructor(address _chainlinkGrade) ERC721("Slab", "SLAB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        chainlinkGrade = _chainlinkGrade;
    }


    /**
     * @dev Used in calculation of our token metadata URI
     * 
     * @return string Base URI of our token metadata
     */

    function _baseURI() internal pure override returns (string memory) {
        return "https://meta.slabbed.xyz/";
    }


    /**
     * @dev Allows our PAUSER role to prevent minting process
     */

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }


    /**
     * @dev Allows our PAUSER role to reactivate minting process
     */

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }


    /**
     *
     */

    function addApprovedToken(uint256 chainId, address tokenContract) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(approvedTokens[chainId][tokenContract].enabled == false);
        approvedTokens[chainId][tokenContract].enabled = true;
    }


    /**
     *
     */

    function removeApprovedToken(uint256 chainId, address tokenContract) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(approvedTokens[chainId][tokenContract].enabled == true);
        approvedTokens[chainId][tokenContract].enabled = false;
    }


    /**
     *
     */

    function safeMint(address to, uint256 chainId, address tokenContract, uint256 tokenId) public payable {
        uint256 tokenMintId = _tokenIdCounter.current();

        require(msg.value >= MINT_PRICE, 'Incorrect amount sent');
        require(approvedTokens[chainId][tokenContract].enabled, 'Token contract not approved');
        require(approvedTokens[chainId][tokenContract].slabs[tokenId] == address(0), 'Token contract already slabbed');
        // require(address(tokenContract).ownerOf(tokenId) == to, 'Owner does not own token');

        approvedTokens[chainId][tokenContract].slabs[tokenId] = to;
        approvedTokens[chainId][tokenContract].supply = approvedTokens[chainId][tokenContract].supply + 1;

        ISlabGradeQuery slabGradeQuery = ISlabGradeQuery(chainlinkGrade);
        slabGradeQuery.requestTokenGrade(to, chainId, tokenContract, tokenId);

        // We should have our grade ready here
        uint256 grade = slabGradeQuery.grade();
        require(grade > 0, 'Invalid mint attempt');

        // Increment our tokenId counter
        _tokenIdCounter.increment();

        // Mint our token and transfer it
        _safeMint(to, tokenMintId);

        slabbedTokens[tokenMintId].chainId = chainId;
        slabbedTokens[tokenMintId].tokenContract = tokenContract;
        slabbedTokens[tokenMintId].tokenId = tokenId;
        slabbedTokens[tokenMintId].grade = grade;
        slabbedTokens[tokenMintId].minted = true;

        require(slabbedTokens[tokenMintId].minted, 'Unable to mint');

        // Emit our minting event
        emit TokenSlabbed(to, tokenMintId, grade);
    }


    /**
     *
     */

    function safeMintPhysical(uint256 slabTokenId) public payable {
        // ..
    }


    /**
     * @dev Hook that is called before any token transfer. This includes minting and burning.
     * 
     * @param from Address token is being transferred from.
     * @param to Address token is being transferred to.
     * @param tokenId Unique ID of the token being transferred.
     */

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }


    /**
     * @dev Allows that the beneficiary can receive deposited ETH.
     *
     * @param _withdrawal WEI amount to be withdrawn.
     */

    function withdraw(uint256 _withdrawal) public onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool success, ) = msg.sender.call{value: _withdrawal}("");
        require(success, "Unable to process withdrawal.");
    }

    function totalSupply() public view returns (uint) {
        return _tokenIdCounter.current();
    }


    /**
     * @dev Fallback function executed on a call if no other functions matches.
     */

    fallback() external payable {
        revert();
    }


    /**
     * @dev Fallback function executed on a payable call if no other functions matches.
     */

    receive() external payable {
        revert();
    }


    /**
     *
     */

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
