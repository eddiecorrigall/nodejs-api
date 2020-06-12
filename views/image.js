const express = require('express');
const imageController = require('@controllers/image');
const {HttpError} = require('@errors/http-error');
const {serializeItems} = require('@views');

const router = express.Router();


router.get('/random', async (req, res, next) => {
    const { width, height } = req.params;
    let image;
    try {
        image = await imageController.getRandomImage({ width, height });
    } catch (err) {
        const httpError = new HttpError(`Image could not be retrieved`)
            .setError(err);
        return next(httpError);
    }
    return serializeItems({ req, res, next, items: [image] });
});


module.exports = router;
