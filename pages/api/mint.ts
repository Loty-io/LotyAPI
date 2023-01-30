import type { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";
import { CALLER, PRIVATE_KEY, PROVIDER_URL } from "../../config";
import { parseCreateMintDto } from "../../types/mint/mintDto";

type Data = {
  status: string;
  error_message?: string;
  hash?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const body = req.body;
    const { wallet, contractAddress } = parseCreateMintDto(body);

    const w3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
    w3.eth.net.isListening().then(console.log);

    //@ts-ignore
    const contract = new w3.eth.Contract(abi, contractAddress);

    const chainId = await w3.eth.getChainId();
    const nonce = await w3.eth.getTransactionCount(CALLER);
    const call_function = contract.methods.safeMint(wallet).encodeABI();
    const gasPrice = await w3.utils.toWei("10", "gwei");

    const tx = {
      to: contractAddress,
      data: call_function,
      gas: 3000000,
      chainId: chainId,
      nonce: nonce,
      gasPrice,
      from: CALLER,
    };

    const signPromise = w3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
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
  } catch (error: any) {
    console.log("Error:", error.message);
    return res.status(500).json({
      status: "failed bro",
      error_message: error.message,
    });
  }
}
