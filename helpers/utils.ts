import jwt_decode from "jwt-decode";
import JWT from "jwt-encode";
import { toInteger } from "lodash";
import { decode } from "punycode";
const truncateString = (str: string, len: number) => str.slice?.(0, len);

export const truncateStringIfNeeded = (text: string, limit: number) => {
  if (text && text.length > limit) {
    return `${truncateString(text, limit)}...`;
  }

  return text;
};

export const typeLogin = (type: string, token: string, pa: string) => {
  // console.log("--------------------ENTRA EN LA FUNCIÓN typeLogin-----------");
  // console.log(type);
  // console.log(token);
  // console.log(pa);
  const decoded_token = jwt_decode(token) as JSON;
  console.log(token);

  if (type === "walletconnect") {
    //*aqui adentro va todas las evaluciones del token
    console.log("-----------ENTRA A WALLETCONNECT---------------");
    // console.log(decoded_token.address);
    // console.log(pa);
    const jwt = JWT(decoded_token, "ip_sjdkla16u380fog");
    console.log(jwt);
    console.log(token);
    //WALLETCONNECT
    if (token !== jwt || pa !== decoded_token.address) {
      return false;
    }
    const timestamp = Math.floor(new Date().getTime() / 1000);
    // console.log("aqui llega");
    if (timestamp > decoded_token.exp) {
      return false;
    }
    return true; //TODO aqui va un true
  } else {
    //*aqui adentro va todas las evaluciones del token
    console.log("---------------ENTRA A SOCIAL Y EMAIL LOGIN-----------");
    const public_key = decoded_token.wallets[0].public_key;
    console.log(public_key);
    const publicKeyToAddress = require("ethereum-public-key-to-address");
    console.log(publicKeyToAddress(public_key));
    if (publicKeyToAddress(public_key) == pa) {
      return true;
    } else {
      return false;
    }
  }
};

export const validateToken = async (publicAddress: string, token: string) => {
  const decodeTok = jwt_decode(token) as JSON;
  const jwt = JWT(decodeTok, "ip_sjdkla16u380fog");

  if (token !== jwt) {
    return "error";
  }

  if (publicAddress !== decodeTok.address) {
    return "error";
  }

  const timestamp = Math.floor(new Date().getTime() / 1);

  if (decodeTok.exp <= timestamp) {
    return "withtime";
  }

  const newtoken = getIdtoken(decodeTok.address);
  console.log(newtoken);
  if (!newtoken) {
    return "error";
  }
  return newtoken;
};

const getIdtoken = (address: string) => {
  let exp = new Date();
  exp.setDate(exp.getDate() + 30);
  const dateExp = exp.getTime();

  //time
  let now = new Date().getTime();
  console.log(now);
  const timestamp = Math.floor(now / 1);
  // console.log(timestamp);
  // console.log('Hola mundo');
  const secret = "ip_sjdkla16u380fog";
  const data = {
    address: address,
    typeLogin: "walleconnect",
    name: "Loty",
    iat: timestamp,
    exp: dateExp,
  };
  const jwt = JWT(data, secret);
  // console.log(jwt);

  return jwt;
};
