import https from 'https';
import querystring from 'querystring';
import loggerFactory from './logger';

// const signupCaptchaContent = '';

const logger = loggerFactory('sms');
const BrandName = '【财富函数】';

function luosimaoService(mobile, content) {
  const postData = {
    mobile,
    message: `${content} ${BrandName}`,
  };

  const msg = querystring.stringify(postData);

  const options = {
    host: 'sms-api.luosimao.com',
    path: '/v1/send.json',
    method: 'POST',
    auth: 'api:529a388a963b344ad163b33575360eee',
    agent: false,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': msg.length,
    },
  };

  try {
    const req = https.request(options, (res) => {
      let response = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
        // console.log(chunk);
        // logger.debug(JSON.parse(chunk));
      });
      res.on('end', () => {
        logger.info(`sms send over\n${response}`);
      });
    });

    req.write(msg);
    req.end();
  } catch (e) {
    logger.error(`sms send fail\n${e}`);
  }
}

function sendSMS(mobile, content) {
  luosimaoService(mobile, content);
}

export { sendSMS };
