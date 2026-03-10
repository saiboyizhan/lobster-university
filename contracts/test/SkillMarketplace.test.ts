import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("SkillMarketplace", () => {
  const SKILL_PRICE = ethers.parseEther("100");
  const SKILL_NAME = "@lobster-u/defi-basics";

  function skillId(name: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(name));
  }

  async function deployFixture() {
    const [owner, seller, buyer, rater] = await ethers.getSigners();

    const KarmaToken = await ethers.getContractFactory("KarmaToken");
    const karma = await KarmaToken.deploy();

    const SkillMarketplace = await ethers.getContractFactory("SkillMarketplace");
    const marketplace = await SkillMarketplace.deploy(await karma.getAddress());

    // Mint KARMA to buyer for purchases
    await karma.mint(buyer.address, ethers.parseEther("10000"), "test funds");

    // Buyer approves marketplace to spend KARMA
    await karma.connect(buyer).approve(await marketplace.getAddress(), ethers.MaxUint256);

    return { karma, marketplace, owner, seller, buyer, rater };
  }

  async function listedFixture() {
    const fixture = await deployFixture();
    const sid = skillId(SKILL_NAME);
    await fixture.marketplace.connect(fixture.seller).listSkill(sid, SKILL_PRICE);
    return { ...fixture, sid };
  }

  async function purchasedFixture() {
    const fixture = await listedFixture();
    await fixture.marketplace.connect(fixture.buyer).buySkill(fixture.sid, SKILL_PRICE);
    return fixture;
  }

  describe("Deployment", () => {
    it("should set karma token address", async () => {
      const { karma, marketplace } = await loadFixture(deployFixture);
      expect(await marketplace.karmaToken()).to.equal(await karma.getAddress());
    });

    it("should set default platform fee to 5%", async () => {
      const { marketplace } = await loadFixture(deployFixture);
      expect(await marketplace.platformFeeBps()).to.equal(500);
    });

    it("should set deployer as owner", async () => {
      const { marketplace, owner } = await loadFixture(deployFixture);
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("should revert with zero token address", async () => {
      const SkillMarketplace = await ethers.getContractFactory("SkillMarketplace");
      await expect(
        SkillMarketplace.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("SkillMarketplace: zero token address");
    });
  });

  describe("Listing Skills", () => {
    it("should list a skill", async () => {
      const { marketplace, seller } = await loadFixture(deployFixture);
      const sid = skillId(SKILL_NAME);
      await marketplace.connect(seller).listSkill(sid, SKILL_PRICE);

      const listing = await marketplace.listings(sid);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(SKILL_PRICE);
      expect(listing.active).to.be.true;
    });

    it("should emit SkillListed event", async () => {
      const { marketplace, seller } = await loadFixture(deployFixture);
      const sid = skillId(SKILL_NAME);
      await expect(marketplace.connect(seller).listSkill(sid, SKILL_PRICE))
        .to.emit(marketplace, "SkillListed")
        .withArgs(sid, seller.address, SKILL_PRICE);
    });

    it("should revert listing with zero price", async () => {
      const { marketplace, seller } = await loadFixture(deployFixture);
      await expect(
        marketplace.connect(seller).listSkill(skillId("x"), 0)
      ).to.be.revertedWithCustomError(marketplace, "ZeroPrice");
    });

    it("should revert listing already listed skill", async () => {
      const { marketplace, seller } = await loadFixture(listedFixture);
      const sid = skillId(SKILL_NAME);
      await expect(
        marketplace.connect(seller).listSkill(sid, SKILL_PRICE)
      ).to.be.revertedWithCustomError(marketplace, "SkillAlreadyListed");
    });
  });

  describe("Delisting Skills", () => {
    it("should delist a skill", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      await marketplace.connect(seller).delistSkill(sid);
      const listing = await marketplace.listings(sid);
      expect(listing.active).to.be.false;
    });

    it("should emit SkillDelisted event", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      await expect(marketplace.connect(seller).delistSkill(sid))
        .to.emit(marketplace, "SkillDelisted")
        .withArgs(sid);
    });

    it("should revert delisting nonexistent skill", async () => {
      const { marketplace, seller } = await loadFixture(deployFixture);
      await expect(
        marketplace.connect(seller).delistSkill(skillId("nonexistent"))
      ).to.be.revertedWithCustomError(marketplace, "SkillNotFound");
    });

    it("should revert when non-seller tries to delist", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      await expect(
        marketplace.connect(buyer).delistSkill(sid)
      ).to.be.revertedWithCustomError(marketplace, "NotSeller");
    });
  });

  describe("Updating Price", () => {
    it("should update skill price", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      const newPrice = ethers.parseEther("200");
      await marketplace.connect(seller).updatePrice(sid, newPrice);
      const listing = await marketplace.listings(sid);
      expect(listing.price).to.equal(newPrice);
    });

    it("should emit SkillPriceUpdated event", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      const newPrice = ethers.parseEther("200");
      await expect(marketplace.connect(seller).updatePrice(sid, newPrice))
        .to.emit(marketplace, "SkillPriceUpdated")
        .withArgs(sid, newPrice);
    });

    it("should revert updating with zero price", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      await expect(
        marketplace.connect(seller).updatePrice(sid, 0)
      ).to.be.revertedWithCustomError(marketplace, "ZeroPrice");
    });

    it("should revert when non-seller updates price", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      await expect(
        marketplace.connect(buyer).updatePrice(sid, ethers.parseEther("200"))
      ).to.be.revertedWithCustomError(marketplace, "NotSeller");
    });
  });

  describe("Buying Skills", () => {
    it("should transfer KARMA to seller minus fee", async () => {
      const { karma, marketplace, seller, buyer, sid } = await loadFixture(listedFixture);
      const sellerBefore = await karma.balanceOf(seller.address);

      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);

      const sellerAfter = await karma.balanceOf(seller.address);
      const fee = (SKILL_PRICE * 500n) / 10000n; // 5%
      expect(sellerAfter - sellerBefore).to.equal(SKILL_PRICE - fee);
    });

    it("should collect platform fee", async () => {
      const { karma, marketplace, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      const fee = (SKILL_PRICE * 500n) / 10000n;
      expect(await marketplace.accumulatedFees()).to.equal(fee);
      expect(await karma.balanceOf(await marketplace.getAddress())).to.equal(fee);
    });

    it("should mark buyer as having purchased", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      expect(await marketplace.hasPurchased(sid, buyer.address)).to.be.true;
    });

    it("should emit SkillPurchased event", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      const fee = (SKILL_PRICE * 500n) / 10000n;
      await expect(marketplace.connect(buyer).buySkill(sid, SKILL_PRICE))
        .to.emit(marketplace, "SkillPurchased")
        .withArgs(sid, buyer.address, SKILL_PRICE, fee);
    });

    it("should revert buying nonexistent skill", async () => {
      const { marketplace, buyer } = await loadFixture(deployFixture);
      await expect(
        marketplace.connect(buyer).buySkill(skillId("nonexistent"), SKILL_PRICE)
      ).to.be.revertedWithCustomError(marketplace, "SkillNotFound");
    });

    it("should revert buying delisted skill", async () => {
      const { marketplace, seller, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(seller).delistSkill(sid);
      await expect(
        marketplace.connect(buyer).buySkill(sid, SKILL_PRICE)
      ).to.be.revertedWithCustomError(marketplace, "SkillNotFound");
    });

    it("should revert buying own skill", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      await expect(
        marketplace.connect(seller).buySkill(sid, SKILL_PRICE)
      ).to.be.revertedWithCustomError(marketplace, "CannotBuyOwnSkill");
    });

    it("should revert buying already purchased skill", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await expect(
        marketplace.connect(buyer).buySkill(sid, SKILL_PRICE)
      ).to.be.revertedWithCustomError(marketplace, "AlreadyPurchased");
    });

    it("should revert when buyer has insufficient KARMA", async () => {
      const { karma, marketplace, rater, sid } = await loadFixture(listedFixture);
      await karma.connect(rater).approve(await marketplace.getAddress(), ethers.MaxUint256);
      await expect(
        marketplace.connect(rater).buySkill(sid, SKILL_PRICE)
      ).to.be.revertedWithCustomError(karma, "ERC20InsufficientBalance");
    });
  });

  describe("Rating Skills", () => {
    it("should allow buyer to rate a skill", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await marketplace.connect(buyer).rateSkill(sid, 5);
      expect(await marketplace.hasRated(sid, buyer.address)).to.be.true;
    });

    it("should emit SkillRated event", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await expect(marketplace.connect(buyer).rateSkill(sid, 4))
        .to.emit(marketplace, "SkillRated")
        .withArgs(sid, buyer.address, 4);
    });

    it("should track rating totals", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await marketplace.connect(buyer).rateSkill(sid, 4);
      const listing = await marketplace.listings(sid);
      expect(listing.totalRating).to.equal(4);
      expect(listing.ratingCount).to.equal(1);
    });

    it("should compute average rating correctly", async () => {
      const { karma, marketplace, buyer, rater, sid } = await loadFixture(purchasedFixture);

      // Give rater funds and purchase
      await karma.mint(rater.address, ethers.parseEther("10000"), "test");
      await karma.connect(rater).approve(await marketplace.getAddress(), ethers.MaxUint256);
      await marketplace.connect(rater).buySkill(sid, SKILL_PRICE);

      await marketplace.connect(buyer).rateSkill(sid, 4);
      await marketplace.connect(rater).rateSkill(sid, 5);

      // Average = (4+5)/2 * 100 = 450
      expect(await marketplace.getAverageRating(sid)).to.equal(450);
    });

    it("should return 0 average for unrated skill", async () => {
      const { marketplace, sid } = await loadFixture(listedFixture);
      expect(await marketplace.getAverageRating(sid)).to.equal(0);
    });

    it("should revert rating without purchase", async () => {
      const { marketplace, rater, sid } = await loadFixture(listedFixture);
      await expect(
        marketplace.connect(rater).rateSkill(sid, 5)
      ).to.be.revertedWithCustomError(marketplace, "NotPurchased");
    });

    it("should revert double rating", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await marketplace.connect(buyer).rateSkill(sid, 4);
      await expect(
        marketplace.connect(buyer).rateSkill(sid, 5)
      ).to.be.revertedWithCustomError(marketplace, "AlreadyRated");
    });

    it("should revert rating 0", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await expect(
        marketplace.connect(buyer).rateSkill(sid, 0)
      ).to.be.revertedWithCustomError(marketplace, "InvalidRating");
    });

    it("should revert rating 6", async () => {
      const { marketplace, buyer, sid } = await loadFixture(purchasedFixture);
      await expect(
        marketplace.connect(buyer).rateSkill(sid, 6)
      ).to.be.revertedWithCustomError(marketplace, "InvalidRating");
    });
  });

  describe("Platform Fee Management", () => {
    it("should allow owner to set platform fee", async () => {
      const { marketplace } = await loadFixture(deployFixture);
      await marketplace.setPlatformFee(1000); // 10%
      expect(await marketplace.platformFeeBps()).to.equal(1000);
    });

    it("should emit PlatformFeeUpdated event", async () => {
      const { marketplace } = await loadFixture(deployFixture);
      await expect(marketplace.setPlatformFee(1000))
        .to.emit(marketplace, "PlatformFeeUpdated")
        .withArgs(1000);
    });

    it("should allow setting fee to zero", async () => {
      const { marketplace } = await loadFixture(deployFixture);
      await marketplace.setPlatformFee(0);
      expect(await marketplace.platformFeeBps()).to.equal(0);
    });

    it("should revert fee above MAX_FEE_BPS", async () => {
      const { marketplace } = await loadFixture(deployFixture);
      await expect(
        marketplace.setPlatformFee(2001)
      ).to.be.revertedWithCustomError(marketplace, "FeeTooHigh");
    });

    it("should revert when non-owner sets fee", async () => {
      const { marketplace, seller } = await loadFixture(deployFixture);
      await expect(
        marketplace.connect(seller).setPlatformFee(1000)
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });
  });

  describe("Fee Withdrawal", () => {
    it("should allow owner to withdraw fees", async () => {
      const { karma, marketplace, owner, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      const fees = await marketplace.accumulatedFees();

      const balanceBefore = await karma.balanceOf(owner.address);
      await marketplace.withdrawFees(owner.address);
      const balanceAfter = await karma.balanceOf(owner.address);

      expect(balanceAfter - balanceBefore).to.equal(fees);
      expect(await marketplace.accumulatedFees()).to.equal(0);
    });

    it("should emit FeesWithdrawn event", async () => {
      const { marketplace, owner, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      const fees = await marketplace.accumulatedFees();

      await expect(marketplace.withdrawFees(owner.address))
        .to.emit(marketplace, "FeesWithdrawn")
        .withArgs(owner.address, fees);
    });

    it("should revert withdrawing to zero address", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      await expect(
        marketplace.withdrawFees(ethers.ZeroAddress)
      ).to.be.revertedWith("SkillMarketplace: withdraw to zero address");
    });

    it("should revert when no fees accumulated", async () => {
      const { marketplace, owner } = await loadFixture(deployFixture);
      await expect(
        marketplace.withdrawFees(owner.address)
      ).to.be.revertedWith("SkillMarketplace: no fees to withdraw");
    });

    it("should revert when non-owner withdraws fees", async () => {
      const { marketplace, seller } = await loadFixture(deployFixture);
      await expect(
        marketplace.connect(seller).withdrawFees(seller.address)
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });
  });

  describe("Buying with zero fee", () => {
    it("should transfer full amount to seller when fee is 0", async () => {
      const { karma, marketplace, seller, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.setPlatformFee(0);

      const sellerBefore = await karma.balanceOf(seller.address);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      const sellerAfter = await karma.balanceOf(seller.address);

      expect(sellerAfter - sellerBefore).to.equal(SKILL_PRICE);
      expect(await marketplace.accumulatedFees()).to.equal(0);
    });
  });

  describe("Front-running protection (maxPrice)", () => {
    it("should revert when price exceeds maxPrice", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      const tooLow = ethers.parseEther("50");
      await expect(
        marketplace.connect(buyer).buySkill(sid, tooLow)
      ).to.be.revertedWith("Price exceeds maximum");
    });

    it("should succeed when price equals maxPrice", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      await marketplace.connect(buyer).buySkill(sid, SKILL_PRICE);
      expect(await marketplace.hasPurchased(sid, buyer.address)).to.be.true;
    });
  });

  describe("Re-listing after delist (HIGH-1)", () => {
    it("should allow re-listing a delisted skill", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      await marketplace.connect(seller).delistSkill(sid);
      const newPrice = ethers.parseEther("200");
      await marketplace.connect(seller).listSkill(sid, newPrice);
      const listing = await marketplace.listings(sid);
      expect(listing.active).to.be.true;
      expect(listing.price).to.equal(newPrice);
    });
  });

  describe("Owner emergency delist (HIGH-3)", () => {
    it("should allow owner to delist any skill", async () => {
      const { marketplace, owner, sid } = await loadFixture(listedFixture);
      await marketplace.connect(owner).ownerDelistSkill(sid);
      const listing = await marketplace.listings(sid);
      expect(listing.active).to.be.false;
    });

    it("should revert when non-owner tries emergency delist", async () => {
      const { marketplace, buyer, sid } = await loadFixture(listedFixture);
      await expect(
        marketplace.connect(buyer).ownerDelistSkill(sid)
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });
  });

  describe("Block operations on delisted skills (HIGH-2)", () => {
    it("should revert updatePrice on delisted skill", async () => {
      const { marketplace, seller, sid } = await loadFixture(listedFixture);
      await marketplace.connect(seller).delistSkill(sid);
      await expect(
        marketplace.connect(seller).updatePrice(sid, ethers.parseEther("200"))
      ).to.be.revertedWithCustomError(marketplace, "SkillNotFound");
    });
  });

  describe("Utility", () => {
    it("should compute skill ID from package name", async () => {
      const { marketplace } = await loadFixture(deployFixture);
      const expected = ethers.keccak256(ethers.toUtf8Bytes(SKILL_NAME));
      expect(await marketplace.computeSkillId(SKILL_NAME)).to.equal(expected);
    });
  });
});
