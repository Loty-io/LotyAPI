import type { NextApiRequest, NextApiResponse } from "next";
import {
  PROVIDER_NETWORK,
  PRIVATE_KEY,
  ALCHEMY_API_KEY,
  CHAIN_NAME,
  collections,
} from "../../config";
import { Collection, ContractType } from "../../config/collections";
import { parseCreateMintDto } from "../../types/mint/mintDto";

import { NFT, ThirdwebSDK, TransactionResultWithId } from "@thirdweb-dev/sdk";
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
    const { wallet, contractAddress } = parseCreateMintDto(body);

    if (!collections.hasOwnProperty(contractAddress)) {
      return res.status(404).json({
        status: "contract_not_found",
        error_message:
          "Contract with that address is not mintable from this API",
      });
    }

    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const sdk = ThirdwebSDK.fromSigner(signer, CHAIN_NAME);
    const collection = collections[contractAddress];
    var tx: TransactionResultWithId<NFT>;
    switch (collection.contractType) {
      case ContractType.NFTCollection:
        tx = await nftCollectionMint(res, sdk, contractAddress, wallet);
        break;
      case ContractType.NFTDrop:
        const dropRes = await nftDropMint(
          res,
          sdk,
          contractAddress,
          collection,
          wallet
        );
        tx = dropRes[0];
        break;
      default:
        return res.status(501).json({
          status: "contract_type_not_implemented",
          error_message: "Contract Type is not supported by this API yet",
        });
    }
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

const nftCollectionMint = async (
  res: NextApiResponse<Data>,
  sdk: ThirdwebSDK,
  contractAddress: string,
  wallet: string
): Promise<TransactionResultWithId<NFT>> => {
  const metadata = {
    name: "Loty NFT Test",
    description: "Loty NFT",
  };
  const contract = await sdk.getContract(contractAddress, "nft-collection");
  return contract.mintTo(wallet, metadata);
};

const nftDropMint = async (
  res: NextApiResponse<Data>,
  sdk: ThirdwebSDK,
  contractAddress: string,
  collection: Collection,
  wallet: string
): Promise<TransactionResultWithId<NFT>[]> => {
  const contract = await sdk.getContract(contractAddress, "nft-drop");
  return contract.claimTo(wallet, 1);
};
