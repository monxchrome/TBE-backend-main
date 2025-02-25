import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/index.js";
import { User } from "../models/User.model.js";
import { IRequest } from "../types/index.js";
import { AuthValidator } from "../validators/auth.validator.js";
import { UserValidator } from "../validators/user.validator.js";

class UserMiddleware {
  public async isIdValid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!isObjectIdOrHexString(req.params.userId)) {
        return next(new ApiError("User id is invalid", 422));
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async getByIdOrThrow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      res.locals.user = await User.findById(userId);

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isValidCreate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error, value } = UserValidator.create.validate(req.body);

      if (error) {
        next(new ApiError(error.message, 400));
      }

      req.body = value;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isValidUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error, value } = UserValidator.update.validate(req.body);

      if (error) {
        next(new ApiError(error.message, 400));
      }

      req.body = value;

      next();
    } catch (e) {
      next(e);
    }
  }

  public getDynamicallyAndThrow(
    fieldName: string,
    from = "body",
    dbField = fieldName,
  ) {
    return async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const fieldValue = req[from][fieldName];

        const user = await User.findOne({ [dbField]: fieldValue });

        if (user) {
          throw new ApiError(
            `User with ${fieldName} ${fieldValue} is already exist!`,
            409,
          );
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public getDynamicallyOrThrow(
    fieldName: string,
    from = "body",
    dbField = fieldName,
  ) {
    return async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const fieldValue = req[from][fieldName];

        const user = await User.findOne({ [dbField]: fieldValue });

        if (!user) {
          throw new ApiError("User not found", 404);
        }

        res.locals.user = user;
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async isValidLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error, value } = AuthValidator.loginUser.validate(req.body);

      if (error) {
        next(new ApiError(error.message, 400));
      }

      req.body = value;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
