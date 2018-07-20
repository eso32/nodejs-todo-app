const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('No db connection');
    }
    console.log('Connected to mongodb');

    db.collection('Users').find({name: "Bob"}).count().then((docs)=>{
        console.log('Users');
        console.log(`Tomek occures `, JSON.stringify(docs, undefined, 2));
    }, (err)=> {
        console.log('Error fetching data')
    })

    // db.close();
})