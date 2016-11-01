// To let eslint pass
/* global describe:true, it:true, expect:true, request:true */

describe('Routes: API Index', () => {
  describe('GET /api/', () => {
    it('returns the API status', (done) => {
      request.get('/api/')
        .expect(200)
        .end((err, res) => {
          const expected = { msg: 'This is wenzhuan restful api' };
          expect(res.body).to.eql(expected);
          done(err);
        });
    });
  });
});
