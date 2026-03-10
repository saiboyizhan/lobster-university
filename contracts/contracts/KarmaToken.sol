// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KarmaToken
 * @notice BEP-20 (ERC-20) reputation token for Lobster University.
 *         Owner mints KARMA as rewards; tokens are freely tradable.
 *         Initial supply is 0 — all tokens are minted on demand.
 */
contract KarmaToken is ERC20, ERC20Burnable, Ownable {
    event KarmaEarned(address indexed account, uint256 amount, string reason);
    event KarmaSpent(address indexed account, uint256 amount, string reason);

    constructor() ERC20("Lobster Karma", "KARMA") Ownable(msg.sender) {}

    /**
     * @notice Mint KARMA to an account (owner only).
     * @param to     Recipient address.
     * @param amount Amount of KARMA (18 decimals).
     * @param reason Human-readable reason for the reward.
     */
    function mint(address to, uint256 amount, string calldata reason) external onlyOwner {
        require(to != address(0), "KarmaToken: mint to zero address");
        require(amount > 0, "KarmaToken: mint zero amount");
        _mint(to, amount);
        emit KarmaEarned(to, amount, reason);
    }

    /**
     * @notice Burn KARMA from caller with a recorded reason.
     * @param amount Amount of KARMA to burn.
     * @param reason Human-readable reason for spending.
     */
    function spend(uint256 amount, string calldata reason) external {
        require(amount > 0, "KarmaToken: spend zero amount");
        _burn(msg.sender, amount);
        emit KarmaSpent(msg.sender, amount, reason);
    }
}
