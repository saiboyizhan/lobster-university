// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../CertificateNFT.sol";

/**
 * @title CertificateNFTHarness
 * @notice Test-only contract that exposes internal _burn for testing soulbound burn protection.
 */
contract CertificateNFTHarness is CertificateNFT {
    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }
}
