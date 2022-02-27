import { Router, Request, Response, NextFunction } from "express";
import { IController } from "../interface";
import { Container } from "typedi";
import UserService from "../services/UserService";

class UserController implements IController {
  path: string = "/auth";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/register`, this.register)
      .post(`${this.path}/login`, this.login);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const { auth, token } = await userServiceInstance.register(req.body);
      res.status(201).json({ auth, token });
    } catch (e) {
      next(e);
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const { email, password } = req.body;
      const { auth, token } = await userServiceInstance.login(email, password);
      res.status(200).json({
        auth,
        token,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default UserController;
