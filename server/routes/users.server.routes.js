export default (app, router) => {
  const userCtrl = app.libs.controllers.userCtrl;
  router.post('/users', userCtrl.createUser);

  router.put('/users/:uid', userCtrl.updateUser);
};
