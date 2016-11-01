/* global describe:true, it:true, expect:true, request:true, beforeEach:true, app:true */

describe('Routes: common routes', () => {
  const Users = app.libs.db.models.users;
  beforeEach(done => {
    Users
      .destroy({ where: {} })
      .then(() => {
        Users.create({
          mobile: '13439695920',
          password: '123456',
        }).then(() => {
          done();
        });
      });
  });

  describe('GET /captcha/img', () => {
    it('returns 200', done => {
      request.get('/captcha/img')
        .expect(200)
        .end((err) => {
          done(err);
        });
    });
  });

  describe('POST /token', () => {
    it('returns 400 when no mobile in request body', done => {
      request.post('/token')
        .expect(400)
        .end((err) => {
          done(err);
        });
    });
    it('returns 400 when no password in request body', done => {
      request.post('/token')
        .expect(400)
        .end((err) => {
          done(err);
        });
    });
    it('returns 401 when a user not found', done => {
      request.post('/token')
        .send({
          mobile: '13439695910',
          password: 'xxxxxx',
        })
        .expect(401)
        .end((err) => {
          done(err);
        });
    });
    it('returns 401 when password incorrect', done => {
      request.post('/token')
        .send({
          mobile: '13439695920',
          password: 'xxxxxx',
        })
        .expect(401)
        .end((err) => {
          done(err);
        });
    });
    it('returns authenticated user token', done => {
      request.post('/token')
        .send({
          mobile: '13439695920',
          password: '123456',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.include.keys('token');
          done(err);
        });
    });
  });

  describe('POST /register', () => {
    it('returns 406 when user already exist', done => {
      request.post('/register')
        .send({
          mobile: '13439695920',
        })
        .expect(406)
        .end((err) => {
          done(err);
        });
    });
    it('returns 403 when not captcha', done => {
      request.post('/register')
        .send({
          mobile: '13439695930',
          password: 'xxxxxx',
          captcha: '345678',
        })
        .expect(403)
        .end((err) => {
          done(err);
        });
    });
  });
});
