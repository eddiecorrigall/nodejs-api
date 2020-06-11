const express = require('express');
const userController = require('@controllers/user');
const {AuthenticationError, NotFoundError} = require('@errors/app-error');
const {HttpError} = require('@errors/http-error');

const router = express.Router();


router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await userController.getUserByEmail(email);
        user.authenticate({ email, password });
    } catch (err) {
        const httpError = new HttpError(`Failed login for user with email ${email}`).setError(err);
        if ((err instanceof AuthenticationError) || (err instanceof NotFoundError)) {
            httpError.setStatusCode(401);
        }
        return next(httpError);
    }
    return res.status(200).end();
});

module.exports = router;
