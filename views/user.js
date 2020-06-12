const express = require('express');
const userController = require('@controllers/user');
const {NotFoundError} = require('@errors/app-error');
const {HttpError} = require('@errors/http-error');
const {serializeItems} = require('@views');

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
        const httpError = new HttpError(`Failed to get user by id ${id}`).setError(err);
        if (err instanceof NotFoundError) {
            httpError.setStatusCode(404);
        }
        return next(httpError);
    }
    return serializeItems({ req, res, next, items: [user] });
});

router.get('/', async (req, res, next) => {
    const { page, limit } = req.params;
    let users;
    try {
        users = await userController.getUsers({ page, limit });
    } catch (err) {
        const httpError = new HttpError(`Failed to get users`)
            .setError(err);
        if (err instanceof NotFoundError) {
            httpError.setStatusCode(404);
        }
        return next(httpError);
    }
    return serializeItems({ req, res, next, items: users });
});

module.exports = router;
