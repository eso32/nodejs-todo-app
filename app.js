const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./server/db/mongoose');
const { Todo } = require('./server/models/todo');
const { User } = require('./server/models/user');

//Routers
const todoRouter = require('./server/routes/todo.route');
const usersRouter = require('./server/routes/users.route');

//Config
const headers = require('./server/config/headers.config');

var app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/todos', todoRouter);
app.use('/users', usersRouter);

//user - instancja (funkcje dodajemy do methods)
//User - model (funkcje dodajemy do statics)

app.listen(3000, () => {
    console.log(`Started on port ${PORT}`);
});