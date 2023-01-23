import type { NextApiRequest, NextApiResponse } from "next";
import { IS_TESTING } from "../../config";
import { getScannedNfts } from "../../helpers/firebaseAdmin";
import { lotyPartnerMagicAdmin } from "../../helpers/magic";

type Data = {
  status: string;
  error_message?: string;
  nfts?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { idToken, contractAddress } = req.query;

    if (!idToken || !contractAddress || typeof contractAddress !== "string") {
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
    const contractAddressLowerCase = contractAddress.toLowerCase();

    const nfts = await getScannedNfts(partnerAddress, contractAddressLowerCase);

    if (IS_TESTING) {
      console.log({
        partnerAddress,
        contractAddress: contractAddressLowerCase,
        nfts,
      });
    }

    return res.status(200).json({
      status: "success",
      nfts,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
