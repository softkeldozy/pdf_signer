// const { ethers } = require("hardhat");

// async function main() {
//   // Verify connection
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying with account:", deployer.address);

//   // Check balance
//   const balance = await deployer.getBalance();
//   console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

//   if (balance.eq(0)) {
//     throw new Error(
//       "Insufficient Sepolia ETH - get some from https://sepoliafaucet.com"
//     );
//   }

//   // Deploy contract
//   const PDFVerify = await ethers.getContractFactory("PDFVerify");
//   console.log("Deploying contract...");
//   const pdfVerify = await PDFVerify.deploy();

//   await pdfVerify.deployed();
//   console.log("Contract deployed to:", pdfVerify.address);

//   // Optional: Print deployment details
//   console.log("Deployment transaction hash:", pdfVerify.deployTransaction.hash);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("\x1b[31m%s\x1b[0m", `Error: ${error.message}`); // Red error text
//     process.exit(1);
//   });

// const { ethers } = require("hardhat");

// async function main() {
//   try {
//     // Explicitly get the deployer account
//     const [deployer] = await ethers.getSigners();

//     if (!deployer) {
//       throw new Error("No deployer account found");
//     }

//     console.log("Deploying with account:", deployer.address);

//     // Check balance
//     const balance = await deployer.getBalance();
//     console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

//     if (balance.eq(0)) {
//       throw new Error(
//         "Insufficient Sepolia ETH - get some from https://sepoliafaucet.com"
//       );
//     }

//     // Deploy contract
//     console.log("Deploying contract...");
//     const PDFVerify = await ethers.getContractFactory("PDFVerify");
//     const pdfVerify = await PDFVerify.deploy();

//     await pdfVerify.deployed();
//     console.log("Contract deployed to:", pdfVerify.address);
//     console.log("Transaction hash:", pdfVerify.deployTransaction.hash);
//   } catch (error) {
//     console.error("\x1b[31m%s\x1b[0m", `Deployment failed: ${error.message}`);
//     process.exit(1);
//   }
// }

// main().then(() => process.exit(0));

// const { ethers } = require("hardhat");

// async function main() {
//   try {
//     // Verify config first
//     if (!process.env.DEPLOYER_PRIVATE_KEY) {
//       throw new Error("Missing DEPLOYER_PRIVATE_KEY in .env");
//     }

//     // Get signers with timeout
//     const [deployer] = await Promise.race([
//       ethers.getSigners(),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Connection timeout")), 10000)
//       ),
//     ]);

//     if (!deployer?.address) {
//       throw new Error("Failed to get deployer account");
//     }

//     console.log(`Deployer: ${deployer.address}`);

//     // Check balance
//     const balance = await provider.getBalance(deployer.address);
//     console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);

//     if (balance.eq(0)) {
//       throw new Error("Get test ETH from https://sepoliafaucet.com");
//     }

//     // Deploy with explicit gas settings
//     const PDFVerify = await ethers.getContractFactory("PDFVerify");
//     console.log("Deploying...");

//     const pdfVerify = await PDFVerify.deploy({
//       gasLimit: 5000000,
//     });

//     console.log(`Tx hash: ${pdfVerify.deployTransaction.hash}`);
//     await pdfVerify.deployed();
//     console.log(`Deployed to: ${pdfVerify.address}`);
//   } catch (error) {
//     console.error("\x1b[31m", `FAILED: ${error.message}`);
//     process.exit(1);
//   }
// }

// main().then(() => process.exit(0));

// const { ethers } = require("hardhat");

// async function main() {
//   try {
//     // 1. Get the deployer account through Hardhat's network
//     const [deployer] = await ethers.getSigners();

//     if (!deployer) {
//       throw new Error("Failed to get deployer account");
//     }

//     console.log(`Deployer: ${deployer.address}`);

//     // 2. Check balance using the signer's provider
//     const balance = await deployer.provider.getBalance(deployer.address);
//     console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);

//     if (balance.eq(0)) {
//       throw new Error(
//         "Insufficient Sepolia ETH - get some from https://sepoliafaucet.com"
//       );
//     }

//     // 3. Deploy contract
//     const PDFVerify = await ethers.getContractFactory("PDFVerify", deployer);
//     console.log("Deploying contract...");

//     const pdfVerify = await PDFVerify.deploy({
//       gasLimit: 5000000,
//     });

//     console.log(`Transaction hash: ${pdfVerify.deployTransaction.hash}`);
//     await pdfVerify.deployed();
//     console.log(`Contract deployed to: ${pdfVerify.address}`);
//   } catch (error) {
//     console.error("\x1b[31m", `DEPLOYMENT FAILED: ${error.message}`);
//     if (error.stack) console.error(error.stack);
//     process.exit(1);
//   }
// }

// main().then(() => process.exit(0));

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
