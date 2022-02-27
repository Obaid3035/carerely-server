import { IController, IRequest } from "../interface";
import { Request, Router, Response, NextFunction } from "express";
import auth from "../middleware/auth";
import { Container } from "typedi";
import PostService from "../services/PostService";
import { StatusCodes } from "http-status-codes";

class PostController implements IController {
  path: string = "/posts";

  router = Router();

  constructor() {
    this.router
      .get(`${this.path}`, auth, this.index)
      .post(`${this.path}`, auth, this.create);
  }

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postInstance = Container.get(PostService);
      const posts = await postInstance.index((req as IRequest).user);
      res.status(StatusCodes.OK).json(posts);
    } catch (e) {
      next(e);
    }
  };

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as IRequest).user;
      const postInstance = Container.get(PostService);
      const { saved } = await postInstance.create(req.body, user);
      res.status(StatusCodes.CREATED).json({
        saved,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default PostController;
