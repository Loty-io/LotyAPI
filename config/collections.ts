type Collection = {
  contractAddress: string;
  contractType: ContractType;
};

type Collections = {
  [id: string]: Collection;
};

enum ContractType {
  NFTDrop,
  NFTCollection,
}

const spaInTheHouse: Collection = {
  contractAddress: "0x6ae3316f2193D45780C3BA6fdc88Fdbd182E0667",
  contractType: ContractType.NFTDrop,
};

const lotyTest: Collection = {
  contractAddress: "0x7c435572A6BD83465d918310086Ca0da186CF804",
  contractType: ContractType.NFTCollection,
};

const lotyDropTest: Collection = {
  contractAddress: "0x014B285560caFE34E249ea15aC86d051930C54Ac",
  contractType: ContractType.NFTDrop,
};

const collectionsStaging: Collections = {
  "0x6ae3316f2193D45780C3BA6fdc88Fdbd182E0667": spaInTheHouse,
  "0x7c435572A6BD83465d918310086Ca0da186CF804": lotyTest,
};

const collectionProd: Collections = {
  "0x014B285560caFE34E249ea15aC86d051930C54Ac": lotyDropTest,
};

export type { Collection, Collections };
export { collectionsStaging, collectionProd, ContractType };
