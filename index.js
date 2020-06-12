require('module-alias/register');

const express = require('express');
const authRoute = require('@views/auth');
const userRoute = require('@views/user');
const imageRoute = require('@views/image');
const { errorLogger, errorHandler } = require('@middleware/error');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/images', imageRoute);
app.use(errorLogger);
app.use(errorHandler);

app.listen(port, (err) => {
  if (err) {
    console.error('Cannot listen on port ${port}', err);
    return;
  }
  console.info(`Listening on port ${port}`);
});
