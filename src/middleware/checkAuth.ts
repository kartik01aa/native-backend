import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/schema";
import "dotenv/config";

export interface AuthRequest extends Request {
  user: string;
}

const checkAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        error: "Authorization is required",
      });
    }
    const token = authorization;
    const { id }: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const existingUser = await User.findOne({ _id: id });

    if (existingUser) {
      req.user = existingUser?.id;
    }
    next();
  } catch (error) {
    console.log("error in authenticationMiddleware", error);
    throw error;
  }
};
export default checkAuth;
