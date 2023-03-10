// here we get codes from 3rd party plugins/library
const express = require('express') // server code or to run our own server on localhost specified by port
const cors = require('cors') // this allows us to access our server on a different domain
const bodyParser = require("body-parser"); // this allows us to ready request data JSON object
const app = express() // initialize express server into a variable
const fs = require('fs') // use file system of windows or other OS to access local files
const request = require('request');
const requestAPI = request;
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
},{
    tableName: 'user',
    timestamps: false,
});



app.use(cors()) // initialize cors plugin on express
app.use(bodyParser.json({ // initialize body parser plugin on express
    extended: true
}));
app.use(bodyParser.json());// initialize body parser plugin on express

let defaultData = [];

app.post('/api/v2/register', function (
    request,
    response
) {
    let retVal = {success: false};
    console.log('req: ', request.body)
    User.findOne({
        where: {
            username: request.body.username
        }
    })
    .then((result)=>{
        if(result){
            retVal.success = false;
            retVal.message = 'username is already taken'
            response.send(retVal);
        }else{
            User.create({
                username: request.body.username,
                password: request.body.password,
                full_name: request.body.fullName,
                email: request.body.email
            })
                .then((result)=>{
                    return result.dataValues;
                })
                .then((result)=>{
                    retVal.success = true;
                    delete result.password;
                    retVal.userData = null;
                    // retVal.userData = result; // for auto login after registration
                })
                .finally(()=>{
                    response.send(retVal)
                })
                .catch((error)=>{
                    console.log('error: ', error)
                })
        }
    })
})


const runApp = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        app.listen(process.env.PORT || 3000);
 // run app with this given port
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
runApp()

