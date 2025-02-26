import { EActionToken } from "../enums/actionToken.enum";
import { ApiError } from "../errors";
import { Action } from "../models/Action.model";
import { oldPassword } from "../models/OldPassword.model";
import { Token } from "../models/Token.model.js";
import { User } from "../models/User.model.js";
import { ICredentials } from "../types/auth.types.js";
import { ITokenPair, ITokenPayload } from "../types/token.types.js";
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

  public async refresh(
    tokenData: ITokenPair,
    jwtPayload: ITokenPayload,
  ): Promise<ITokenPair> {
    try {
      const tokenPair = tokenService.generateTokenPair({
        _id: jwtPayload._id,
        username: jwtPayload.username,
      });

      await Promise.all([
        Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
        Token.deleteOne({ refreshToken: tokenData.refreshToken }),
      ]);

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

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = (await User.findById(userId)) as IUser;

      const isMatched = await oauthService.compare(oldPassword, user.password);

      if (!isMatched) {
        throw new ApiError("Wrong old password!", 401);
      }

      const HashNewPassword = await oauthService.hash(newPassword);

      await User.updateOne({ _id: userId }, { password: HashNewPassword });
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

  public async forgotPassword(user: IUser): Promise<void> {
    try {
      const actionToken = tokenService.generateActionToken(
        { _id: user._id },
        EActionToken.forgot,
      );

      await Action.create({
        actionToken,
        tokenType: EActionToken.forgot,
        _user_id: user._id,
      });

      await oldPassword.create({ _user_id: user._id, password: user.password });
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
