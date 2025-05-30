// src/hooks/useOnChainVerify.js
import { ethers } from "ethers";

export default function useOnChainVerify(contractAddress) {
  const storeHash = async (file, signerAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      ["function storeHash(bytes32)"],
      signer
    );

    const fileHash = ethers.utils.keccak256(await file.arrayBuffer());
    const tx = await contract.storeHash(fileHash);
    await tx.wait();
    return tx.hash;
  };

  const verify = async (file, expectedSigner) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      ["function verify(bytes32,address) view returns (bool)"],
      provider
    );

    const fileHash = ethers.utils.keccak256(await file.arrayBuffer());
    return await contract.verify(fileHash, expectedSigner);
  };

  return { storeHash, verify };
}
