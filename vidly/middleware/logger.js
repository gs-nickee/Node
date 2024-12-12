const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'logfile.log' }),
        new winston.transports.MongoDB({
            db: 'mongodb://localhost/vidly', // MongoDB connection string
            options: { useUnifiedTopology: true }, // MongoDB driver options
            level: 'error', // Only log errors to MongoDB
            collection: 'log_entries', // Collection to store logs (default: 'log')
            storeHost: true // Store the hostname of the machine where the logs originate
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
