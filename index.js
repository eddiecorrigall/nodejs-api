require('module-alias/register');

const express = require('express');
const authRoute = require('@routes/auth');
const userRoute = require('@routes/user');
const { errorHandler } = require('@errors/http-error');

const port = process.env.PORT || 8080;
const app = express();

const clientErrorHandler = (err, req, res, next) => {
    if (req.xhr) {
        err = new HttpError('Response was not ended', null, err);
    }
    next(err);
};

const logError = (err, req, res, next) => {
    if (err) {
        console.error(err);
    }
    next(err);
};

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use(clientErrorHandler);
app.use(logError);
app.use(errorHandler);

app.listen(port, (err) => {
  if (err) {
    console.error('Cannot listen on port ${port}', err);
    return;
  }
  console.info(`Listening on port ${port}`);
});
