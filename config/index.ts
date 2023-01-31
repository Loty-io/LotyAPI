import { abiStaging, abiProduction } from "./abi";

export const IS_TESTING = process.env.NODE_ENV === "development";

export const DEV_MODE_PARAMS = {
  email: "test+success@magic.link",
  publicAddress: "0xff2ef975bba377ea23b4e5b372eb33d7984bc2d5",
  emptyArray: [],
};

export const QR_CODE_VALIDITY_IN_MS = 10000;
export const CHECKIN_CODE_VALIDITY_IN_MS = 600000;
export const DB_COLLECTION = {
  qrCodes: "qrCodes",
  nfts: "nfts",
  scannedCollections: "scannedCollections",
  scannedNfts: "scannedNfts",
};

export const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";
export const ALCHEMY_API_KEY = process.env.NEXT_ALCHEMY_API_KEY || "";
export const PROVIDER_NETWORK = process.env.NEXT_PROVIDER_NETWORK || "maticmum";
export const CHAIN_NAME = process.env.NEXT_CHAIN_NAME || "matic";

//deprecated
export const abi =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? abiStaging
    : abiProduction;
export const PROVIDER_URL = process.env.NEXT_PUBLIC_PROVIDER_URL || "";
export const CALLER = process.env.NEXT_PUBLIC_CALLER || "";
