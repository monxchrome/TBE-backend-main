import Joi from "joi";

import { regexConstants } from "../configs/constants/regex.constant";
import { ECountry } from "../enums/country.enum";

export class UserValidator {
  private static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim();
  private static username = Joi.string().max(25).trim();
  private static password = Joi.string().regex(regexConstants.PASSWORD);
  private static dateOfBirth = Joi.date().less("now").iso().messages({
    "date.base": "Date must be a valid!",
    "date.less": "Date can't be in the future!",
    "date.format": "Date need to have format ISO 8601.",
  });
  private static country = Joi.valid(...Object.values(ECountry));

  static create = Joi.object({
    email: this.email.required(),
    username: this.username.required(),
    password: this.password.required(),
    dateOfBirth: this.dateOfBirth.required(),
    country: this.country.required(),
  });

  static update = Joi.object({
    password: this.password,
    email: this.email,
    username: this.username,
  });

  static changePassword = Joi.object({
    oldPassword: this.password,
    newPassword: this.password,
  });

  static changeEmail = Joi.object({
    oldEmail: this.email,
    newEmail: this.email,
    password: this.password,
  });

  static forgotPassword = Joi.object({
    password: this.password,
  });
}
