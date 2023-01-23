import type { NextApiRequest, NextApiResponse } from "next";
import { getScannedCollections } from "../../helpers/firebaseAdmin";
import { lotyPartnerMagicAdmin } from "../../helpers/magic";

type Data = {
  status: string;
  error_message?: string;
  scannedNftCollections?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { idToken } = req.query;

    if (!idToken) {
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
    const scannedNftCollections = await getScannedCollections(partnerAddress);

    return res.status(200).json({
      status: "success",
      scannedNftCollections,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
