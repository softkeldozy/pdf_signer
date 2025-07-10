export const handleWalletError = (error) => {
  let userMessage = "Wallet connection failed";

  if (error.code === 4001) {
    userMessage = "Connection rejected by user";
  } else if (error.code === -32002) {
    userMessage = "Connection request already pending";
  } else if (error.message.includes("EIP-1193")) {
    userMessage = "Ethereum wallet not detected";
  }

  console.error("Wallet error:", error);
  return userMessage;
};
