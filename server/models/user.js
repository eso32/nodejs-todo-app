const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//.methods adds method that can be invoked on instance ie. user but not User

//nadpisujemy funkcje moongose
//funkcja wywoływana gdy mongoose zamienia wartośc na json/
//ograniczamy ilość danych przesyłanych do uzytkownika
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

//here we need this keyword, that's why we use normal function insted of arrow
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'oveittoconfig').toString();

    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    return user.save().then(() => {
        return token;
    })

}

//delete one property from 'document -> row'
UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
}

//.statics turns into model methods (invoked on User)
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'oveittoconfig');
    } catch (e) {
        // return new Promise((resolve, reject)=>{
        //     reject();
        // })

        return Promise.reject();
    }

    //jeśli wartość jest zagnieżdżona to musimy właściwość wprowadzić w cudzysłowie z kropką (jak dot notation)
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, resl) => {
                if (resl) {
                    resolve(user);
                }

                reject();
            })
        })
    })

}

//change plain text password to hash that is stored in db
//.pre is invoked before .save on UserSchema (instance -> user);
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        })
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };