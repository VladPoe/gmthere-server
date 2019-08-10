const mongoose = require('mongoose');
const validator = require('validator');
const bycript = require('bycriptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastNam: {
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
