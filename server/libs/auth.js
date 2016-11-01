import util from 'util';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

module.exports = app => {
  const Users = app.libs.db.models.users;
  const config = app.libs.config;
  const params = {
    secretOrKey: config.confidential.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
  };
  const strategy = new Strategy(params, (payload, done) => {
    Users.findById(payload.id)
      .then(user => {
        if (user) {
          return done(null, user.get({ plain: true }));
        }
        return done(null, false);
      })
      .catch(error => done(error, null));
  });
  passport.use(strategy);

  passport.use(new LocalStrategy(
    {
      usernameField: 'mobile',
    },
    (username, password, done) => {
      Users.findOne({
        where: { mobile: username },
      }).then(user => {
        if (!user) {
          return done(null, false, { msg: 'Incorrect user id.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { msg: 'Incorrect password.' });
        }
        return done(null, user);
      }).catch(error => done(error));
    }
  ));

  return {
    initialize() {
      return passport.initialize();
    },
    authenticate() {
      return passport.authenticate('jwt', config.confidential.jwtSecret);
    },
    login(req, res) {
      if (!req.body.mobile || !req.body.password) {
        res.status(400).send('mobile and password required');
        return;
      }

      req.checkBody('mobile', 'valid mobile is required').notEmpty().len(11, 11).isInt();
      req.checkBody('password', 'password is required').notEmpty().len(6);

      const errors = req.validationErrors();
      if (errors) {
        res.status(400).json({ msg: util.inspect(errors) });
        return;
      }

      passport.authenticate('local', (err, user, info) => {
        if (err) {
          res.status(404).json({ msg: err });
          return;
        }

        if (user) {
          const token = user.generateJwt();
          res.json({ token });
        } else {
          res.status(401).json({ msg: info });
        }
      })(req, res);
    },
    createAccount(req, res) {
      req.checkBody('mobile', 'valid mobile is required').notEmpty().len(11, 11).isInt();
      req.checkBody('password', 'password is required').notEmpty().len(6);

      const errors = req.validationErrors();
      if (errors) {
        res.status(400).json({ msg: util.inspect(errors) });
        return;
      }

      Users.build({
        mobile: req.body.mobile,
        password: req.body.password,
        status: 'ACTIVE',
        registeredAt: Date.now(),
      }).save()
        .then(user => {
          const token = user.generateJwt();
          res.json({ token });
        })
        .catch(error => res.status(404).json({ msg: error }));
    },
  };
};
