import { Service } from "typedi";
import User, { UserRole } from "../entities/User";
import { IUserResponse } from "../interface";
import BaseService from "./base.service";

@Service()
class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  async register(userInput: User): Promise<IUserResponse> {
    console.log("********** Registering user ***********");
    const user = User.create({
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      email: userInput.email,
      password: userInput.password,
      role: UserRole.USER,
    });
    await user.save();
    const token: string = await user.generateToken();
    console.log("********** User Registered Successfully ***********");
    return {
      token,
      auth: true,
    };
  }

  async login(email: string, password: string): Promise<IUserResponse> {
    console.log("********** Logging user ***********");
    const user = await User.authenticate(email, password);
    const token = await user.generateToken();
    console.log("********** User logged in Successfully ***********");
    return {
      auth: true,
      token,
    };
  }
}

export default UserService;
