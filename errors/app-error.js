class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AppError';
        this.stack = undefined;
    }

    setError(error) {
        if (error) {
            this.stack = error.stack;
        }
        return this;
    }
}

class AuthenticationError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

module.exports = {
    AppError,
    AuthenticationError,
    NotFoundError,
    ValidationError,
};
