import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { KarmaToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("KarmaToken", () => {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const KarmaToken = await ethers.getContractFactory("KarmaToken");
    const karma = await KarmaToken.deploy();
    return { karma, owner, alice, bob };
  }

  describe("Deployment", () => {
    it("should have correct name and symbol", async () => {
      const { karma } = await loadFixture(deployFixture);
      expect(await karma.name()).to.equal("Lobster Karma");
      expect(await karma.symbol()).to.equal("KARMA");
    });

    it("should have 18 decimals", async () => {
      const { karma } = await loadFixture(deployFixture);
      expect(await karma.decimals()).to.equal(18);
    });

    it("should have zero initial supply", async () => {
      const { karma } = await loadFixture(deployFixture);
      expect(await karma.totalSupply()).to.equal(0);
    });

    it("should set deployer as owner", async () => {
      const { karma, owner } = await loadFixture(deployFixture);
      expect(await karma.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", () => {
    it("should allow owner to mint tokens", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await karma.mint(alice.address, amount, "completed skill");
      expect(await karma.balanceOf(alice.address)).to.equal(amount);
    });

    it("should emit KarmaEarned event on mint", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("50");
      await expect(karma.mint(alice.address, amount, "reward"))
        .to.emit(karma, "KarmaEarned")
        .withArgs(alice.address, amount, "reward");
    });

    it("should increase total supply on mint", async () => {
      const { karma, alice, bob } = await loadFixture(deployFixture);
      await karma.mint(alice.address, ethers.parseEther("100"), "a");
      await karma.mint(bob.address, ethers.parseEther("200"), "b");
      expect(await karma.totalSupply()).to.equal(ethers.parseEther("300"));
    });

    it("should revert when non-owner tries to mint", async () => {
      const { karma, alice, bob } = await loadFixture(deployFixture);
      await expect(
        karma.connect(alice).mint(bob.address, ethers.parseEther("100"), "hack")
      ).to.be.revertedWithCustomError(karma, "OwnableUnauthorizedAccount");
    });

    it("should revert minting to zero address", async () => {
      const { karma } = await loadFixture(deployFixture);
      await expect(
        karma.mint(ethers.ZeroAddress, ethers.parseEther("100"), "bad")
      ).to.be.revertedWith("KarmaToken: mint to zero address");
    });

    it("should revert minting zero amount", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      await expect(
        karma.mint(alice.address, 0, "zero")
      ).to.be.revertedWith("KarmaToken: mint zero amount");
    });
  });

  describe("Spending (burn with reason)", () => {
    it("should allow holder to spend tokens", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      await karma.mint(alice.address, ethers.parseEther("100"), "earned");
      await karma.connect(alice).spend(ethers.parseEther("30"), "bought skill");
      expect(await karma.balanceOf(alice.address)).to.equal(ethers.parseEther("70"));
    });

    it("should emit KarmaSpent event", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("10");
      await karma.mint(alice.address, amount, "earned");
      await expect(karma.connect(alice).spend(amount, "marketplace"))
        .to.emit(karma, "KarmaSpent")
        .withArgs(alice.address, amount, "marketplace");
    });

    it("should revert spending zero amount", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      await expect(
        karma.connect(alice).spend(0, "zero")
      ).to.be.revertedWith("KarmaToken: spend zero amount");
    });

    it("should revert spending more than balance", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      await karma.mint(alice.address, ethers.parseEther("10"), "earned");
      await expect(
        karma.connect(alice).spend(ethers.parseEther("20"), "overspend")
      ).to.be.revertedWithCustomError(karma, "ERC20InsufficientBalance");
    });
  });

  describe("Standard ERC-20 burn", () => {
    it("should allow holder to burn tokens via ERC20Burnable", async () => {
      const { karma, alice } = await loadFixture(deployFixture);
      await karma.mint(alice.address, ethers.parseEther("50"), "earned");
      await karma.connect(alice).burn(ethers.parseEther("20"));
      expect(await karma.balanceOf(alice.address)).to.equal(ethers.parseEther("30"));
    });
  });

  describe("Transfers", () => {
    it("should allow free transfers between accounts", async () => {
      const { karma, alice, bob } = await loadFixture(deployFixture);
      await karma.mint(alice.address, ethers.parseEther("100"), "earned");
      await karma.connect(alice).transfer(bob.address, ethers.parseEther("40"));
      expect(await karma.balanceOf(alice.address)).to.equal(ethers.parseEther("60"));
      expect(await karma.balanceOf(bob.address)).to.equal(ethers.parseEther("40"));
    });

    it("should allow approved transfers", async () => {
      const { karma, alice, bob } = await loadFixture(deployFixture);
      await karma.mint(alice.address, ethers.parseEther("100"), "earned");
      await karma.connect(alice).approve(bob.address, ethers.parseEther("50"));
      await karma.connect(bob).transferFrom(alice.address, bob.address, ethers.parseEther("50"));
      expect(await karma.balanceOf(bob.address)).to.equal(ethers.parseEther("50"));
    });
  });

  describe("Ownership", () => {
    it("should allow owner transfer", async () => {
      const { karma, owner, alice } = await loadFixture(deployFixture);
      await karma.transferOwnership(alice.address);
      expect(await karma.owner()).to.equal(alice.address);
    });
  });
});
