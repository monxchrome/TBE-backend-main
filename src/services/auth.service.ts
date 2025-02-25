import { IUser } from "../types/user.types.js";

class AuthService {
  public async register(body: IUser) {
    const { password } = body;
  }
}
