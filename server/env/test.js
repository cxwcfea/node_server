module.exports = {
  port: 4000,
  mysql: {
    database: 'zaikan-test',
    username: 'root',
    password: '',
    params: {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        socketPath: '/tmp/mysql.sock',
      },
      logging: false,
      define: {
        underscored: true,
      },
    },
  },
  confidential: {
    sessionSecret: 'testSessionSecret',
    jwtSecret: 'testJwtSecret',
  },
  log: {
    replaceConsole: false,
  },
};
