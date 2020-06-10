/* References
 * - https://javascript.info/custom-errors
 * - http://expressjs.com/en/guide/error-handling.html
 */

class HttpError extends Error {
    /*
     Compatible Error for ExpressJS `next(err)`.
     */
    constructor(statusMessage, statusCode, error) {
        super(statusMessage);
        this.name = 'HttpError';
        this.stack = undefined;
        if (error) {
            this.stack = error.stack;
        }
        // Express properties
        this.statusMessage = statusMessage;
        this.statusCode = statusCode || 500;
    }

    serialize() {
        return {
            error: {
                statusCode: this.statusCode,
                statusMessage: this.statusMessage,
            }
        }
    }
}

const errorHandler = (err, req, res, next) => {
    if ((err instanceof HttpError) === false) {
        err = new HttpError('Unhandled exception caught', null, err);
    }
    res.status(err.statusCode).send(err.serialize());
    return next();
};

module.exports = {
    HttpError: HttpError,
    errorHandler: errorHandler,
};
