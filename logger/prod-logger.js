const newrelic = require('newrelic');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, errors, json } = format;
const path = require('path');
const newrelicFormatter = require('@newrelic/winston-enricher');

function buildProdLogger() {
    const logformat = printf(({ level, message, timestamp, stack, service }) => {
        return `${timestamp} ${level}: ${stack || message} [ ${service} ]`;
    })
    return createLogger({
        level: 'debug',
        format: combine(
            format.colorize(),
            timestamp(),
            errors({ stack: true }), //to print full error message, remove it if we don;t want this in logs.
            json(),
            logformat
           /*  newrelicFormatter() */
        ),
        defaultMeta: { service: 'user-service' },
        transports: [new transports.Console(), new transports.File({ filename: path.join('./', '_errors.log') })]
    });
}

module.exports = buildProdLogger();
