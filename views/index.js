const {HttpError} = require('@errors/http-error');


exports.serializeItems = ({ req, res, next, items }) => {
    try {
        return res.status(200).send({
            data: items.map((item) => {
                return item.serialize();
            }),
        });
    } catch (err) {
        return next(
            new HttpError('Internal server error').setError(err)
        );
    }
};
