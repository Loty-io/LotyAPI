import type { NextApiRequest, NextApiResponse } from "next";
import { CHECKIN_CODE_VALIDITY_IN_MS, DB_COLLECTION } from "../../config";
import {
  checkIfHasScannedNft,
  getNftsFromQrCode,
  getScannedCollections,
  updateDoc,
} from "../../helpers/firebaseAdmin";
import { lotyPartnerMagicAdmin } from "../../helpers/magic";

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
    const { qrCodeData, idToken, publicAddress } = req.query;

    if (!qrCodeData || typeof qrCodeData !== "string") {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid Parameters",
      });
    }

    const userAddress = publicAddress;

    console.log({ qrCodeData, publicAddress: userAddress });

    if (!userAddress) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid User",
      });
    }

    const partnerAddress = userAddress.toLowerCase();
    console.log({ partnerAddress });

    const [nfts, scannedNftCollections] = await Promise.all([
      getNftsFromQrCode(qrCodeData),
      getScannedCollections(partnerAddress),
    ]);

    if (!nfts.length) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid QR Code",
      });
    }

    const nft = nfts[0];
    console.log({ nft });

    if (qrCodeData !== nft.qrCodeData) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid QR Code",
      });
    }

    if (Date.now() > nft.qrCodeDataExpiryDate) {
      return res.status(400).json({
        status: "failed",
        error_message: "Expired QR Code",
      });
    }

    const contractAddressArray = scannedNftCollections.map(
      ({ contractAddress }: { contractAddress: string }) =>
        contractAddress.toLowerCase()
    );
    const { contractAddress, tokenId } = nft;
    const contractAddressLowerCase = contractAddress.toLowerCase();
    console.log({ contractAddress, contractAddressArray });

    if (
      !contractAddressLowerCase ||
      !contractAddressArray.includes(contractAddressLowerCase)
    ) {
      return res.status(400).json({
        status: "failed",
        error_message: "This NFT contract address hasn't been added",
      });
    }

    const nftData = {
      qrCodeData: "",
      qrCodeDataExpiryDate: Date.now(),
      checkinCode: qrCodeData,
      checkinCodeExpiryDate: Date.now() + CHECKIN_CODE_VALIDITY_IN_MS,
    };

    await updateDoc(nft.id, DB_COLLECTION.qrCodes, nftData);

    return res.status(200).json({
      status: "success",
      nft,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
