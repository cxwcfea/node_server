/* eslint new-cap: 0, no-param-reassign: [2, { "props": false }] */

import bcrypt from 'bcrypt';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import config from '../libs/config';

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

module.exports = (sequelize, DataType) => {
  const Users = sequelize.define('users',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mobile: {
        type: DataType.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
          is: /1[3|5|7|8|][0-9]{9}/,
        },
      },
      uuid: {
        type: DataType.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUIDV1,
      },
      status: {
        type: DataType.ENUM('INACTIVE', 'BLOCKED', 'ACTIVE'),
        allowNull: false,
        defaultValue: 'INACTIVE',
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
        defaultValue: '',
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataType.STRING,
        unique: true,
        allowNull: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      registeredAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW(),
        validate: {
          isDate: true,
        },
      },
      role: {
        type: DataType.ENUM('USER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER',
      },
      level: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      score: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      hooks: {
        beforeCreate(user) {
          user.password = hashPassword(user.password);
        },
        beforeUpdate(user, options) {
          const fields = options.fields;
          if (_.includes(fields, 'password')) {
            user.password = hashPassword(user.password);
          }
        },
      },
      classMethods: {
        associate() {
          // Users.hasMany(models.Tasks);
        },
      },
      instanceMethods: {
        authenticate(password) {
          return bcrypt.compareSync(password, this.password);
        },
        generateJwt() {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 7);

          return jwt.sign({
            _id: this.id,
            mobile: this.mobile,
            role: this.role,
            exp: parseInt(expiry.getTime() / 1000, 10),
          }, config.confidential.jwtSecret);
        },
      },
    });

  return Users;
};
