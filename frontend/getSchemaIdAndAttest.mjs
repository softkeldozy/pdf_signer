import { SignProtocolClient } from "@ethsign/sp-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    // 1. Initialize client for Base Testnet
    const client = new SignProtocolClient("testnet", {
      chain: "base",
      rpcUrl: "https://goerli.base.org", // Testnet RPC
    });

    // 2. Initialize wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

    // 3. Resolve schema (replace with your actual testnet schema ID)
    const TESTNET_SCHEMA_ID = "0x241b";
    console.log(`Fetching schema ${TESTNET_SCHEMA_ID}...`);

    const schema = await client.getSchema(TESTNET_SCHEMA_ID);
    console.log("✅ Schema UID:", schema.uid);

    // 4. Create attestation
    const attestation = await client.createAttestation({
      schemaId: ethers.BigNumber.from(schema.uid),
      data: {
        recipient: ethers.constants.AddressZero,
        data: ethers.utils.defaultAbiCoder.encode(
          ["string"], // Match your schema fields
          ["Test attestation from Node.js"]
        ),
        revocable: true,
      },
      signer: wallet,
    });

    console.log("🎉 Attestation created!");
    console.log("UID:", attestation.uid);
    console.log(
      "View on explorer: https://goerli.basescan.org/tx/" + attestation.txHash
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
  }
}

main();
