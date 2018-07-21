const {mongoose} = require('../server/db/mongoose');
const {User} = require('../server/models/user');

var id = "11b52fb2f3b0cbe0a4ce1976f";

// Todo.find({
//     _id: id
// }).then((todo) => {
//     console.log('TO dos:', todo);
// });

User.findById({
    _id: id
}).then((user) => {
    if(user) console.log('Nothing to show');

    console.log('Found user:', user);
}).catch((e) => {
    console.log('Unhandled error', e);
});