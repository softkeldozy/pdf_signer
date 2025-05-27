export const handleWalletError = (error) => {
  let userMessage = "Wallet operation failed";

  // MetaMask errors
  if (error.code === 4001) return "Request rejected by user";
  if (error.code === -32002) return "Request already pending";

  // EthSign errors
  if (error.message.includes("User rejected")) return "Signature rejected";
  if (error.message.includes("Invalid document"))
    return "Invalid document format";

  // Network errors
  if (error.message.includes("Network error"))
    return "Network connection failed";

  console.error("Handled error:", error);
  return userMessage;
};

export const handleSigningError = (error) => {
  let userMessage = "Document signing failed";

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message.includes("insufficient funds")) {
    return "Insufficient funds for transaction";
  }

  if (error.message.includes("gas")) {
    return "Transaction would exceed gas limit";
  }

  console.error("Signing error:", error);
  return userMessage;
};
