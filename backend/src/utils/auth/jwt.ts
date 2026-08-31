import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../../types/index.js";
export const generateAccessToken = (user: IUser) => {
  const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessTokenSecret,
    options
  );
};
export const generateRefreshToken = (user: IUser) => {
  const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    refreshTokenSecret,
    options
  );
};
