
module.exports = app => {
  const commonCtrl = app.libs.controllers.commonCtrl;

  app.get('/captcha/sms', commonCtrl.sendSMSCaptcha);

  app.post('/token', app.libs.auth.login);

  app.post('/register', commonCtrl.checkUserExistence,
    commonCtrl.verifySMSCaptcha, app.libs.auth.createAccount);
};
