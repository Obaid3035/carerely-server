import { IController } from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";


class CalorieController implements IController {
  path = "/calorie";
  router = Router()

  constructor() {
    this.router
      .get(`${this.path}`, this.getFoodProducts);
  }

  private getFoodProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const FOOD_API =
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.query.query}&dataType=${req.query.dataType}&pageSize=${req.query.pageSize}&api_key=LPFQUBj4pY4vkAbHQ82cvjMbzalJR73mPML5TNcv`;
      const foodData = await axios.get(FOOD_API);
      const mappedFood = foodData.data.foods.map((food: any) => {
        return {
          fdcId: food.fdcId,
          name: food.description,
          calorie: food.foodNutrients.find((nutrient: any) => {
            return nutrient.nutrientNumber == 208
          }),
          protein: food.foodNutrients.find((nutrient: any) => {
            return nutrient.nutrientNumber == 203
          }),
          carb: food.foodNutrients.find((nutrient: any) => {
            return nutrient.nutrientNumber == 205
          }),
          fat: food.foodNutrients.find((nutrient: any) => {
            return nutrient.nutrientNumber == 204
          }),
          sugar: food.foodNutrients.find((nutrient: any) => {
            return nutrient.nutrientNumber == 269
          }),
        }
      })
      res.status(200).json(mappedFood);
    } catch (e) {
      next(e);
    }
  }
}

export default CalorieController;
