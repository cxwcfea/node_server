process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import http from 'http';
import express from 'express';
import config from './libs/config';
import configExpress from './libs/express';
import db from './libs/db';
import auth from './libs/auth';

function startServer() {
  const app = express();

  app.libs = {
    config,
    controllers: {},
  };
  app.libs.db = db(app);
  app.libs.auth = auth(app);
  app.libs.controllers.commonCtrl = require('./controllers/common.server.controller.js')(app);
  app.libs.controllers.userCtrl = require('./controllers/users.server.controller.js')(app);

  configExpress(app);
  const port = config.port;
  const server = http.createServer(app);

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  });

  server.listen(port);
}

if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
