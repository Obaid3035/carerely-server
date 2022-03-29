"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_helper_1 = require("../test-helper");
const chai_1 = require("chai");
const http_status_codes_1 = require("http-status-codes");
const seed_1 = require("../seed");
describe('Post Controller', () => {
    let auth = {};
    beforeEach((0, seed_1.loginUser)(auth, seed_1.seed.User.authUser.user_1));
    it('should create a new post', (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post('/posts')
            .send(seed_1.seed.post)
            .set('Authorization', `Bearer ${auth.token}`)
            .end((_err, res) => {
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            chai_1.assert.equal(res.body.saved, true);
            done();
        });
    });
    it("should get all the post that current can see", (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post('/posts')
            .send(seed_1.seed.post)
            .set('Authorization', `Bearer ${auth.token}`)
            .end((_err, res) => {
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            chai_1.assert.equal(res.body.saved, true);
            (0, supertest_1.default)(test_helper_1.app)
                .get('/posts')
                .set('Authorization', `Bearer ${auth.token}`)
                .end((_err, res) => {
                chai_1.assert.equal(res.body.length, 1);
                done();
            });
        });
    });
});
