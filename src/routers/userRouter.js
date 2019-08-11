const express = require('express');
const USER_ROUTES = require('./constants').USER_ROUTES;
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();


router.post(USER_ROUTES.USERS, async (req, res) => {
    // creating a new user
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.genetareAuthToken();
        res.status(201).send({ user, token });
    }
    catch(error) {
        res.status(400).send(error);
    }
});

router.post(USER_ROUTES.LOGIN, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({ error: 'Login failed. Check the credentials' });
        }
        const token = await user.genetareAuthToken();
        res.status(200).send({ user, token });
    }
    catch(error) {
        res.status(400).send(error);
    }
});

router.get(USER_ROUTES.ME, auth, async (req, res) => {
    res.send(req.user);
});


module.exports = router;