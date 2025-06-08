// const { SignProtocolClient } = require("@ethsign/sp-sdk");
// const { ethers } = require("ethers");
// require("dotenv").config();

// Configuration
const SCHEMA_ID = "0x241b"; // Your short schema ID
const CHAIN_CONFIG = {
  network: "testnet", // or "mainnet"
  chain: "base", // Base chain
};
const SCHEMA_FIELDS = [
  { name: "fileUrl", type: "string" },
  { name: "filename", type: "string" },
  { name: "signer", type: "address" },
  { name: "signedAt", type: "string" },
];

// async function createAttestation() {
//   try {
//     // 1. Initialize
//     const client = new SignProtocolClient(CHAIN_CONFIG.network, {
//       chain: CHAIN_CONFIG.chain,
//     });
//     const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

//     // 2. Verify schema ownership
//     console.log(`🔍 Fetching schema ${SCHEMA_ID}...`);
//     const schema = await client.getSchema(SCHEMA_ID);

//     if (schema.creator.toLowerCase() !== wallet.address.toLowerCase()) {
//       throw new Error("🚨 Schema doesn't belong to you!");
//     }
//     console.log("✅ Schema verified:", schema.uid);

//     // 3. Prepare attestation data (replace with your actual values)
//     const attestationData = {
//       fileUrl: "https://example.com/file.pdf",
//       filename: "document.pdf",
//       signer: wallet.address,
//       signedAt: new Date().toISOString(),
//     };

//     // 4. Encode data to match schema
//     const encodedData = ethers.utils.defaultAbiCoder.encode(
//       SCHEMA_FIELDS.map((f) => f.type), // ["string", "string", "address", "string"]
//       Object.values(attestationData) // Actual values in same order
//     );

//     // 5. Create attestation
//     console.log("⏳ Creating attestation...");
//     const attestation = await client.createAttestation({
//       schemaId: ethers.BigNumber.from(schema.uid),
//       data: {
//         recipient: wallet.address, // Or specific recipient
//         data: encodedData,
//         revocable: true,
//         expirationTime: 0, // No expiration
//       },
//       signer: wallet,
//     });

//     console.log("\n🎉 Attestation created successfully!");
//     console.log("UID:", attestation.uid);
//     console.log(
//       "Explorer Link:",
//       `https://base-goerli.blockscout.com/tx/${attestation.txHash}`
//     );
//     console.log("\n📦 Attestation Data:", attestationData);
//   } catch (error) {
//     console.error("\n❌ Error:", error.message);
//     if (error.response?.data) {
//       console.error("Server Response:", error.response.data);
//     }
//     process.exit(1);
//   }
// }

// // Run the script
// createAttestation();
// async function main() {
//   try {
//     // 1. Initialize
//     const client = new SignProtocolClient("testnet", { chain: "base" });
//     const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

//     // 2. Fetch schema
//     const SCHEMA_ID = "0x241b";
//     console.log(`🔍 Fetching schema ${SCHEMA_ID}...`);

//     const schema = await client.getSchema(SCHEMA_ID);
//     if (!schema || !schema.uid) {
//       throw new Error("Schema not found or invalid response");
//     }

//     // 3. Verify ownership (skip if you don't control the schema)
//     console.log("ℹ️ Schema UID:", schema.uid);
//     console.log("ℹ️ Schema Creator:", schema.creator || "Not available");

//     // 4. Prepare data matching your schema
//     const attestationData = {
//       fileUrl: "https://example.com/doc.pdf",
//       filename: "contract.pdf",
//       signer: wallet.address,
//       signedAt: new Date().toISOString(),
//     };

//     // 5. Encode data
//     const encodedData = ethers.utils.defaultAbiCoder.encode(
//       ["string", "string", "address", "string"],
//       Object.values(attestationData)
//     );

//     // 6. Create attestation
//     const attestation = await client.createAttestation({
//       schemaId: ethers.BigNumber.from(schema.uid),
//       data: {
//         recipient: wallet.address,
//         data: encodedData,
//         revocable: true,
//         expirationTime: 0,
//       },
//       signer: wallet,
//     });

//     console.log("✅ Attestation created:", attestation.uid);
//     console.log("📊 Data:", attestationData);
//   } catch (error) {
//     console.error("❌ Error:", error.message);
//     if (error.response) {
//       console.error("API Error:", error.response.data || error.response.status);
//     }
//   }
// }

// main();

// async function checkSchema() {
//   const client = new SignProtocolClient("testnet", { chain: "base" });
//   try {
//     const schema = await client.getSchema("0x241b");
//     console.log("Schema found:", schema);
//   } catch (error) {
//     console.error("Schema check failed:", error.message);
//   }
// }

// checkSchema();

// getSchemaUID.js (CommonJS compatible)
// getSchemasByWallet.js
// createSchema.js
// const { SignProtocolClient } = require("@ethsign/sp-sdk");
// const { ethers } = require("ethers");
// require("dotenv").config();

// const { SignProtocolClient } = require("@ethsign/sp-sdk");
// const { ethers } = require("ethers");
// require("dotenv").config();

const { SignProtocolClient, SpMode } = require("@ethsign/sp-sdk");
const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error("Missing PRIVATE_KEY in .env");

    const wallet = new ethers.Wallet(privateKey);
    console.log("👤 Wallet address:", wallet.address);

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: "base",
      signer: wallet,
    });

    console.log("📡 Fetching all schemas...");
    const allSchemas = await client.getSchema(schemaId); // this works

    // Filter by your wallet
    const mySchemas = allSchemas.filter(
      (schema) =>
        schema.registrant.toLowerCase() === wallet.address.toLowerCase()
    );

    if (mySchemas.length === 0) {
      console.log("⚠️ No schemas found for your wallet.");
      return;
    }

    // Print results
    mySchemas.forEach((schema, i) => {
      console.log(`\n🔹 Schema ${i + 1}`);
      console.log("Schema ID:", schema.schemaId);
      console.log("UID:", schema.uid);
      console.log("Name:", schema.name);
      console.log("Description:", schema.description);
      console.log("Fields:", schema.data);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) console.error("Details:", error.response.data);
  }
}

main();
