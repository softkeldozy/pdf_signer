// src/hooks/useIpfsStorage.js
import { useState } from "react";
import { Web3Storage } from "web3.storage";

export default function useIpfsStorage() {
  const [cid, setCid] = useState("");

  const uploadToIpfs = async (file) => {
    const client = new Web3Storage({
      token: process.env.REACT_APP_WEB3STORAGE_TOKEN,
    });
    const cid = await client.put([file]);
    setCid(cid);
    return cid;
  };

  return { cid, uploadToIpfs };
}
