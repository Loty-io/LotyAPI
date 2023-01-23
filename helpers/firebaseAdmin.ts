import { DB_COLLECTION } from "../config";

const firebaseAdmin = require("firebase-admin");

if (firebaseAdmin.apps.length === 0) {
  const serviceAccount = {
    type: "service_account",
    project_id: "loty-7e8e8",
    private_key_id: "47e1fe33d406265b75c9bddaf29be80793f57a41",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1UkwpaybQ92vO\n/J132QCrV6ST4v1O/xBoVebDF5T6ktlGvdaZuwMz+HHB5iyYQ7TV/q4Mj7bQF0ER\nYwtysmaO1oUv4nmfULxUnXMRGAlBArf2lDdayWK82iM8Djj5oxmTiq1sXlBx6GtR\nY8PHY9tA8cpLVE93DOb4h+FS7PfTpYOepr7F0o50P0UUJpUbwSAspDwDzyOGEn9s\nbhKo5YgZjVeRzRK4JY+oOQs51wW2fv1Hja0F6AHOEkNPlFBhcryJmVxwoTGsW5jO\nURR4m5gCV6LRqvO7LbF52Gv7sKLXx5afy8HguY+Tl5Bz51EIgqqqFND7ti6GQzyJ\nt8eop2XnAgMBAAECggEAVpNhAjXDZut8cmxz05GtnCJQ1rv/LwTilK7PbD+KRspv\nLDPgj66XrOznhCmfCWTqp3LfL+g+5cT0sJSWFsHP7kvHdEGyyLsH8W7sTjEn2f6u\nT/IdLCAUIRAW2sn/slKKF8STYbb2uiy7cTUtebrYKX5JlQZAmxtx/SEEGVBEVK1Y\ng6Xj5vFU/M9H3Rkywc28QMhHdv+IdkRdTJG/zzioa/hcG/zrgk9WFucjcVj8czPn\nbpNd9xUY+1AAlEccwEWECwJoQAR2NjWe7Sm1RWb4oU8ZwYWURaj/lASBRJvL4WGl\nnog7Ho9+bLfxmMvQnw1lHPsonKacrIWWN4isRGOAQQKBgQDoRRS5mKvWZ0YfQNzP\njXVoW6tV3TgaMFahidXu6CWQzDTodYQCIqCa5++3O3lCIUFpY6ICc/1nFr6y1bHk\n0kIf6vh1Sh5ROIPUCsKz6nfooO9FCAhwecT0sQB1oVwoe6EJRMuEnkw3e1HVvp6h\n1X5TSfIqr0ux/WEAr6ckVyotrwKBgQDH2K78EoD47MVGUTOWBBkkgUCQBuvcjcAo\nOfmndYvW7tUDgtWFOADpT+bwxToDwNN3AefVSZqgV18d6DMb8mP8ZgdVzaCBqXI3\neLYNLoSQdDnn6R7qLcOq1+2++YYNBPYYmD7C6g0HfmraJl3YYBga8pK3YcqFR3Mt\nxXU7tJRRSQKBgQCcxfvuJdFefwiCkdo4sWdcz/r+krmKW7QthoaCoeixKlRPzvoS\nIuM6i3BuwdLfwuiOxPQWKcoRafW/aaOQKib9ujCHokaCVd4NIlI28/yJZQ77Dif8\nGwTIkCwaOZalsISKaAfidKJHFJKw7d/OpfaFKzUsgHNcKQTvXKA5VCgg+wKBgFT7\nmuXMhJXWMcnGLBamJX71i9vzZYdDrCwvAzAn91Bt/Z1hnKTq/NA6Ty2h4RrJe+NG\npyx3AU8f+G3CWUGQIN6rEIF3UMLyqIRYS6ptVqgLFLi+1Ium7GcRLaOhflS5AGHT\nFBVU7Dd8lbmwyQWDT5zd/HAJINLuYFddeY3rK4spAoGAc/MjNOhqIxnqOIG1iD/t\nqYdnGu11513ALO59dU86VdSAWdW+lF1SqzKP+wwjsJLGaSiSaLpbcvBMVpmxaCG0\nFMkUJnViFElYo7tOZYGbpw0deCN05JVM6VtOLXGH0/nXMVary+v8bEQUmvQhmHtz\nb/1gfH9JAVuIjI0zwjMBPXA=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-92hx0@loty-7e8e8.iam.gserviceaccount.com",
    client_id: "116566023378816717983",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-92hx0%40loty-7e8e8.iam.gserviceaccount.com",
  };

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}

