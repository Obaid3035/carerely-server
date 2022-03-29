"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const test_helper_1 = require("../test-helper");
const seed_1 = require("../seed");
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../../entities/User"));
describe("User Controller", () => {
    it("should register a user", (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post("/auth/register")
            .send(seed_1.seed.User.user_3)
            .end((_err, res) => {
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            chai_1.assert.equal(res.body.auth, true);
            done();
        });
    });
    it("should not register existing user", (done) => {
        const user = User_1.default.create(seed_1.seed.User.user_3);
        user.save().then((_res) => {
            (0, supertest_1.default)(test_helper_1.app)
                .post("/auth/register")
                .send(seed_1.seed.User.user_3)
                .end((_err, res) => {
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.NOT_FOUND);
                done();
            });
        });
    });
    it("should authenticate existing user", (done) => {
        const user = User_1.default.create(seed_1.seed.User.user_3);
        user.save().then((_res) => {
            (0, supertest_1.default)(test_helper_1.app)
                .post("/auth/login")
                .send(seed_1.seed.User.user_3)
                .end((_err, res) => {
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.OK);
                done();
            });
        });
    });
});
