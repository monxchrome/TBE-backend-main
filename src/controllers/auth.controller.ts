import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service.js";
import { ITokenPair } from "../types/token.types.js";
import { IUser } from "../types/user.types.js";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.register(req.body);

      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokenPair> | void> {
    try {
      const { email, password } = req.body;
      const { user } = req.res!.locals;

      const tokenPair = await authService.login(
        { email, password },
        user as IUser,
      );

      return res.status(200).json(tokenPair);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
