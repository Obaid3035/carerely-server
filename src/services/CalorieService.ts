import { Service } from "typedi";
import axios from "axios";
import Calorie from "../entities/Calorie";
import User from "../entities/User";

@Service()
class CalorieService {
  async getFoodProducts(params: any) {
    let FOOD_API;
    FOOD_API =
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${params.query}&dataType=Survey (FNDDS)&pageSize=12&pageNumber=${params.pageNumber}&api_key=LPFQUBj4pY4vkAbHQ82cvjMbzalJR73mPML5TNcv`;

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
    return {
      foods: mappedFood,
      totalPages: foodData.data.totalPages,
      currentPage: foodData.data.currentPage
    }
  }

  async create(userInput: any, curUser: User) {
    await Calorie.create({
      mealType: userInput.mealType,
      foodDetail: {
        calorie: userInput.foodDetail.calorie.value,
        carb: userInput.foodDetail.carb.value,
        fat: userInput.foodDetail.fat.value,
        sugar: userInput.foodDetail.sugar.value,
        protein: userInput.foodDetail.protein.value,
      },
      user: curUser
    })
    return {
      message: "Calorie created successfully!"
    }
  }
}

export default CalorieService;
