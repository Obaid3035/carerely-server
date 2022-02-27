import supertest from "supertest";
import { assert } from "chai";
import { app } from "../test-helper";
import { seed } from "../seed";
import { StatusCodes } from "http-status-codes";
import User from "../../entities/User";

describe("User Controller", () => {
  it("should register a user", (done) => {
    supertest(app)
      .post("/auth/register")
      .send(seed.User.user_3)
      .end((_err, res) => {
          assert.equal(res.status, StatusCodes.CREATED)
        assert.equal(res.body.auth, true);
        done();
      });
  });
  it("should not register existing user", (done) => {
    const user = User.create(seed.User.user_3);
    user.save().then((_res) => {
      supertest(app)
          .post("/auth/register")
          .send(seed.User.user_3)
          .end((_err, res) => {
              assert.equal(res.status, StatusCodes.NOT_FOUND)
            done();
          });
    });
  });

    it("should authenticate existing user", (done) => {
        const user = User.create(seed.User.user_3);
        user.save().then((_res) => {
            supertest(app)
                .post("/auth/login")
                .send(seed.User.user_3)
                .end((_err, res) => {
                    assert.equal(res.status, StatusCodes.OK)
                    done();
                });
        });
    });
});
