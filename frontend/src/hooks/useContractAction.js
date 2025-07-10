// Smart Contract Interaction Flow
const signDocument = async () => {
  try {
    // 1. Get signature coordinates
    const sigData = JSON.stringify(signature.positions);

    // 2. Call contract
    const tx = await contract.signDocument(
      pdfHash,
      sigData,
      signature.imageData
    );

    // 3. Wait for confirmation
    await tx.wait();

    // 4. Update UI
    setTxHash(tx.hash);
    setStatus("signed");
  } catch (err) {
    console.error("Signing failed:", err);
  }
};
