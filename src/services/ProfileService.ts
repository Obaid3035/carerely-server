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
      user: currUser
    });
    const savedProfile = await profile.save();
    if (!savedProfile) {
      throw new Error("Something went wrong");
    }
    currUser.profile_setup = true;
    const user = await currUser.save();
    const token = user.generateToken();
    return {
      saved: true,
      token,
    };
  }

  async show(currUserId: number) {
    return await Profile.findOne({
      where: {
        user_id: currUserId,
      },
    });
  }

  async update(currUserId: number, userInput: Profile) {
    console.log(userInput, currUserId);
    const profile = await Profile.update(currUserId, {
      dob: userInput.dob,
      weight: userInput.weight,
      weight_unit: userInput.weight_unit,
      height: userInput.height,
      height_unit: userInput.height_unit
    });
    if (!profile) {
      throw new BadRequest("Profile cannot be updated")
    }
    console.log(profile)
    return {
      updated: true,
    };
  }
}

export default ProfileService;
