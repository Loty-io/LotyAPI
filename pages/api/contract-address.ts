import type { NextApiRequest, NextApiResponse } from "next";
import { DB_COLLECTION } from "../../config";
import { getContractMetadata } from "../../helpers/alchemy";
import { deleteDoc, updateDoc } from "../../helpers/firebaseAdmin";
import { lotyPartnerMagicAdmin } from "../../helpers/magic";
import { isValidEthAddress } from "../../helpers/web3";

type Data = {
  status: string;
  error_message?: string;
  nft?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { contractAddress, idToken } = req.body;
    console.log("METHOD:", req.method);
    console.log({ idToken, contractAddress });

    if (!idToken || !contractAddress || typeof contractAddress !== "string") {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid Parameters",
      });
    }

    const publicAddress = lotyPartnerMagicAdmin.token.getPublicAddress(idToken);
    console.log({ publicAddress });

    if (!publicAddress) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid User",
      });
    }

    if (!contractAddress || !isValidEthAddress(contractAddress)) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid Contract Address",
      });
    }

    const partnerAddress = publicAddress.toLowerCase();
    const contractAddressLowerCase = contractAddress.toLowerCase();
    const scannedCollectionId = `${contractAddressLowerCase}_${partnerAddress}`;
    if (req.method === "DELETE") {
      await deleteDoc(scannedCollectionId, DB_COLLECTION.scannedCollections);

      return res.status(200).json({
        status: "success",
      });
    }

    const contractMetadata = await getContractMetadata(
      contractAddressLowerCase
    );

    const name = contractMetadata?.name ? contractMetadata?.name : "";
    const image =
      contractMetadata?.openSea && contractMetadata?.openSea?.imageUrl
        ? contractMetadata?.openSea?.imageUrl
        : "";
    const description =
      contractMetadata?.openSea && contractMetadata?.openSea?.description
        ? contractMetadata?.openSea?.description
        : contractMetadata?.symbol;

    const collectionData = {
      partnerAddress,
      name,
      image,
      description,
      contractAddress: contractAddressLowerCase,
    };

    await updateDoc(
      scannedCollectionId,
      DB_COLLECTION.scannedCollections,
      collectionData
    );

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
