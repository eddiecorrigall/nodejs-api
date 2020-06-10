const { AppError } = require('@errors/app-error');


/* References
 * - https://javascript.info/custom-errors
 * - http://expressjs.com/en/guide/error-handling.html
 */

class HttpError extends AppError {
    /*
     Compatible Error for ExpressJS `next(err)`.
     */
    constructor(message) {
        super(message);
        this.name = 'HttpError';
        // Express properties
        this.statusCode = 500;
    }

    setStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    serialize() {
        return {
            error: {
                statusCode: this.statusCode,
                statusMessage: this.message,
            },
        };
    }
}

const errorHandler = (err, req, res, next) => {
    if ((err instanceof HttpError) === false) {
        err = new HttpError('Unhandled exception caught').setError(err);
    }
    res.status(err.statusCode).send(err.serialize());
    return next();
};

module.exports = {
    HttpError,
    errorHandler,
};
