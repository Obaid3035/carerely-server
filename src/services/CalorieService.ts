import { Service } from "typedi";
import axios from "axios";
import Calorie from "../entities/Calorie";
import User from "../entities/User";
import { NotFound } from "../utils/errorCode";
import _ from "lodash";
import moment from "moment";

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

  async history(user: User, skip: number, limit: number) {
    const caloriePromise = Calorie.createQueryBuilder("calorie")
      .select(["calorie.id", "calorie.mealType", "calorie.created_at"])
      .where("calorie.user_id = :user_id", { user_id: user.id })
      .orderBy("calorie.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    const calorieCountPromise = Calorie.count({
      where: {
        user_id: user.id
      }
    });


    const [calorie, calorieCount] = await Promise.all([caloriePromise, calorieCountPromise])
    let mappedCalorie: any = _.groupBy(calorie, (calorie) => {
      return moment(calorie.created_at).format('dddd MMMM Do YYYY')
    })

    const historyArr = [];


    for (const i in mappedCalorie) {
      historyArr.push({
        [i]: mappedCalorie[i]
      })
    }

    return {
      data: historyArr,
      count: calorieCount
    }
  }

  async monthlyCalorie() {
    const monthlySales = await Calorie.createQueryBuilder("calorie")
      .where("calorie.created_at >= :after", { after: moment().utc(false).startOf('month').toDate()})
      .andWhere("calorie.created_at < :before", { before: moment().utc(false).endOf('month').toDate(),})
      .select("SUM(calorie.foodDetail.calorie)", "sum")
      .groupBy("calorie.created_at")
      .getMany()


    return monthlySales
  }

  async create(userInput: any, curUser: User) {
    console.log(userInput)
    console.log()
    const calorie = await Calorie.create({
      mealType: userInput.mealType,
      calorie: userInput.calorie.value,
      carb: userInput.carb.value,
      fat: userInput.fat.value,
      sugar: userInput.sugar.value,
      protein: userInput.protein.value,
      user: curUser
    })
    const savedCalorie = await calorie.save();
    return {
      message: "Calorie created successfully!",
      id: savedCalorie.id
    }
  }

  async getFoodStats(calorieId: string, type: any) {

    if (type === "SUM") {
      const calorie = await Calorie.createQueryBuilder("calorie")
        .where("calorie.created_at >= :today", { today: moment().hour(0).minutes(0).second(0).toDate()})
        .getMany()

      if(!calorie) {
        throw new NotFound("Calorie not found");
      }

      // @ts-ignore
      let sumCalorie = calorie.reduce((curVal, acc) => {

        return {
          calorie: +curVal.calorie + acc.calorie,
          carb: +curVal.carb + acc.carb,
          protein: +curVal.protein + acc.protein,
          fat: +curVal.fat + acc.fat,
          sugar: +curVal.sugar + acc.sugar
        }
      }, {
        calorie: 0,
        carb: 0,
        protein: 0,
        fat: 0,
        sugar: 0
      })

      return {
        calorie: sumCalorie.calorie.toFixed(1),
        carb: sumCalorie.carb.toFixed(1),
        fat: sumCalorie.fat.toFixed(1),
        sugar: sumCalorie.sugar.toFixed(1),
        protein: sumCalorie.protein.toFixed(1),
      };
    }

    const calorie = await Calorie.findOne({
      where: {
        id: parseInt(calorieId)
      }
    })

    if(!calorie) {
      throw new NotFound("Calorie not found");
    }

    return {
      calorie: calorie.calorie,
      carb: calorie.carb,
      fat: calorie.fat,
      sugar: calorie.sugar,
      protein: calorie.protein,
    };


  }
}

export default CalorieService;
