import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { CertificateNFT } from "../typechain-types";

describe("CertificateNFT", () => {
  async function deployFixture() {
    const [owner, certifier, alice, bob] = await ethers.getSigners();
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    const cert = await CertificateNFT.deploy();
    await cert.setCertifier(certifier.address, true);
    return { cert, owner, certifier, alice, bob };
  }

  describe("Deployment", () => {
    it("should have correct name and symbol", async () => {
      const { cert } = await loadFixture(deployFixture);
      expect(await cert.name()).to.equal("Lobster Certificate");
      expect(await cert.symbol()).to.equal("LCERT");
    });

    it("should set deployer as owner", async () => {
      const { cert, owner } = await loadFixture(deployFixture);
      expect(await cert.owner()).to.equal(owner.address);
    });

    it("should start with zero total supply", async () => {
      const { cert } = await loadFixture(deployFixture);
      expect(await cert.totalSupply()).to.equal(0);
    });
  });

  describe("Certifier Management", () => {
    it("should allow owner to set certifiers", async () => {
      const { cert, alice } = await loadFixture(deployFixture);
      await cert.setCertifier(alice.address, true);
      expect(await cert.certifiers(alice.address)).to.be.true;
    });

    it("should allow owner to revoke certifiers", async () => {
      const { cert, certifier } = await loadFixture(deployFixture);
      await cert.setCertifier(certifier.address, false);
      expect(await cert.certifiers(certifier.address)).to.be.false;
    });

    it("should emit CertifierUpdated event", async () => {
      const { cert, alice } = await loadFixture(deployFixture);
      await expect(cert.setCertifier(alice.address, true))
        .to.emit(cert, "CertifierUpdated")
        .withArgs(alice.address, true);
    });

    it("should revert setting zero address as certifier", async () => {
      const { cert } = await loadFixture(deployFixture);
      await expect(
        cert.setCertifier(ethers.ZeroAddress, true)
      ).to.be.revertedWith("CertificateNFT: zero address");
    });

    it("should revert when non-owner sets certifiers", async () => {
      const { cert, alice, bob } = await loadFixture(deployFixture);
      await expect(
        cert.connect(alice).setCertifier(bob.address, true)
      ).to.be.revertedWithCustomError(cert, "OwnableUnauthorizedAccount");
    });
  });

  describe("Issuing Certificates", () => {
    it("should allow certifier to issue certificate", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      const tx = await cert.connect(certifier).issueCertificate(
        alice.address, "solidity-basics", 3, 8500
      );
      expect(await cert.ownerOf(0)).to.equal(alice.address);
      expect(await cert.totalSupply()).to.equal(1);
    });

    it("should allow owner to issue certificate (implicit certifier)", async () => {
      const { cert, owner, alice } = await loadFixture(deployFixture);
      await cert.issueCertificate(alice.address, "typescript", 2, 7000);
      expect(await cert.ownerOf(0)).to.equal(alice.address);
    });

    it("should emit CertificateIssued event", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      await expect(
        cert.connect(certifier).issueCertificate(alice.address, "defi", 4, 9200)
      )
        .to.emit(cert, "CertificateIssued")
        .withArgs(0, alice.address, "defi", 4, 9200);
    });

    it("should store certificate data correctly", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      await cert.connect(certifier).issueCertificate(alice.address, "nft-trading", 5, 9800);

      const data = await cert.getCertificate(0);
      expect(data.skillName).to.equal("nft-trading");
      expect(data.level).to.equal(5);
      expect(data.score).to.equal(9800);
      expect(data.timestamp).to.be.greaterThan(0);
    });

    it("should increment token IDs", async () => {
      const { cert, certifier, alice, bob } = await loadFixture(deployFixture);
      await cert.connect(certifier).issueCertificate(alice.address, "a", 1, 5000);
      await cert.connect(certifier).issueCertificate(bob.address, "b", 2, 6000);
      expect(await cert.ownerOf(0)).to.equal(alice.address);
      expect(await cert.ownerOf(1)).to.equal(bob.address);
      expect(await cert.totalSupply()).to.equal(2);
    });

    it("should revert for unauthorized minter", async () => {
      const { cert, alice, bob } = await loadFixture(deployFixture);
      await expect(
        cert.connect(alice).issueCertificate(bob.address, "hack", 1, 100)
      ).to.be.revertedWithCustomError(cert, "NotCertifier");
    });

    it("should revert for invalid level 0", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      await expect(
        cert.connect(certifier).issueCertificate(alice.address, "test", 0, 5000)
      ).to.be.revertedWithCustomError(cert, "InvalidLevel");
    });

    it("should revert for invalid level 7", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      await expect(
        cert.connect(certifier).issueCertificate(alice.address, "test", 7, 5000)
      ).to.be.revertedWithCustomError(cert, "InvalidLevel");
    });

    it("should revert for score > 10000", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      await expect(
        cert.connect(certifier).issueCertificate(alice.address, "test", 3, 10001)
      ).to.be.revertedWith("CertificateNFT: score exceeds 10000");
    });

    it("should revert minting to zero address", async () => {
      const { cert, certifier } = await loadFixture(deployFixture);
      await expect(
        cert.connect(certifier).issueCertificate(ethers.ZeroAddress, "test", 1, 5000)
      ).to.be.revertedWith("CertificateNFT: mint to zero address");
    });
  });

  describe("Soulbound (Non-transferable)", () => {
    it("should revert on transfer", async () => {
      const { cert, certifier, alice, bob } = await loadFixture(deployFixture);
      await cert.connect(certifier).issueCertificate(alice.address, "test", 1, 5000);
      await expect(
        cert.connect(alice).transferFrom(alice.address, bob.address, 0)
      ).to.be.revertedWithCustomError(cert, "SoulboundTransfer");
    });

    it("should revert on safeTransferFrom", async () => {
      const { cert, certifier, alice, bob } = await loadFixture(deployFixture);
      await cert.connect(certifier).issueCertificate(alice.address, "test", 1, 5000);
      await expect(
        cert.connect(alice)["safeTransferFrom(address,address,uint256)"](
          alice.address, bob.address, 0
        )
      ).to.be.revertedWithCustomError(cert, "SoulboundTransfer");
    });
  });

  describe("Token URI", () => {
    it("should return base64-encoded JSON metadata", async () => {
      const { cert, certifier, alice } = await loadFixture(deployFixture);
      await cert.connect(certifier).issueCertificate(alice.address, "solidity", 3, 8500);
      const uri = await cert.tokenURI(0);
      expect(uri).to.match(/^data:application\/json;base64,/);

      const base64 = uri.replace("data:application/json;base64,", "");
      const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));

      expect(json.name).to.equal("Lobster Certificate #0");
      expect(json.description).to.include("Lobster University");
      expect(json.attributes).to.have.lengthOf(4);
      expect(json.attributes[0].value).to.equal("solidity");
      expect(json.attributes[1].value).to.equal(3);
      expect(json.attributes[2].value).to.equal(8500);
    });

    it("should revert for nonexistent token", async () => {
      const { cert } = await loadFixture(deployFixture);
      await expect(cert.tokenURI(999))
        .to.be.revertedWithCustomError(cert, "ERC721NonexistentToken");
    });
  });

  describe("getCertificate", () => {
    it("should revert for nonexistent token", async () => {
      const { cert } = await loadFixture(deployFixture);
      await expect(cert.getCertificate(999))
        .to.be.revertedWithCustomError(cert, "ERC721NonexistentToken");
    });
  });
});
