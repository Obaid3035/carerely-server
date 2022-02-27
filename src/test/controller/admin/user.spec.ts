import supertest from "supertest";
import { assert } from "chai";
import { app } from "../../test-helper";
import { seed } from "../../seed";
import { StatusCodes } from "http-status-codes";
import User from "../../../entities/User";

describe("Admin User Controller", () => {
  it("should create a user", (done) => {
    supertest(app)
      .post("/admin/users")
      .send(seed.User.user_3)
      .end((_err, res) => {
          assert.equal(res.status, StatusCodes.CREATED)
        assert.equal(res.body.saved, true);
        done();
      });
  });

  it("should fetch all user", (done) => {
    const user = User.create(seed.User.user_3);
    user.save().then((_res) => {
      supertest(app)
        .get("/admin/users")
        .end((_err, res) => {
            assert.equal(res.status, StatusCodes.OK)
          assert.equal(res.body.length, 1);
          done();
        });
    });
  });
});
