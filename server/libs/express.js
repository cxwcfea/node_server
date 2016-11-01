import bodyParser from 'body-parser';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import expressValidator from 'express-validator';
import loggerFactory from './logger';

const logger = loggerFactory('express');

module.exports = app => {
  const config = app.libs.config;
  app.set('json spaces', 4);
  if (config.log.format) {
    app.use(morgan(config.log.format, {
      stream: {
        write(message) {
          logger.trace(message);
        },
      },
    }));
  }
  app.use(helmet());
  /*
   app.use(cors({
   origin: ['http://localhost:3001'],
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']
   }));
   */
  const MySQLStore = require('connect-mysql')(session);
  const mysqlStore = new MySQLStore({
    config: {
      host: config.mysql.params.host,
      user: config.mysql.username,
      password: config.mysql.password,
      socketPath: config.mysql.params.dialectOptions.socketPath,
      database: config.mysql.database,
    },
  });

  app.use(session({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: true,
    resave: true,
    secret: config.confidential.sessionSecret,
    store: mysqlStore,
  }));

  app.use(compression());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(expressValidator());

  app.use(app.libs.auth.initialize());
  app.use(express.static('public'));

  require('../routes/api.server.routes')(app);
  require('../routes/common.server.routes')(app);
  require('../routes/index.server.routes')(app);
};
