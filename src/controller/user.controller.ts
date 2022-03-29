import { Router, Request, Response, NextFunction } from "express";
import { IController, IRequest } from "../interface";
import { Container } from "typedi";
import UserService from "../services/UserService";
import auth from "../middleware/auth";
import User, { UserRole } from "../entities/User";

class UserController implements IController {
  path: string = "/auth";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/register`, this.register)
      .post(`${this.path}/login`, this.login)
      .get(`${this.path}/authorize/:token`, this.authorize)
      .get(`${this.path}/users`, this.searchUsers)
      .get(`${this.path}/top`, auth(UserRole.USER), this.mostFollowedUser)
      .get(`${this.path}/stats/:id`, auth(UserRole.USER), this.getUserStats)
      .get(`${this.path}/current-user/stats`, auth(UserRole.USER), this.getCurrentUserStats)
  }

  private searchUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const users = req.query.search.length > 0 ?
        await userServiceInstance.searchUsers(req.query.search) : []
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  };

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
      const { auth, token, role } = await userServiceInstance.login(email, password);
      res.status(200).json({
        auth,
        token,
        role
      });
    } catch (e) {
      next(e);
    }
  };

  private authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req.params;
      await User.authorize(token);
      res.status(200).json({ authenticate: true });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private mostFollowedUser = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.mostFollowedUser();
      res.status(200).json(users)
    } catch (e) {
      next(e);
    }
  }

  private getUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otherUserId = req.params.id
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.getUserStats(otherUserId);
      res.status(200).json(users)
    } catch (e) {
      next(e);
    }
  }

  private getCurrentUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.getCurrentUserStats(user);
      res.status(200).json(users)
    } catch (e) {
      next(e);
    }
  }

}


export default UserController;
