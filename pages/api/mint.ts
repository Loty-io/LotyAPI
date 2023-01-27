import type { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";

import { abi } from "../../config/abi";

type Data = {
  status: string;
  error_message?: string;
  hash?: any;
};

const contractAddress = "0xB153f3Abb4a2Aecd8A20dda2cC2BBF3E75bcb56f";
const provider = "https://goerli.infura.io/v3/4415e15c85364bf4be0097aaaab55b7f";

const caller = "0x3A2eF4788D4800D7fF7Ed96c6b6E0C9241313f9D";
const private_key =
  "125bc04bf45ecd350c39fb101f346c0f5b0933035d9aec8091f22c571d5efa0d";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const w3 = new Web3(new Web3.providers.HttpProvider(provider));
    console.log("esta conectado = ");
    w3.eth.net.isListening().then(console.log);

    //@ts-ignore
    const contract = new w3.eth.Contract(abi, contractAddress);

    const chainId = await w3.eth.getChainId();

    const nonce = await w3.eth.getTransactionCount(caller);
    const balance = await w3.eth.getBalance(caller);

    const call_function = contract.methods.safeMint(caller).encodeABI();

    // Build the transaction object
    const gasPrice = await w3.utils.toWei("10", "gwei");

    console.log(balance, gasPrice, chainId);

    const tx = {
      to: contractAddress,
      data: call_function,
      gas: 3000000,
      chainId: chainId,
      nonce: nonce,
      gasPrice,
      from: caller,
    };

    const signPromise = w3.eth.accounts.signTransaction(tx, private_key);
    signPromise
      .then((signedTx) => {
        w3.eth.sendSignedTransaction(
          signedTx?.rawTransaction || "",
          function (err: any, hash: any) {
            if (!err) {
              console.log("The hash of your transaction is: ");
              return res.status(200).json({
                status: "success",
                hash,
              });
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log("Promise failed:", err);
      });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
