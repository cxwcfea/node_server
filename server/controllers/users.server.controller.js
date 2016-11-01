module.exports = app => {
  const Users = app.libs.db.models.users;

  return {
    createUser(req, res) {
      Users.create(req.body)
        .then(result => res.json({ data: result }))
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });
    },
    updateUser(req, res) {
      Users.update(req.body, {
        where: {
          id: req.params.uid,
        },
        individualHooks: true,
      }).then(result => {
        res.json({ data: result });
      }).catch(error => {
        res.status(412).json({ msg: error.message });
      });
    },
  };
};
