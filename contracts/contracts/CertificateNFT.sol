// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CertificateNFT
 * @notice Soulbound ERC-721 certificates for Lobster University skill completion.
 *         Each token records skill name, level (1-6), score, and timestamp.
 *         Transfers are disabled — certificates are non-transferable.
 */
contract CertificateNFT is ERC721, Ownable {
    using Strings for uint256;

    struct Certificate {
        string skillName;
        uint8 level;       // 1-6
        uint16 score;      // 0-10000 (basis points for precision)
        uint64 timestamp;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => Certificate) private _certificates;
    mapping(address => bool) public certifiers;

    event CertifierUpdated(address indexed certifier, bool authorized);
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string skillName,
        uint8 level,
        uint16 score
    );

    error NotCertifier(address caller);
    error InvalidLevel(uint8 level);
    error SoulboundTransfer();

    modifier onlyCertifier() {
        if (!certifiers[msg.sender] && msg.sender != owner()) {
            revert NotCertifier(msg.sender);
        }
        _;
    }

    constructor() ERC721("Lobster Certificate", "LCERT") Ownable(msg.sender) {}

    /**
     * @notice Grant or revoke certifier role.
     */
    function setCertifier(address certifier, bool authorized) external onlyOwner {
        require(certifier != address(0), "CertificateNFT: zero address");
        certifiers[certifier] = authorized;
        emit CertifierUpdated(certifier, authorized);
    }

    /**
     * @notice Issue a soulbound certificate.
     * @param to        Recipient address.
     * @param skillName Name of the completed skill.
     * @param level     Mastery level (1-6).
     * @param score     Score in basis points (0-10000).
     * @return tokenId  The minted token ID.
     */
    function issueCertificate(
        address to,
        string calldata skillName,
        uint8 level,
        uint16 score
    ) external onlyCertifier returns (uint256 tokenId) {
        require(to != address(0), "CertificateNFT: mint to zero address");
        if (level < 1 || level > 6) revert InvalidLevel(level);
        require(score <= 10000, "CertificateNFT: score exceeds 10000");

        tokenId = _nextTokenId++;
        _certificates[tokenId] = Certificate({
            skillName: skillName,
            level: level,
            score: score,
            timestamp: uint64(block.timestamp)
        });

        _safeMint(to, tokenId);

        emit CertificateIssued(tokenId, to, skillName, level, score);
    }

    /**
     * @notice Get certificate data for a token.
     */
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        _requireOwned(tokenId);
        return _certificates[tokenId];
    }

    /**
     * @notice Returns on-chain Base64-encoded JSON metadata.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        Certificate memory cert = _certificates[tokenId];

        string memory json = string(
            abi.encodePacked(
                '{"name":"Lobster Certificate #',
                tokenId.toString(),
                '","description":"Skill completion certificate from Lobster University",'
                '"attributes":[{"trait_type":"Skill","value":"',
                cert.skillName,
                '"},{"trait_type":"Level","display_type":"number","value":',
                uint256(cert.level).toString(),
                '},{"trait_type":"Score","display_type":"number","value":',
                uint256(cert.score).toString(),
                '},{"trait_type":"Timestamp","display_type":"date","value":',
                uint256(cert.timestamp).toString(),
                "}]}"
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    /**
     * @dev Block all transfers — soulbound token.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransfer();
        }
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Total number of certificates issued.
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}
