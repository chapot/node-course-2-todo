var express = require('express');
var bodyParser = require('body-parser');
const {ObjectId} =require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
    if(!ObjectId.isValid(id)){
        // Not valid 404 with empty body
        return res.status(404).send();
    }
        
    // findById
    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        } 
        res.send({todo});
    }).catch((e) => {
        return res.status(404).send();
    });

        
});

app.delete('/todos/:id', (req, res) => {
    // Get the id
    var id = req.params.id;

    // Validate the id -> not valide return 404
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    // Remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});        
    }).catch((e) => {
        return res.status(404).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};

