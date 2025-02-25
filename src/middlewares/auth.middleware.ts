import { NextFunction, Request, Response } from "express";

import { EActionToken } from "../enums/actionToken.enum";
import { EToken } from "../enums/token.enum";
import { ApiError } from "../errors";
import { Action } from "../models/Action.model";
import { oldPassword } from "../models/OldPassword.model";
import { Token } from "../models/Token.model";
import { oauthService } from "../services/oauth.service";
import { tokenService } from "../services/token.service";
import { UserValidator } from "../validators/user.validator";

class AuthMiddleware {
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        throw new ApiError("Your refresh token has been expired", 404);
      }

      const jwtPayload = tokenService.checkToken(refreshToken, EToken.refresh);
      const tokenData = await Token.findOne({ refreshToken });

      if (!tokenData) {
        throw new ApiError("Refresh token is not valid!", 401);
      }

      req.res!.locals = { tokenData, jwtPayload };
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        throw new ApiError("Access token is not valid!", 401);
      }

      const jwtPayload = tokenService.checkToken(accessToken, EToken.access);
      const tokenData = await Token.findOne({ accessToken });
      if (!tokenData) {
        throw new ApiError("Access token is not valid!", 401);
      }

      req.res!.locals = { tokenData, jwtPayload };
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isValidChangePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error } = UserValidator.changePassword.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 409);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isValidChangeEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error } = UserValidator.changeEmail.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 409);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkActionForgotToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actionToken = req.params.token;

      if (!actionToken) {
        throw new ApiError("Action token not found!", 404);
      }

      const jwtPayload = tokenService.checkActionToken(
        actionToken,
        EActionToken.forgot,
      );

      const tokenData = Action.findOne({ actionToken });

      if (!tokenData) {
        throw new ApiError("Action token not valid", 401);
      }

      req.res!.locals = { tokenData, jwtPayload };

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkOldPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { body } = req.body;
      const { tokenData } = req.res!.locals;

      const oldPasswords = await oldPassword.find({
        _user_id: tokenData._id,
      });

      if (!oldPasswords) {
        next();
      }

      await Promise.all(
        oldPasswords.map(async (record) => {
          const isMatched = await oauthService.compare(
            body.password,
            record.password,
          );
          if (isMatched) {
            throw new ApiError("Your new password is same as old", 409);
          }
        }),
      );

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isValidForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error } = UserValidator.changePassword.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 409);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
