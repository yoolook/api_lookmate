// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '187367365433-d7djhhn1jne4u7prg04c2gfujvqbtuod.apps.googleusercontent.com',
        'clientSecret'  : 'THKXiuj0LcRX3mSjobD5jAsx',
        'callbackURL'   : 'http://localhost:3000/auth/google/'
    },
    'secret_codes' : {
        'jwt_secret_key': 'lookmatelock',
        'otp_secret_key': 'lookmateOTP'
    },
    'rabbitmq_keys' : {
        'connection_url':'amqp://jvtzjwfr:bQXL_TDSoMYcQBeOH92zoCCfYCfYb1-5@vulture.rmq.cloudamqp.com/jvtzjwfr'
    }


};
