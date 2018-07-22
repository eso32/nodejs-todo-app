const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email adress'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
})

//nadpisujemy funkcje moongose
//funkcja wywoływana gdy mongoose zamienia wartośc na json/
//ograniczamy ilość danych przesyłanych do uzytkownika
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

//here we need this keyword, that's why we use normal function insted of arrow
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'moveittoconfig').toString();

    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    return user.save().then(()=>{
        return token;
    })

}

var User = mongoose.model('User', UserSchema);

module.exports = { User };