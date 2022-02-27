import supertest from "supertest";
import {app} from "../test-helper";
import {assert} from "chai";
import {StatusCodes} from "http-status-codes";
import {loginUser, seed} from "../seed";

describe('Post Controller', () => {
    let auth: {token?: string} = {}
    beforeEach( loginUser(auth, seed.User.authUser.user_1))
    it('should create a new post',  (done) => {
        supertest(app)
            .post('/posts')
            .send(seed.post)
            .set('Authorization', `Bearer ${auth.token}`)
            .end((_err, res) => {
                assert.equal(res.status, StatusCodes.CREATED)
                assert.equal(res.body.saved, true)
                done();
            })
    });

    it("should get all the post that current can see", (done) => {
        supertest(app)
            .post('/posts')
            .send(seed.post)
            .set('Authorization', `Bearer ${auth.token}`)
            .end((_err, res) => {
                assert.equal(res.status, StatusCodes.CREATED)
                assert.equal(res.body.saved, true)
                supertest(app)
                    .get('/posts')
                    .set('Authorization', `Bearer ${auth.token}`)
                    .end((_err, res) => {
                        assert.equal(res.body.length, 1)
                        done();
                    })
            })
    })
})
