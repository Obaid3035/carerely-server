import { Router, Request, Response, NextFunction } from "express";
import { IController } from "../../interface";
import { Container } from "typedi";
import UserService from "../../services/UserService";

class AdminUserController implements IController {
  path: string = "/admin";

  router = Router();

  constructor() {
    this.router.get(`${this.path}/users`, this.index);
    this.router.post(`${this.path}/users`, this.create);
  }

  private index = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.findAll();
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      await userServiceInstance.insert(req.body);
      res.status(201).json({ saved: true });
    } catch (e) {
      next(e);
    }
  };
}

export default AdminUserController;
