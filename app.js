const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./server/db/mongoose');
const { Todo } = require('./server/models/todo');
const { User } = require('./server/models/user');
const { authenticate } = require('./server/middleware/authenticate');

var app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/todos', (req, res, next) => {
    var newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.status(201).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/todos/', (req, res, next) => {

    Todo.find().then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});


app.get('/todos/:id', (req, res, next) => {

    if (!req.params.id) console.log('Wrong id');

    Todo.findById({ _id: req.params.id }).then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', (req, res, next) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove({ _id: req.params.id }).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }

        res.status(200).send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', (req, res, next) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((doc) => {
        if (!doc) return res.status(404).send();

        res.send({ body });

    }).catch((e) => {
        res.status(400).send();
    })

});

app.post('/users', (req, res, next) => {
    let body = _.pick(req.body, 'email', 'password');
    console.log(body);

    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();

    }).then((token) => {
        console.log('USER CREATED ', user.email);
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        console.log('Unable to create new user: ', e);
        res.status(400).send(e);
    })

});

//user - instancja (funkcje dodajemy do methods)
//User - model (funkcje dodajemy do statics)
app.get('/users/me', authenticate, (req, res, next) => {

    res.send(req.user);

});

app.post('/users/login', (req, res, next) => {
    let body = _.pick(req.body, 'email', 'password');

    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        })
    }).catch(err => {
        res.status(400).send();
    })
})

app.delete('/users/me/token', authenticate, (req, res, next) => {

    req.user.removeToken(req.token).then((resp) => {
        res.status(200).send(req.user);
    }).catch(() => {
        res.status(400).send();
    })
});

app.listen(3000, () => {
    console.log(`Started on port ${PORT}`);
});