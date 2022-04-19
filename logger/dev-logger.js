const newrelic = require('newrelic');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, errors } = format;
const newrelicFormatter = require('@newrelic/winston-enricher');

function buildDevLogger() {
    const logformat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    })
    return createLogger({
        level: 'info',
        format: combine(
            format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }), //to print full error message, remove it if we don;t want this in logs.
            logformat
        ),
        transports: [new transports.Console()]
    });
}


module.exports = buildDevLogger();

 
/* format: winston.format.combine(
    winston.format.label({
        "timestamp": 1649790223,
        "message": "from winston",
        "logtype": "accesslogs",
        "service": "login-service",
        "hostname": "login.example.com"
    }),
    newrelicFormatter()
), */