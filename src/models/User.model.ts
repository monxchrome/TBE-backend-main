import { model, Schema } from "mongoose";

import { ECountry } from "../enums/country.enum";

export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    country: {
      type: String,
      enum: ECountry,
    },
  },
  { versionKey: false, timestamps: true },
);

export const User = model("User", userSchema);
