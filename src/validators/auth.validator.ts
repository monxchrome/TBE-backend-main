import Joi from "joi";

import { REGEX_CONSTANT } from "../configs/constants/regex.constant.js";

export class AuthValidator {
  private static email = Joi.string()
    .regex(REGEX_CONSTANT.EMAIL)
    .lowercase()
    .trim();
  private static password = Joi.string().regex(REGEX_CONSTANT.PASSWORD);

  static loginUser = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
}
