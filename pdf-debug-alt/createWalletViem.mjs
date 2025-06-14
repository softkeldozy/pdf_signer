import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log({
  address: account.address,
  privateKey,
});
