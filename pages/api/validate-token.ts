import type { NextApiRequest, NextApiResponse } from "next";
import { validateToken } from "../../helpers/utils";

type Data = {
  status: string;
  error_message?: string;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { publicAddress, token } = req.query;

    if (
      !publicAddress ||
      !token ||
      typeof publicAddress !== "string" ||
      typeof token !== "string"
    ) {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid Parameters",
      });
    }

    const add = publicAddress as string;
    const tok = token as string;
    const response = await validateToken(add, tok);

    if (response === "error") {
      return res.status(400).json({
        status: "failed",
        error_message: "invalid Parameters",
      });
    }

    if (response === "withtime") {
      return res.status(200).json({
        status: "success",
        token: "",
      });
    }
    return res.status(200).json({
      status: "success",
      token: response,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      status: "failed",
      error_message: "Server Error",
    });
  }
}
