import User, { UserRole } from "../entities/User";
import supertest from "supertest";
import {app} from "./test-helper";
import jwt from "jsonwebtoken"


const userOneID = 1
const userTwoID = 2
export const seed = {
  User: {
    authUser: {
      user_1: {
        id: userOneID,
        first_name: "Shayaan",
        last_name: "Sohail",
        email: "shayaan199@gmail.com",
        password: "12345678",
        role: UserRole.USER,
        tokens: [{
          access: 'auth',
          token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
      },
      user_2: {
        id: userTwoID,
        first_name: "Ali",
        last_name: "Rashid",
        email: "ali12@gmail.com",
        password: "12345678",
        role: UserRole.USER,
        tokens: [{
          access: 'auth',
          token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
      },
    },
    user_3: {
      first_name: "Obaid",
      last_name: "Aqeel",
      email: "obaid3035@gmail.com",
      password: "12345678",
      role: UserRole.USER,
    },
  },
  post: {
    text: "Lorem Ipsum Dolor Asup"
  }
};


export const loginUser = (auth: { token?: string, user?: User}, userInput: any) => {
  return (done: any) => {
    const user = User.create({
      email: userInput.email,
      password: userInput.password,
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      role: userInput.role,
    })
    user.save().then((user) => {
      supertest(app)
          .post('/auth/login')
          .send(userInput)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            if (res.body.auth) {
              auth.token = res.body.token
              auth.user = user
              return done();
            }
          })
    })

  }
}


