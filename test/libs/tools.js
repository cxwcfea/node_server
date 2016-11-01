/* global describe:true, it:true, expect:true, request:true, app:true */

describe('util function in tools', () => {
  describe('fetchCaptcha', () => {
    it('returns the captcha str by length param', () => {
      expect(typeof app.libs.tools.fetchCaptcha).to.eql('function');
      const captcha = app.libs.tools.fetchCaptcha(6);
      expect(captcha).to.be.a('string');
      expect(captcha).to.have.length(6);
    });
  });
});
