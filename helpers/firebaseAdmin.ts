import { DB_COLLECTION } from "../config";

const firebaseAdmin = require("firebase-admin");

if (firebaseAdmin.apps.length === 0) {
  const serviceAccount = {
    "type": "service_account",
    "project_id": "lotydb",
    "private_key_id": "c0423a9c733fc6ce07f6b2c1bc578300252a8e13",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCcnvQGo5uskMfw\n3PMOBrnaFeHV/T0ZCOTBNwhnfRb4Knf8j9p1NGyQ/NPkuPuZ+ijHlvWFqMm/opY7\n8zE75c1IGTdmQY/WofCdj9qlsQqQ/ZJZH8UHsR9bOPUOAYGrXAlUF58FQynPtFjZ\nFk9d1fdn5mBBjIdTXsRjt0dLf0aNLZIbwW/tDFnJCixTSzB03Yjku7Bud8JR1Z4O\nCbefTv7FsKO6gIX8nuYHkcY0PAWC73LWOZkNdqs/Wg5Wn9ScWxhmvBnyKfxvaRDd\nDfXcKU/ZGMgPnlmC96AHGh3SnxZuZNi3KSbVtO7ViAXuNm0NuXztGSOQ7XVB5l0W\ndlV9hNlzAgMBAAECggEAS5CHVQKv07Dgvo2juPM2zQk8thVh2ofHco8+P0wDfoVi\n8ZhoQp8h+Ev7YcF8Jryi2zUyzSNz/0EO8eqyKN+FTRFZgL0GDHyCTkq/J60E15J3\n/wcMdVsYMVeIKBNDAC2+FHP3Fb9jV2KAcXDJpxDaNqdYbpfCHM++uguN2teT7v25\nmX8k4IRfNSUqcXYpmw1tw3OKDR+kQ4n+HAoT9SIcR7TxfrH45v1/9n9J+SynpbOF\nNr+2g4ySjGAeJMtu2fTi9HGfkfjyjZYZ80iPB/Yf34zkD3ecLyfkze0Aamk7kefa\nkoaNnMlyPxpy/09XC8WIYXjIDkxaZJIflHMx96jNjQKBgQDTsdgsYw247ncdT6jh\n5ePrh69jd/hLJYQyesHNq8zJqW2WbQzKEg9eZec5672ADcaiPF9TbnES78fCGcfB\nyKGJTz1B6UGGCHf5ltdEy/FjI6yrYMFvTYTaAliKkqQNQ8DjG0S4//ZEGBeUPwAh\nxMSgGJ69Am6XR9XJgA34xqEWrQKBgQC9Zl8DUGdjYPH5fDT0PSM/SSlBxcPQrQjW\nASuJVjKSwNptIP3fLxSHEZ+ZF36blwhqDSwksxqcsgRH7mDgAfXxD+NujDeemY3p\nS+a0wEQ7eMmGocpGqoDp+b8uE1pPDnZGwTor5WsvoLImBtfnpsFUIOS5gqbGrzkD\nGdUKAANUnwKBgE2/9ctnnfSb8LedOEOvcWRh8zKvL0w6PTFlEKT/QjmWtp8W8imN\nNIPRHXmScYkEhj2zurcjyvfPhShu24T6sQmDRtZcWyplFdtfYTTtSnzE73gKE0FT\n0UVYszhB32rXxZIjw7vGlqYvywkxklTUtfqu0C5PJFr/kS9ujrMeELAJAoGBAICF\nEd4W1kE6TJhFr004m01bYNKP1yMn94H4Q0mrIyAwG0fIBl1G/j/1Nn5U0gXUQ9Jq\n49R3cIx5w6vn1vbKfdA5PtQJ88f8XK69YWyvtt1ARkfES5UOJ/IdFZy3ZyWUI7A5\neDbHM6ea/KgPJry7jB6BP5OeU3so9Z/kDIr/nULzAoGBAJdgvBfhd2CZFwcsYPAU\nPasb5dSM/vbcM5DGKULGqdgPI6RZvq4VZtKMoII/ywI4WDc57W7+ZZHQqMnQ4GQq\nQV4JmKAJvjI2+mLZvyMInMYRJXPRYcGfvvB0ghOChdB6oG5S9mUT8mDVRlRu0QBR\nxE71lpNR1XCOup+5l2BAaAXu\n-----END PRIVATE KEY-----\n",
    "client_email": "lotydb-dev@lotydb.iam.gserviceaccount.com",
    "client_id": "111288423140208914521",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/lotydb-dev%40lotydb.iam.gserviceaccount.com"
  }

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
