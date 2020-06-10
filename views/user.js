const express = require('express');
const userController = require('@controllers/user');
const {HttpError} = require('@errors/http-error');

const router = express.Router();


/* References
 * - https://zellwk.com/blog/async-await-express/
 */


router.get(`/:id`, async (req, res, next) => {
    const { id } = req.params;
    let user;
    try {
        user = await userController.getUserById(id);
    } catch (err) {
        return next(
            new HttpError(`Failed to get user by id ${id}`)
                .setStatusCode(500)
                .setError(err)
        );
    }
    let result;
    try {
        result = {
            data: [ user.serialize() ],
        };
    } catch (err) {
        return next(
            new HttpError(`Failed to serialize user with id ${id}`)
                .setError(err)
        );
    }
    return res.status(200).send(result);
});

router.get('/', async (req, res, next) => {
    const { page, limit } = req.params;
    let users;
    try {
        users = await userController.getUsers({ page, limit });
    } catch (err) {
        return next(
            new HttpError(`Failed to get users`)
                .setError(err)
        );
    }
    let result;
    try {
        result = {
            data: users.map((user) => {
                return user.serialize();
            }),
        };
    } catch (err) {
        return next(
            new HttpError(`Failed to serialize list of users`)
                .setError(err)
        );
    }
    return res.status(200).send(result);
});

module.exports = router;
