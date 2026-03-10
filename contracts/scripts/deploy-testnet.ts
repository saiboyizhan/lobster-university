import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to BSC Testnet with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

  // 1. Deploy KarmaToken
  console.log("\n--- Deploying KarmaToken ---");
  const KarmaToken = await ethers.getContractFactory("KarmaToken");
  const karma = await KarmaToken.deploy();
  await karma.waitForDeployment();
  const karmaAddress = await karma.getAddress();
  console.log("KarmaToken deployed to:", karmaAddress);

  // 2. Deploy CertificateNFT
  console.log("\n--- Deploying CertificateNFT ---");
  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const cert = await CertificateNFT.deploy();
  await cert.waitForDeployment();
  const certAddress = await cert.getAddress();
  console.log("CertificateNFT deployed to:", certAddress);

  // 3. Deploy SkillMarketplace
  console.log("\n--- Deploying SkillMarketplace ---");
  const SkillMarketplace = await ethers.getContractFactory("SkillMarketplace");
  const marketplace = await SkillMarketplace.deploy(karmaAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("SkillMarketplace deployed to:", marketplaceAddress);

  console.log("\n=== BSC Testnet Deployment Summary ===");
  console.log("KarmaToken:       ", karmaAddress);
  console.log("CertificateNFT:   ", certAddress);
  console.log("SkillMarketplace: ", marketplaceAddress);
  console.log("\nVerify on BscScan Testnet:");
  console.log(`  https://testnet.bscscan.com/address/${karmaAddress}`);
  console.log(`  https://testnet.bscscan.com/address/${certAddress}`);
  console.log(`  https://testnet.bscscan.com/address/${marketplaceAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
