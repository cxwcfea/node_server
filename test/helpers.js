import supertest from 'supertest';
import chai from 'chai';
import app from '../server/index.js';

global.app = app;
/*
app.libs.db.sequelize.sync().then(() => {
  console.log('test db sync done');
});
*/
global.request = supertest(app);
global.expect = chai.expect;
global.assert = chai.assert;
