import { Router } from 'express';
import usersRoute from './users.server.routes';

module.exports = app => {
  const router = new Router();

  router.get('/', (req, res) => {
    res.json({ msg: 'This is wenzhuan restful api' });
  });

  usersRoute(app, router);

  app.use('/api', router);
};
