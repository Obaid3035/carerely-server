import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { UserRole } from "../entities/User";
import { Container } from "typedi";
import NotificationService from "../services/NotificationService";

class NotificationController implements IController {
  path: string = "/notification";
  router = Router();

  constructor() {
    this.router.get(`${this.path}`, auth(UserRole.USER), this.index);
  }

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as IRequest).user
      const notificationServiceInstance = Container.get(NotificationService);
      const notification = await notificationServiceInstance.index(currentUser)
      res.status(200).json(notification);
    } catch (e) {
      next(e);
    }
  };
}

export default NotificationController;
