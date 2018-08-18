const express = require('express');
const todoRouter = express.Router();
const _ = require('lodash');

const { Todo } = require('../models/todo');

todoRouter.get('/', (req, res, next) => {

    Todo.find().then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

todoRouter.post('/', (req, res, next) => {
    var newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.status(201).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

todoRouter.get('/:id', (req, res, next) => {

    if (!req.params.id) console.log('Wrong id');

    Todo.findById({ _id: req.params.id }).then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

todoRouter.delete('/:id', (req, res, next) => {

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

todoRouter.patch('/:id', (req, res, next) => {
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

module.exports = todoRouter;