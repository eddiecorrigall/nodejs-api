const express = require('express');
const userController = require('@controllers/user');
const {HttpError} = require('@errors/http-error');

const router = express.Router();


router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await userController.getUserByEmail(email);
        user.authenticate({ email, password });
    } catch (err) {
        return next(new HttpError(
            `Failed login for user with email ${email}`, 401, err));
    }
    return res.status(200).end();
});

module.exports = router;
