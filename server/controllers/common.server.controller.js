/* eslint no-param-reassign: [2, { "props": false }], consistent-return: "off" */

import util from 'util';

module.exports = (app) => {
  const Users = app.libs.db.models.users;
  const tools = app.libs.tools;
  const sms = app.libs.sms;
  return {
    sendSMSCaptcha(req, res) {
      // req.checkQuery('type', 'type is required').notEmpty().isInt();
      req.query.mobile = req.query.mobile || '';
      req.checkQuery('mobile', 'valid mobile is required').notEmpty().len(11, 11).isInt();

      const errors = req.validationErrors();
      if (errors) {
        res.status(400).json({ msg: util.inspect(errors) });
        return;
      }

      if (req.session.smsCaptcha && req.session.smsCaptcha.resendGuard > Date.now()) {
        res.status(403).json({ msg: 'request too frequent' });
        return;
      }

      const code = tools.fetchCaptcha(6);
      sms.sendSMS(req.query.mobile, `${code}（验证码，5分钟内有效）`);
      req.session.smsCaptcha = {
        mobile: req.query.mobile.toString(),
        captcha: code.toString(),
        count: 0,  // only allow try 6 times for the same code
        resendGuard: Date.now() + 60000, // 1 minute
        expires: Date.now() + 3600000, // 1 hour
      };
      res.sendStatus(204);
    },
    verifySMSCaptcha(req, res, next) {
      req.checkBody('mobile', 'valid mobile is required').notEmpty().len(11, 11).isInt();
      req.checkBody('captcha', 'captcha is required').notEmpty().len(6);

      const errors = req.validationErrors();
      if (errors) {
        res.status(400).json({ msg: util.inspect(errors) });
        return;
      }

      if (!req.session.smsCaptcha) {
        return res.status(403).json({ msg: '请先获取短信验证码' });
      }

      if (req.body.mobile.toString() !== req.session.smsCaptcha.mobile) {
        return res.status(403).json({ msg: '手机号不匹配' });
      }

      if (req.session.smsCaptcha.count > 6) {
        delete req.session.smsCaptcha;
        return res.status(403).json({ msg: '重试次数过多，请重新获取验证码' });
      }

      if (req.session.smsCaptcha.expires < Date.now()) {
        delete req.session.smsCaptcha;
        return res.status(403).json({ msg: '验证码已失效' });
      }

      req.session.smsCaptcha.count++;
      if (req.body.captcha !== Number(req.session.smsCaptcha.code)) {
        return res.status(403).json({ msg: '验证码错误' });
      }

      // pass
      delete req.session.smsCaptcha;
      next();
    },
    checkUserExistence(req, res, next) {
      req.checkBody('mobile', 'valid mobile is required').notEmpty().len(11, 11).isInt();

      const errors = req.validationErrors();
      if (errors) {
        res.status(400).json({ msg: util.inspect(errors) });
        return;
      }

      Users.count({ where: { mobile: req.body.mobile } })
        .then(count => {
          if (count > 0) {
            res.status(406).send({ msg: '用户已经存在' });
          } else {
            next();
          }
        })
        .catch(error => res.status(404).json({ msg: error }));
    },
  };
};
