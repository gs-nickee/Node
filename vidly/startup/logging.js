const logger = require('../middleware/logger');
require('express-async-errors');


module.exports = function () {
    process.on('uncaughtException', (ex) => {
        console.log('We got an uncaught exception');
        logger.error(ex.message, { metadata: ex });
        process.exit(1);
    });

    process.on('unhandledRejection', (ex) => {
        console.log('We got an uncaught rejection');
        logger.error(ex.message, { metadata: ex });
        process.exit(1);
    });

    // throw new Error('Something failed during startup');

    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(() => console.log('Done'));
}