module.exports = {
  port: 3000,
  mysql: {
    database: 'zaikan-dev',
    username: 'root',
    password: '',
    params: {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        socketPath: '/tmp/mysql.sock',
      },
      define: {
        underscored: true,
      },
    },
  },
  confidential: {
    sessionSecret: 'developmentSessionSecret',
    jwtSecret: 'devJwtSecret',
  },
  log: {
    format: 'tiny',
    replaceConsole: true,
  },
};
