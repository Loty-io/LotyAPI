import type { NextApiRequest, NextApiResponse } from "next";
import { DB_COLLECTION } from "../../config";
import { getContractMetadata } from "../../helpers/alchemy";
import {
  addDoc,
  getNftsFromCheckinCode,
  getScannedCollections,
  updateDoc,
} from "../../helpers/firebaseAdmin";
import { lotyPartnerMagicAdmin } from "../../helpers/magic";

type Data = {
  status: string;
  error_message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { qrCodeData, idToken } = req.body;

    if (!qrCodeData || !idToken || typeof qrCodeData !== "string") {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid Parameters",
      });
    }

    const publicAddress = lotyPartnerMagicAdmin.token.getPublicAddress(idToken);

    if (!publicAddress || typeof publicAddress !== "string") {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid User",
      });
    }

    const partnerAddress = publicAddress.toLowerCase();
    const [nfts, scannedNftCollections] = await Promise.all([
      getNftsFromCheckinCode(qrCodeData),
      getScannedCollections(partnerAddress),
    ]);

    if (!nfts.length) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid QR Code",
      });
    }

    const nftData = nfts[0];
    const { contractAddress, checkinCode, tokenId, checkinCodeExpiryDate } =
      nftData;

    if (qrCodeData !== checkinCode) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid QR Code",
      });
    }

    if (Date.now() > checkinCodeExpiryDate) {
      return res.status(400).json({
        status: "failed",
        error_message: "Expired QR Code",
      });
    }

    const contractAddressLowerCase = contractAddress.toLowerCase();
    const contractAddressArray = scannedNftCollections.map(
      ({ contractAddress }: { contractAddress: string }) =>
        contractAddress.toLowerCase()
    );

    if (
      !contractAddressLowerCase ||
      !contractAddressArray.includes(contractAddressLowerCase)
    ) {
      return res.status(400).json({
        status: "failed",
        error_message: "This NFT contract address hasn't been added",
      });
    }

    const scannedCollectionId = `${contractAddressLowerCase}_${partnerAddress}`;

    const contractMetadata = await getContractMetadata(
      contractAddressLowerCase
    );

    const name = contractMetadata?.name
      ? contractMetadata?.name
      : nftData.collectionName;
    const image =
      contractMetadata?.openSea && contractMetadata?.openSea?.imageUrl
        ? contractMetadata?.openSea?.imageUrl
        : nftData.image;
    const description =
      contractMetadata?.openSea && contractMetadata?.openSea?.description
        ? contractMetadata?.openSea?.description
        : nftData.description;

    const collectionData = {
      partnerAddress,
      name,
      image,
      description,
      contractAddress: contractAddressLowerCase,
    };

    await Promise.all([
      updateDoc(nftData.id, DB_COLLECTION.qrCodes, {
        qrCodeData: "",
        qrCodeDataExpiryDate: Date.now(),
        checkinCode: "",
        checkinCodeExpiryDate: Date.now(),
        lastPartnerAddress: partnerAddress,
      }),
      updateDoc(
        scannedCollectionId,
        DB_COLLECTION.scannedCollections,
        collectionData
      ),
      addDoc(DB_COLLECTION.scannedNfts, {
        ...nftData,
        partnerAddress,
        qrCodeData: null,
        qrCodeDataExpiryDate: null,
        checkinCode: null,
        checkinCodeExpiryDate: null,
        lastPartnerAddress: null,
        id: null,
      }),
    ]);

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
