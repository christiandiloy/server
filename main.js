const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('Diloy', 'wd32p', '7YWFvP8kFyHhG3eF', {
  host: '20.211.37.87',
  dialect: 'mysql'
});

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  },
  full_name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'user',
  timestamps: false,
});

app.use(cors());
app.use(bodyParser.json({
  extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

let defaultData = [];

app.post('/api/v2/register', function (
  request,
  response
) {
  let retVal = { success: false };
  console.log('req: ', request.body);
  User.findOne({
      where: {
        username: request.body.username
      }
    })
    .then((result) => {
      if (result) {
        retVal.success = false;
        retVal.message = 'username is already taken';
        response.send(retVal);
      } else {
        User.create({
            username: request.body.username,
            password: request.body.password,
            full_name: request.body.fullName,
            email: request.body.email
          })
          .then((result) => {
            return result.dataValues;
          })
          .then((result) => {
            retVal.success = true;
            delete result.password;
            retVal.userData = null;
            // retVal.userData = result; // for auto login after registration
          })
          .finally(() => {
            response.send(retVal);
          })
          .catch((error) => {
            console.log('error: ', error);
          });
      }
    });
});

const runApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

runApp();
