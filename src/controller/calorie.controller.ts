import { IController, IRequest } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import CalorieService from "../services/CalorieService";
import User from "../entities/User";


class CalorieController implements IController {
  path = "/calorie";
  router = Router()

  constructor() {
    this.router
      .get(`${this.path}`, this.getFoodProducts)
      .post(`${this.path}`, this.create)

  }

  private getFoodProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const calorieServiceInstance = Container.get(CalorieService);
      const foodProducts = await calorieServiceInstance.getFoodProducts(req.query)
      res.status(200).json(foodProducts);
    } catch (e) {
      next(e);
    }
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currUser: User = (<IRequest>req).user;
      const calorieServiceInstance = Container.get(CalorieService);
      const foodProducts = await calorieServiceInstance.create(req.body, currUser)
      res.status(200).json(foodProducts);
    } catch (e) {
      next(e);
    }
  }

  // private getFoodStats = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const calorieServiceInstance = Container.get(CalorieService);
  //     const foodProducts = await calorieServiceInstance.getFoodStats()
  //     res.status(200).json(foodProducts);
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}

export default CalorieController;
