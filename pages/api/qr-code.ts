import type { NextApiRequest, NextApiResponse } from "next";
import {
  DB_COLLECTION,
  DEV_MODE_PARAMS,
  IS_TESTING,
  QR_CODE_VALIDITY_IN_MS,
} from "../../config";
import { getNFTMetadata, getOwnersForNft } from "../../helpers/alchemy";
import { addDoc } from "../../helpers/firebaseAdmin";
import { lotyMagicAdmin } from "../../helpers/magic";
import { truncateStringIfNeeded, typeLogin } from "../../helpers/utils";

import jwt_decode from "jwt-decode";
import { decode } from "punycode";

type Data = {
  status: string;
  error_message?: string;
  qrCodeData?: string;
};

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { contractAddress, tokenId, public_address, typeOflogin, id_token } =
      req.query;
    let token = "";
    let publicAddress = "";
    console.log("-------------------INICIA API-------------------------------");
    console.log(contractAddress);
    console.log(tokenId);
    console.log(public_address);
    console.log(typeOflogin);
    console.log(id_token);

    if (
      !contractAddress ||
      !tokenId ||
      typeof contractAddress !== "string" ||
      typeof tokenId !== "string"
    ) {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid Parameters",
      });
    }
    const add = (await public_address) as string;
    const tpel = await `${typeOflogin}`;
    const itok = (await id_token) as string;
    console.log(
      "-------------------------NUEVOS VARIABLES------------------------"
    );
    console.log(add);
    console.log(tpel);
    console.log(itok);

    const idToken = await typeLogin(tpel, itok, add);
    if (!idToken) {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid validation",
      });
    }
    publicAddress = `${public_address}`;

    console.log({ publicAddress });

    if (!publicAddress) {
      return res.status(400).json({
        status: "failed",
        error_message: "Invalid User",
      });
    }

    const contractAddressLowerCase = contractAddress.toLowerCase();
    const issuer = publicAddress.toLowerCase();

    const [
      owners,
      { image = "", name = "", description = "", collectionName = "" },
    ] = await Promise.all([
      getOwnersForNft(contractAddressLowerCase, tokenId),
      getNFTMetadata(contractAddressLowerCase, tokenId),
    ]);

    console.log({ owners });

    if (!owners.length || !owners.includes(issuer)) {
      return res.status(400).json({
        status: "failed",
        error_message: "NFT Not Found",
      });
    }

    const qrCodeData = String(randomNumber(100000, 999999));

    const nftData = {
      name,
      description: truncateStringIfNeeded(description, 280),
      image,
      collectionName,
      qrCodeData,
      qrCodeDataExpiryDate: Date.now() + QR_CODE_VALIDITY_IN_MS,
      owner: issuer,
      contractAddress: contractAddressLowerCase,
      tokenId,
    };

    await addDoc(DB_COLLECTION.qrCodes, nftData);

    return res.status(200).json({
      status: "success",
      qrCodeData,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
// function jwt_decode(token: string): JSON {
//   throw new Error("Function not implemented.");
// }
