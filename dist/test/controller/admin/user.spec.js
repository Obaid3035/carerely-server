"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const test_helper_1 = require("../../test-helper");
const seed_1 = require("../../seed");
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../../../entities/User"));
describe("Admin User Controller", () => {
    it("should create a user", (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post("/admin/users")
            .send(seed_1.seed.User.user_3)
            .end((_err, res) => {
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            chai_1.assert.equal(res.body.saved, true);
            done();
        });
    });
    it("should fetch all user", (done) => {
        const user = User_1.default.create(seed_1.seed.User.user_3);
        user.save().then((_res) => {
            (0, supertest_1.default)(test_helper_1.app)
                .get("/admin/users")
                .end((_err, res) => {
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.OK);
                chai_1.assert.equal(res.body.length, 1);
                done();
            });
        });
    });
});
