import { Service } from "typedi";
import Profile from "../entities/Profile";
import User from "../entities/User";
import { BadRequest } from "../utils/errorCode";

@Service()
class ProfileService {
  async create(currUser: User, userInput: Profile) {
    if (currUser.profile_setup) {
      throw new BadRequest("Profile already exists");
    }
    const profile = Profile.create({
      dob: userInput.dob,
      gender: userInput.gender,
      height: userInput.height,
      height_unit: userInput.height_unit,
      weight: userInput.weight,
      weight_unit: userInput.weight_unit,
      user_id: currUser.id,
    });
    const savedProfile = await profile.save();
    if (savedProfile) {
      currUser.profile_setup = true;
      const user = await currUser.save();
      const token = user.generateToken();
      return {
        saved: true,
        token,
      };
    }
    throw new Error("Something went wrong");
  }

  async show(currUserId: number) {
    return await Profile.findOne({
      where: {
        user_id: currUserId,
      },
    });
  }

  async update(currUserId: number, userInput: Profile) {
    console.log(userInput, currUserId)
   // await Profile.update(currUserId, userInput);
   return {
     updated: true,
   }
  }
}
export default ProfileService
