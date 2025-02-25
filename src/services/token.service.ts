import * as jwt from "jsonwebtoken";

import { configs } from "../configs/index.js";
import { EActionToken } from "../enums/actionToken.enum.js";
import { EToken } from "../enums/token.enum.js";
import { ApiError } from "../errors/index.js";
import {
  IActionTokenPayload,
  ITokenPair,
  ITokenPayload,
} from "../types/token.types.js";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    // @ts-ignore
    const accessToken = jwt.sign(payload, configs.ACCESS_SECRET, {
      expiresIn: configs.ACCESS_EXPIRES_IN,
    });
    // @ts-ignore
    const refreshToken = jwt.sign(payload, configs.REFRESH_SECRET, {
      expiresIn: configs.REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, tokenType = EToken.access): ITokenPayload {
    let secret = "";

    try {
      switch (tokenType) {
        case EToken.access:
          secret = configs.ACCESS_SECRET;
          break;
        case EToken.refresh:
          secret = configs.REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        throw new ApiError(`Token error: ${e.message}`, 401);
      } else if (e instanceof jwt.TokenExpiredError) {
        throw new ApiError("Token expired", 401);
      } else if (e instanceof Error) {
        throw new ApiError(e.message, 500);
      } else {
        throw new ApiError("Unknown token error", 500);
      }
    }
  }

  public generateActionToken(
    payload: IActionTokenPayload,
    tokenType: EActionToken,
  ): string {
    let secret = "";

    try {
      switch (tokenType) {
        case EActionToken.activate:
          secret = configs.ACTIVATE_SECRET;
          break;

        case EActionToken.forgot:
          secret = configs.FORGOT_SECRET;
          break;
      }

      return jwt.sign(payload, secret, { expiresIn: "7d" });
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        throw new ApiError(`Token error: ${e.message}`, 401);
      } else if (e instanceof jwt.TokenExpiredError) {
        throw new ApiError("Token expired", 401);
      } else if (e instanceof Error) {
        throw new ApiError(e.message, 500);
      } else {
        throw new ApiError("Unknown token error", 500);
      }
    }
  }

  public checkActionToken(token: string, tokenType: EActionToken) {
    try {
      let secret = "";

      switch (tokenType) {
        case EActionToken.forgot:
          secret = configs.FORGOT_SECRET;
          break;
        case EActionToken.activate:
          secret = configs.ACTIVATE_SECRET;
          break;
      }

      return jwt.verify(token, secret) as IActionTokenPayload;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new ApiError("Action token has expired", 401);
      } else if (e instanceof jwt.JsonWebTokenError) {
        throw new ApiError(`Invalid action token: ${e.message}`, 401);
      } else if (e instanceof Error) {
        throw new ApiError(e.message, 500);
      } else {
        throw new ApiError("Unknown action token error", 500);
      }
    }
  }
}

export const tokenService = new TokenService();
