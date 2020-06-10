class AppError extends Error {
    constructor(message, error) {
        super(message);
        this.name = 'AppError';
        this.stack = undefined;
        if (error) {
            this.stack = error.stack;
        }
    }
}

class AppControllerError extends AppError {
    constructor(message, error) {
        super(message);
        this.name = 'AppControllerError';
        this.stack = undefined;
        if (error) {
            this.stack = error.stack;
        }
    }
}

module.exports = {
    AppError: AppError,
    AppControllerError: AppControllerError,
};
