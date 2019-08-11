const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw Error({
                    error: `Invalid email: ${value}`
                });
            }
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        },
    ]
});


userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.genetareAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw Error({ error: `No such a user with a given email ${email}` });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw Error({ error: 'Invalid credentials' });
        }
        return user;
    }
    catch(error) {
        console.log(error);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;