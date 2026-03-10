import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to BSC Mainnet with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

  // Safety check: require explicit confirmation via env var
  if (process.env.CONFIRM_MAINNET !== "true") {
    console.error("\nABORTED: Set CONFIRM_MAINNET=true to deploy to mainnet.");
    process.exitCode = 1;
    return;
  }

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

  console.log("\n=== BSC Mainnet Deployment Summary ===");
  console.log("KarmaToken:       ", karmaAddress);
  console.log("CertificateNFT:   ", certAddress);
  console.log("SkillMarketplace: ", marketplaceAddress);
  console.log("\nVerify on BscScan:");
  console.log(`  https://bscscan.com/address/${karmaAddress}`);
  console.log(`  https://bscscan.com/address/${certAddress}`);
  console.log(`  https://bscscan.com/address/${marketplaceAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
