import { IController, IRequest } from "../interface";
import { NextFunction, Router, Response, Request } from "express";
import User from "../entities/User";
import FriendShipService from "../services/FriendShipService";
import { Container } from "typedi";
import auth from "../middleware/auth";
import { StatusCodes } from "http-status-codes";

class FriendShipController implements IController {
  path: string = "/friendship";

  router = Router();

  constructor() {
    this.router
      .post(`${this.path}/sent/:receiverId`, auth, this.sendFriendShipRequest)
      .put(`${this.path}/accept/:senderId`, auth, this.acceptFriendShipRequest)
      .delete(
        `${this.path}/decline/:senderId`,
        auth,
        this.declineFriendShipRequest
      )
        .delete(`${this.path}/delete-friendship/:userId`, auth, this.deleteFriendShip);
  }

  private sendFriendShipRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { receiverId } = req.params;
      const sender: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);
      const { saved } = await friendShipInstance.sendFriendShipRequest(
        sender,
        receiverId
      );
      res.status(StatusCodes.CREATED).json({
        saved,
      });
    } catch (e) {
      next(e);
    }
  };

  private acceptFriendShipRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { senderId } = req.params;
      const receiver: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);
      const { updated } = await friendShipInstance.acceptFriendShipRequest(
        receiver,
        senderId
      );
      res.status(StatusCodes.OK).json({
        updated,
      });
    } catch (e) {
      next(e);
    }
  };

  private declineFriendShipRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { senderId } = req.params;
      const receiver: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);
      const { deleted } = await friendShipInstance.declineFriendShipRequest(
        receiver,
        senderId
      );
      res.status(200).json({
        deleted,
      });
    } catch (e) {
      next(e);
    }
  };

  private deleteFriendShip = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const user_2: User = (<IRequest>req).user;
      const friendShipInstance = Container.get(FriendShipService);

      const { deleted } = await friendShipInstance.deleteFriendShip(
          userId,
        user_2
      );
      res.status(200).json({
        deleted,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default FriendShipController;
