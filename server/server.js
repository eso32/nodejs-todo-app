const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

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

    if(!req.params.id) console.log('Wrong id');

    Todo.findById({_id: req.params.id}).then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', (req, res, next) => {

    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove({_id: req.params.id}).then((doc) => {
        if(!doc) {
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

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
        if(!doc) return res.status(404).send();

        res.send({body});
        
    }).catch((e) => {
        res.status(400).send();
    })


});

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});