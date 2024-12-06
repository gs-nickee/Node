const config = require('config');
const Joi = require('joi');
const logger = require('./middleware/logger');
const authentication = require('./authentication');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: true })); //key=value&key=value
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

app.set('view engine', 'pug');
app.set('views', './views');

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan("tiny"));
    console.log('Morgan enabled...');
}


app.use(logger);
app.use(authentication);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));