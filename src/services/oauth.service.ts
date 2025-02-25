import bcrypt from "bcrypt";

import { configs } from "../configs/index.js";

class OAuthService {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, +configs.PASSWORD_SALT);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const oauthService = new OAuthService();
