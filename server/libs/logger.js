import fs from 'fs';
import log4js from 'log4js';
import config from './config';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'file',
      filename: 'logs/app.log',
      maxLogSize: 20480,
      backups: 1,
    },
  ],
  replaceConsole: config.log.replaceConsole,
});

export default (name) => log4js.getLogger(name);
