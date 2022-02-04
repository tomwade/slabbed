// SPDX-License-Identifier: MIT
pragma solidity >=0.7.5;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';

import '../interfaces/ISlabGradeQuery.sol';


/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract SlabGradeQuery is ISlabGradeQuery, ChainlinkClient {

    using Chainlink for Chainlink.Request;
  
    uint256 private slabGrade;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;


    /**
     * Construct to set LINK data
     */

    constructor() {
        oracle = 0x0bDDCD124709aCBf9BB3F824EbC61C87019888bb;
        jobId = '2bb15c3f9cfc4336b95012872ff05092';
        fee = 0.01 * 10 ** 18; // 0.01 LINK
    }


    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */

    function requestTokenGrade(address _tokenOwner, uint256 _chainId, address _tokenContract, uint256 _tokenId) override public returns (bytes32 requestId_) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Set the URL to perform the GET request on
        request.add('get', string(abi.encodePacked('https://api.slabbed.xyz/quality/', _tokenOwner, '/', _chainId, '/', _tokenContract, '/', _tokenId)));

        // Set the path to find the desired data in the API response
        request.add('path', 'data.grade');
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    
    /**
     * Receive the response in the form of uint256
     */

    function fulfill(bytes32 _requestId, uint256 _grade) override public recordChainlinkFulfillment(_requestId) {
    	slabGrade = _grade;
    }


    /**
     * Public getter for grade
     */
    function grade() override public returns (uint256 grade_) {
        grade_ = slabGrade;
    }


    /**
     * Allow for LINK to be withdrawn from contract
     */ 

    function withdrawLink() override external {
    	require(msg.sender == 0x498E93Bc04955fCBAC04BCF1a3BA792f01Dbaa96);

    	// link = IERC20(link)
    	// link.safeTransfer(msg.sender, link.balanceOf(address(self)));
    }

}
