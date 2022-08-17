//input source [authKeys]
var amqp = require('amqplib/callback_api');
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
let ch = null;

amqp.connect(authKeys.rabbitmq_keys.connection_url, function (err, conn) {
    conn.createChannel(function (err, channel) {
        ch = channel;
    });
});

const publishToQueue = function (queueName, payload) {
    ch.assertQueue(queueName, {
        durable: false
      });  
    ch.sendToQueue(queueName, new Buffer.from(JSON.stringify(payload)),{contentType: 'application/json'});
}
/* ---imp--on consumer end
ch.consume(queue, function(msg) {
    assert.equal('application/json', msg.properties.contentType);
    handle(JSON.parse(msg.content));
  }); */

process.on('exit', (code) => {
    ch.close();
    logger.info(infoMessages.SUCCESS_RABBITMQ_CLOSING, { service : "ConnRabb" })
});

module.exports = publishToQueue;