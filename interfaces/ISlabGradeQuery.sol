// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity >=0.7.5;

interface ISlabGradeQuery {

    function requestTokenGrade(address _tokenOwner, uint256 _chainId, address _tokenContract, uint256 _tokenId) external returns (bytes32 requestId_);
    function fulfill(bytes32 _requestId, uint256 _grade) external;
    function grade() external returns (uint256 grade_);
    function withdrawLink() external;

}