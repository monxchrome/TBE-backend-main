import { IUser } from "./user.types.js";

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export type ITokenPayload = Pick<IUser, "_id" | "firstName">;
export type IActionTokenPayload = Pick<ITokenPayload, "_id">;
