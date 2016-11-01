/* global describe:true, beforeEach:true, it:true, expect:true, request:true, app:true */

describe('Routes: users', () => {
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
  describe('POST /api/users', () => {
    it('create a new user', (done) => {
      request.post('/api/users')
        .send({
          mobile: '13439695910',
          password: '123456',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.mobile).to.eql('13439695910');
          done(err);
        });
    });
  });
});
