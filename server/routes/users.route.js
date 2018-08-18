const express = require('express');
const usersRouter = express.Router();
const _ = require('lodash');

const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');


usersRouter.post('/', (req, res, next) => {
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

usersRouter.get('/me', authenticate, (req, res, next) => {

    res.send(req.user);
});

usersRouter.post('/login', (req, res, next) => {
    let body = _.pick(req.body, 'email', 'password');

    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        })
    }).catch(err => {
        res.status(400).send();
    })
})

usersRouter.delete('/me/token', authenticate, (req, res, next) => {

    req.user.removeToken(req.token).then((resp) => {
        res.status(200).send(req.user);
    }).catch(() => {
        res.status(400).send();
    })
});

module.exports = usersRouter;