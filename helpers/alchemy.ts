import { Network, Alchemy } from "alchemy-sdk";

export const USE_TESTNET = false;
export const ALCHEMY_KEY = USE_TESTNET
  ? "2-gT9-cGxFpw1gdHq5S8YIN9-7Ai5vm5"
  : "aPVkn_8kGBNfEP5R8UjiOWPkswH6mZ0x";

const settings = {
  apiKey: ALCHEMY_KEY,
  network: USE_TESTNET ? Network.ETH_GOERLI : Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const parseAlchemyData = ({
  title = " ",
  description = " ",
  contract: { address: contractAddress = "", name: collectionName = "" },
  tokenId = "",
  media = "",
  rawMetadata: { attributes },
}) => {
  const image =
    (media &&
      media.length &&
      media[0]?.gateway &&
      media[0]?.gateway.replace("ipfs.io", "test.mypinata.cloud")) ??
    "";
  return {
    image,
    name: title,
    description,
    collectionName: collectionName || description,
    contractAddress,
    tokenId,
    attributes,
  };
};

export const getNftsForOwner = async (address: string) => {
  try {
    const res = await alchemy.nft.getNftsForOwner(address);
    const assets = res?.ownedNfts?.map((data) => {
      return { ...parseAlchemyData(data), owner: address };
    });

    const result = [];

    await Promise.all(
      assets.map(async (asset) => {
        try {
          const image = asset?.image;
          const contractAddress = asset?.contractAddress;
          const tokenId = asset?.tokenId;

          if (!image && contractAddress && tokenId) {
            const { image } = await getNFTMetadata(
              contractAddress,
              Number(tokenId)
            );

            const isValidImage = image && typeof image === "string";

            if (!isValidImage) {
              throw new Error("invalid image");
            }

            const imageUrl = image.replace(
              "ipfs://",
              "https://test.mypinata.cloud/ipfs/"
            );

            result.push({ ...asset, ...metadata, image: imageUrl });
          }
        } catch (error) {
          console.log(error);
        }

        result.push(asset);
      })
    );

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getNFTMetadata = async (
  contractAddress: string,
  tokenId: string
) => {
  try {
    const nftData = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    const asset = parseAlchemyData(nftData);

    return asset;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getOwnersForNft = async (
  contractAddress: string,
  tokenId: string
) => {
  try {
    const { owners } = await alchemy.nft.getOwnersForNft(
      contractAddress,
      tokenId
    );

    return owners.map((string) => string.toLowerCase());
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getContractMetadata = async (contractAddress: string) => {
  try {
    const response = await alchemy.nft.getContractMetadata(contractAddress);

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
