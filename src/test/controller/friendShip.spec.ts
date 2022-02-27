import User from "../../entities/User";
import {loginUser, seed} from "../seed";
import supertest from "supertest";
import {app} from "../test-helper";
import { assert } from "chai";
import {StatusCodes} from "http-status-codes";

describe("Friendship Controller",  () => {

    let auth_1: {token?: string, user?: User} = {}

    let auth_2: {token?: string, user?: User} = {}

    beforeEach( loginUser(auth_1, seed.User.authUser.user_1))
    beforeEach(loginUser(auth_2, seed.User.authUser.user_2))


    it('should send a friendship request',  (done) => {
        const receiver = User.create(seed.User.user_3);
        receiver.save().then((res) => {
            supertest(app)
                .post(`/friendship/sent/${res.id}`)
                .set('Authorization', `Bearer ${auth_1.token}`)
                .end((_err, res) => {
                    assert.equal(res.status, StatusCodes.CREATED)
                    assert.equal(res.body.saved, true)
                    done();
                })
        }).catch((err) => {
            if (err) {
                done(err)
            }
        });
    });

    it('should not create friendship if it already exists', (done) => {
        const receiver = User.create(seed.User.user_3);
        receiver.save().then((res) => {
            supertest(app)
                .post(`/friendship/sent/${res.id}`)
                .set('Authorization', `Bearer ${auth_1.token}`)
                .end((_err, _res) => {
                    supertest(app)
                        .post(`/friendship/sent/${res.id}`)
                        .set('Authorization', `Bearer ${auth_1.token}`)
                        .end((_err, res) => {
                            assert.equal(res.status, 400)
                            done()
                        })
                })
        })
            .catch((err) => {
                if (err) {
                    done(err);
                }
            });
    });

    it("should accept friendship request", (done) => {
        supertest(app)
            .post(`/friendship/sent/${auth_2.user.id}`)
            .set('Authorization', `Bearer ${auth_1.token}`)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                assert.equal(res.body.saved, true)
                assert.equal(res.status, StatusCodes.CREATED)
                supertest(app)
                    .put(`/friendship/accept/${auth_1.user.id}`)
                    .set('Authorization', `Bearer ${auth_2.token}`)
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        assert.equal(res.status, StatusCodes.OK)
                        assert.equal(res.body.updated, true)
                        done()
                    })
            })
    })


    it('should decline friendship request',  (done) => {
        supertest(app)
            .post(`/friendship/sent/${auth_2.user.id}`)
            .set('Authorization', `Bearer ${auth_1.token}`)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                assert.equal(res.body.saved, true)
                assert.equal(res.status, StatusCodes.CREATED)
                supertest(app)
                    .delete(`/friendship/decline/${auth_1.user.id}`)
                    .set('Authorization', `Bearer ${auth_2.token}`)
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        assert.equal(res.status, StatusCodes.OK)
                        assert.equal(res.body.deleted, true)
                        done()
                    })
            })
    });

    it('should delete friendship',  (done) => {
        supertest(app)
            .post(`/friendship/sent/${auth_2.user.id}`)
            .set('Authorization', `Bearer ${auth_1.token}`)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                assert.equal(res.body.saved, true)
                assert.equal(res.status, StatusCodes.CREATED)
                supertest(app)
                    .put(`/friendship/accept/${auth_1.user.id}`)
                    .set('Authorization', `Bearer ${auth_2.token}`)
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        assert.equal(res.status, StatusCodes.OK)
                        assert.equal(res.body.updated, true)
                        supertest(app)
                            .delete(`/friendship/delete-friendship/${auth_2.user.id}`)
                            .set('Authorization', `Bearer ${auth_1.token}`)
                            .end((err, res) => {
                                if (err) {
                                    done(err);
                                }

                                assert.equal(res.status, StatusCodes.OK)
                                assert.equal(res.body.deleted, true)
                                done()
                            })
                    })
            })
    });
})
