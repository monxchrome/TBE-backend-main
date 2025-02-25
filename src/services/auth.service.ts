import { ApiError } from "../errors/index.js";
import { Token } from "../models/Token.model.js";
import { User } from "../models/User.model.js";
import { ICredentials } from "../types/auth.types.js";
import { ITokenPair } from "../types/token.types.js";
import { IUser } from "../types/user.types.js";
import { oauthService } from "./oauth.service.js";
import { tokenService } from "./token.service.js";

class AuthService {
  public async register(body: IUser) {
    try {
      const { password } = body;

      const hashedPassword = await oauthService.hash(password);
      await User.create({
        ...body,
        password: hashedPassword,
      });
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      } else if (e instanceof Error) {
        throw new ApiError(e.message, 500);
      } else {
        throw new ApiError("Unknown error", 500);
      }
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser,
  ): Promise<ITokenPair> {
    try {
      const isMatched = await oauthService.compare(
        credentials.password,
        user.password,
      );

      if (!isMatched) {
        throw new ApiError("Email or password incorrect!", 400);
      }

      const tokenPair = tokenService.generateTokenPair({
        _id: user._id,
        username: user.username,
      });

      await Token.create({
        _user_id: user._id,
        ...tokenPair,
      });

      return tokenPair;
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      } else if (e instanceof Error) {
        throw new ApiError(e.message, 500);
      } else {
        throw new ApiError("Unknown error", 500);
      }
    }
  }
}

export const authService = new AuthService();
