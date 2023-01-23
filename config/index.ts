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
