import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/index.js";
import { User } from "../models/User.model.js";

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

  public async isValidUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {}
}
