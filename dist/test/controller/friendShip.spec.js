"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../entities/User"));
const seed_1 = require("../seed");
const supertest_1 = __importDefault(require("supertest"));
const test_helper_1 = require("../test-helper");
const chai_1 = require("chai");
const http_status_codes_1 = require("http-status-codes");
describe("Friendship Controller", () => {
    let auth_1 = {};
    let auth_2 = {};
    beforeEach((0, seed_1.loginUser)(auth_1, seed_1.seed.User.authUser.user_1));
    beforeEach((0, seed_1.loginUser)(auth_2, seed_1.seed.User.authUser.user_2));
    it('should send a friendship request', (done) => {
        const receiver = User_1.default.create(seed_1.seed.User.user_3);
        receiver.save().then((res) => {
            (0, supertest_1.default)(test_helper_1.app)
                .post(`/friendship/sent/${res.id}`)
                .set('Authorization', `Bearer ${auth_1.token}`)
                .end((_err, res) => {
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
                chai_1.assert.equal(res.body.saved, true);
                done();
            });
        }).catch((err) => {
            if (err) {
                done(err);
            }
        });
    });
    it('should not create friendship if it already exists', (done) => {
        const receiver = User_1.default.create(seed_1.seed.User.user_3);
        receiver.save().then((res) => {
            (0, supertest_1.default)(test_helper_1.app)
                .post(`/friendship/sent/${res.id}`)
                .set('Authorization', `Bearer ${auth_1.token}`)
                .end((_err, _res) => {
                (0, supertest_1.default)(test_helper_1.app)
                    .post(`/friendship/sent/${res.id}`)
                    .set('Authorization', `Bearer ${auth_1.token}`)
                    .end((_err, res) => {
                    chai_1.assert.equal(res.status, 400);
                    done();
                });
            });
        })
            .catch((err) => {
            if (err) {
                done(err);
            }
        });
    });
    it("should accept friendship request", (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post(`/friendship/sent/${auth_2.user.id}`)
            .set('Authorization', `Bearer ${auth_1.token}`)
            .end((err, res) => {
            if (err) {
                done(err);
            }
            chai_1.assert.equal(res.body.saved, true);
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            (0, supertest_1.default)(test_helper_1.app)
                .put(`/friendship/accept/${auth_1.user.id}`)
                .set('Authorization', `Bearer ${auth_2.token}`)
                .end((err, res) => {
                if (err) {
                    done(err);
                }
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.OK);
                chai_1.assert.equal(res.body.updated, true);
                done();
            });
        });
    });
    it('should decline friendship request', (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post(`/friendship/sent/${auth_2.user.id}`)
            .set('Authorization', `Bearer ${auth_1.token}`)
            .end((err, res) => {
            if (err) {
                done(err);
            }
            chai_1.assert.equal(res.body.saved, true);
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            (0, supertest_1.default)(test_helper_1.app)
                .delete(`/friendship/decline/${auth_1.user.id}`)
                .set('Authorization', `Bearer ${auth_2.token}`)
                .end((err, res) => {
                if (err) {
                    done(err);
                }
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.OK);
                chai_1.assert.equal(res.body.deleted, true);
                done();
            });
        });
    });
    it('should delete friendship', (done) => {
        (0, supertest_1.default)(test_helper_1.app)
            .post(`/friendship/sent/${auth_2.user.id}`)
            .set('Authorization', `Bearer ${auth_1.token}`)
            .end((err, res) => {
            if (err) {
                done(err);
            }
            chai_1.assert.equal(res.body.saved, true);
            chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.CREATED);
            (0, supertest_1.default)(test_helper_1.app)
                .put(`/friendship/accept/${auth_1.user.id}`)
                .set('Authorization', `Bearer ${auth_2.token}`)
                .end((err, res) => {
                if (err) {
                    done(err);
                }
                chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.OK);
                chai_1.assert.equal(res.body.updated, true);
                (0, supertest_1.default)(test_helper_1.app)
                    .delete(`/friendship/delete-friendship/${auth_2.user.id}`)
                    .set('Authorization', `Bearer ${auth_1.token}`)
                    .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    chai_1.assert.equal(res.status, http_status_codes_1.StatusCodes.OK);
                    chai_1.assert.equal(res.body.deleted, true);
                    done();
                });
            });
        });
    });
});
