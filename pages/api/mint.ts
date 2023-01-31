import type { NextApiRequest, NextApiResponse } from "next";
import {
  PROVIDER_NETWORK,
  PRIVATE_KEY,
  ALCHEMY_API_KEY,
  CHAIN_NAME,
} from "../../config";
import { parseCreateMintDto } from "../../types/mint/mintDto";

import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

type Data = {
  status: string;
  error_message?: string;
  tx_hash?: string;
  nft_details?: NFT;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const body = req.body;

    const provider = new ethers.providers.AlchemyProvider(
      PROVIDER_NETWORK,
      ALCHEMY_API_KEY
    );

    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const sdk = ThirdwebSDK.fromSigner(signer, CHAIN_NAME);

    const { wallet, contractAddress } = parseCreateMintDto(body);
    const contract = await sdk.getContract(contractAddress, "nft-collection");

    // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
    const metadata = {
      name: "Loty NFT Test",
      description: "Loty NFT",
    };

    const tx = await contract.mintTo(wallet, metadata);
    await tx
      .data()
      .then((nftDetails: NFT) => {
        const txHash = tx.receipt.transactionHash;

        console.log(`Successfully minted <${nftDetails}>`);

        return res.status(200).json({
          status: "success",
          nft_details: nftDetails,
          tx_hash: txHash,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: "failed",
          error_message: err.message,
        });
      });
  } catch (error: any) {
    console.log("Error:", error.message);
    return res.status(500).json({
      status: "failed",
      error_message: error.message,
    });
  }
}
/*
export default async function handlerB(
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
      status: "failed",
      error_message: error.message,
    });
  }
}
*/
