const { ethers } = require("hardhat");

async function main() {
  try {
    // 1. Get the deployer account
    const [deployer] = await ethers.getSigners();
    if (!deployer) {
      throw new Error("Failed to get deployer account");
    }

    console.log(`Deployer: ${deployer.address}`);

    // 2. Check balance using provider directly
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

    if (balance === 0n) {
      throw new Error(
        "Insufficient Sepolia ETH - get some from https://sepoliafaucet.com"
      );
    }

    // 3. Deploy contract
    const PDFVerify = await ethers.getContractFactory("PDFVerify");
    console.log("Deploying contract...");

    const pdfVerify = await PDFVerify.connect(deployer).deploy();

    console.log(`Transaction hash: ${pdfVerify.deploymentTransaction().hash}`);
    await pdfVerify.waitForDeployment();
    console.log(`Contract deployed to: ${await pdfVerify.getAddress()}`);
  } catch (error) {
    console.error("\x1b[31m", `DEPLOYMENT FAILED: ${error.message}`);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
