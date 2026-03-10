// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkillMarketplace
 * @notice Marketplace for listing, buying, and rating skill packages.
 *         Prices are denominated in KARMA tokens.
 *         Platform takes a configurable fee (default 5%).
 */
contract SkillMarketplace is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Listing {
        address seller;
        uint256 price;       // in KARMA (18 decimals)
        bool active;
        uint256 totalRating; // sum of all ratings
        uint256 ratingCount; // number of ratings
    }

    IERC20 public immutable karmaToken;
    uint256 public platformFeeBps; // basis points (500 = 5%)
    uint256 public constant MAX_FEE_BPS = 2000; // 20% cap

    mapping(bytes32 => Listing) public listings;
    mapping(bytes32 => mapping(address => bool)) public hasPurchased;
    mapping(bytes32 => mapping(address => bool)) public hasRated;

    uint256 public accumulatedFees;

    event SkillListed(bytes32 indexed skillId, address indexed seller, uint256 price);
    event SkillDelisted(bytes32 indexed skillId);
    event SkillPriceUpdated(bytes32 indexed skillId, uint256 newPrice);
    event SkillPurchased(bytes32 indexed skillId, address indexed buyer, uint256 price, uint256 fee);
    event SkillRated(bytes32 indexed skillId, address indexed rater, uint8 rating);
    event PlatformFeeUpdated(uint256 newFeeBps);
    event FeesWithdrawn(address indexed to, uint256 amount);

    error SkillAlreadyListed(bytes32 skillId);
    error SkillNotFound(bytes32 skillId);
    error NotSeller(bytes32 skillId);
    error AlreadyPurchased(bytes32 skillId);
    error NotPurchased(bytes32 skillId);
    error AlreadyRated(bytes32 skillId);
    error InvalidRating(uint8 rating);
    error FeeTooHigh(uint256 feeBps);
    error ZeroPrice();
    error CannotBuyOwnSkill();

    constructor(address _karmaToken) Ownable(msg.sender) {
        require(_karmaToken != address(0), "SkillMarketplace: zero token address");
        karmaToken = IERC20(_karmaToken);
        platformFeeBps = 500; // 5% default
    }

    /**
     * @notice List a skill for sale.
     * @param skillId Unique identifier (keccak256 of package name).
     * @param price   Price in KARMA tokens.
     */
    function listSkill(bytes32 skillId, uint256 price) external {
        if (price == 0) revert ZeroPrice();
        if (listings[skillId].seller != address(0)) revert SkillAlreadyListed(skillId);

        listings[skillId] = Listing({
            seller: msg.sender,
            price: price,
            active: true,
            totalRating: 0,
            ratingCount: 0
        });

        emit SkillListed(skillId, msg.sender, price);
    }

    /**
     * @notice Delist a skill (seller only).
     */
    function delistSkill(bytes32 skillId) external {
        Listing storage listing = listings[skillId];
        if (listing.seller == address(0)) revert SkillNotFound(skillId);
        if (listing.seller != msg.sender) revert NotSeller(skillId);

        listing.active = false;
        emit SkillDelisted(skillId);
    }

    /**
     * @notice Update skill price (seller only).
     */
    function updatePrice(bytes32 skillId, uint256 newPrice) external {
        if (newPrice == 0) revert ZeroPrice();
        Listing storage listing = listings[skillId];
        if (listing.seller == address(0)) revert SkillNotFound(skillId);
        if (listing.seller != msg.sender) revert NotSeller(skillId);

        listing.price = newPrice;
        emit SkillPriceUpdated(skillId, newPrice);
    }

    /**
     * @notice Buy a skill. Transfers KARMA from buyer to seller minus platform fee.
     */
    function buySkill(bytes32 skillId) external nonReentrant {
        Listing storage listing = listings[skillId];
        if (listing.seller == address(0) || !listing.active) revert SkillNotFound(skillId);
        if (msg.sender == listing.seller) revert CannotBuyOwnSkill();
        if (hasPurchased[skillId][msg.sender]) revert AlreadyPurchased(skillId);

        uint256 fee = (listing.price * platformFeeBps) / 10000;
        uint256 sellerAmount = listing.price - fee;

        hasPurchased[skillId][msg.sender] = true;
        accumulatedFees += fee;

        karmaToken.safeTransferFrom(msg.sender, listing.seller, sellerAmount);
        if (fee > 0) {
            karmaToken.safeTransferFrom(msg.sender, address(this), fee);
        }

        emit SkillPurchased(skillId, msg.sender, listing.price, fee);
    }

    /**
     * @notice Rate a purchased skill (1-5 stars).
     */
    function rateSkill(bytes32 skillId, uint8 rating) external {
        if (rating < 1 || rating > 5) revert InvalidRating(rating);
        if (!hasPurchased[skillId][msg.sender]) revert NotPurchased(skillId);
        if (hasRated[skillId][msg.sender]) revert AlreadyRated(skillId);

        hasRated[skillId][msg.sender] = true;
        listings[skillId].totalRating += rating;
        listings[skillId].ratingCount += 1;

        emit SkillRated(skillId, msg.sender, rating);
    }

    /**
     * @notice Get average rating for a skill (scaled by 100 for precision).
     * @return average Rating * 100 (e.g. 450 = 4.50 stars). Returns 0 if no ratings.
     */
    function getAverageRating(bytes32 skillId) external view returns (uint256 average) {
        Listing storage listing = listings[skillId];
        if (listing.ratingCount == 0) return 0;
        return (listing.totalRating * 100) / listing.ratingCount;
    }

    /**
     * @notice Set the platform fee (owner only).
     * @param newFeeBps New fee in basis points (max 2000 = 20%).
     */
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > MAX_FEE_BPS) revert FeeTooHigh(newFeeBps);
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }

    /**
     * @notice Withdraw accumulated platform fees (owner only).
     */
    function withdrawFees(address to) external onlyOwner {
        require(to != address(0), "SkillMarketplace: withdraw to zero address");
        uint256 amount = accumulatedFees;
        require(amount > 0, "SkillMarketplace: no fees to withdraw");

        accumulatedFees = 0;
        karmaToken.safeTransfer(to, amount);

        emit FeesWithdrawn(to, amount);
    }

    /**
     * @notice Compute the skillId from a package name.
     */
    function computeSkillId(string calldata packageName) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(packageName));
    }
}
