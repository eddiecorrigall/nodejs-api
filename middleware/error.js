const { HttpError } = require('@errors/http-error');

const errorLogger = (err, req, res, next) => {
    if (err) {
        if (err instanceof HttpError) {
            if (500 <= err.statusCode && err.statusCode < 600) {
                // Log only 5xx level errors
                console.error(err);
            }
        } else {
            // Log all non HttpError's
            console.error(err);
        }
    }
    next(err);
};

const errorHandler = (err, req, res, next) => {
    if ((err instanceof HttpError) === false) {
        err = new HttpError('Unhandled exception caught').setError(err);
    }
    if (req.xhr) {
        err = new HttpError('Response did not end').setError(err);
    }
    res.status(err.statusCode).send(err.serialize());
    return next();
};

module.exports = {
    errorLogger,
    errorHandler,
};