export const admin = firebaseAdmin;

export const executeQuery = async (query: any) => {
  const querySnapshot = await query.get();
  const result: any[] = [];

  if (!querySnapshot || querySnapshot.empty) {
    return result;
  }

  querySnapshot.forEach((doc: any) => {
    const data = doc.data();
    if (doc.id) {
      data.id = doc.id;
    }

    if (data.updatedAt && data.updatedAt.toDate) {
      data.updatedAt = data.updatedAt.toDate();
    }

    if (data.backedUpAt && data.backedUpAt.toDate) {
      data.backedUpAt = data.backedUpAt.toDate();
    }

    if (data.createdAt && data.createdAt.toDate) {
      data.createdAt = data.createdAt.toDate();
    }

    result.push(data);
  });

  return result;
};

const getServerTimestamp = () => admin.firestore.FieldValue.serverTimestamp();

export const addDoc = async (collectionName: string, data: any) => {
  try {
    const res = await admin
      .firestore()
      .collection(collectionName)
      .add({
        ...data,
        createdAt: getServerTimestamp(),
        updatedAt: getServerTimestamp(),
      });
    return res;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const createDoc = async (
  docId: string,
  collectionName: string,
  data: any
) => {
  try {
    const res = await admin
      .firestore()
      .collection(collectionName)
      .doc(docId)
      .set({
        ...data,
        createdAt: getServerTimestamp(),
        updatedAt: getServerTimestamp(),
      });
    return res;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const deleteDoc = async (docId: string, collectionName: string) => {
  const res = await admin
    .firestore()
    .collection(collectionName)
    .doc(docId)
    .delete();
  return res;
};

export const updateDoc = async (
  docId: string,
  collectionName: string,
  data: any
) => {
  const ref = admin.firestore().collection(collectionName).doc(docId);

  const res = await ref.set(
    {
      ...data,
      updatedAt: getServerTimestamp(),
    },
    { merge: true }
  );
  return res;
};

export const getDoc = async (docId: string, collectionName: string) => {
  const res = await admin
    .firestore()
    .collection(collectionName)
    .doc(docId)
    .get();
  return res;
};

export const getNftsFromQrCode = async (qrCodeData: string) => {
  const query = await admin
    .firestore()
    .collection(DB_COLLECTION.qrCodes)
    .where("qrCodeData", "==", qrCodeData)
    .orderBy("updatedAt", "desc");
  const result = await executeQuery(query);
  return result;
};

export const getNftsFromCheckinCode = async (checkinCode: string) => {
  const query = await admin
    .firestore()
    .collection(DB_COLLECTION.qrCodes)
    .where("checkinCode", "==", checkinCode)
    .orderBy("updatedAt", "desc");
  const result = await executeQuery(query);
  return result;
};

export const getScannedCollections = async (partnerAddress: string) => {
  const query = await admin
    .firestore()
    .collection(DB_COLLECTION.scannedCollections)
    .where("partnerAddress", "==", partnerAddress)
    .orderBy("updatedAt", "desc");
  const result = await executeQuery(query);
  return result;
};

export const getScannedNfts = async (
  partnerAddress: string,
  contractAddress: string
) => {
  const query = await admin
    .firestore()
    .collection(DB_COLLECTION.scannedNfts)
    .where("partnerAddress", "==", partnerAddress)
    .where("contractAddress", "==", contractAddress)
    .orderBy("updatedAt", "desc");
  const result = await executeQuery(query);
  return result;
};

export const checkIfHasScannedNft = async (
  partnerAddress: string,
  contractAddressLowerCase: string,
  tokenId: string
) => {
  const scannedNfts = await getScannedNfts(
    partnerAddress,
    contractAddressLowerCase
  );

  const hasScannedNft = scannedNfts.some((scannedNft) => {
    return (
      scannedNft?.contractAddress === contractAddressLowerCase &&
      scannedNft?.tokenId === tokenId
    );
  });

  return hasScannedNft;
};
