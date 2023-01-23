const Web3 = require("web3");

export const isValidEthAddress = (address: string) =>
  Web3.utils.isAddress(address);
