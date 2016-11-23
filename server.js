var Hapi = require('hapi');

var people = { // our "users database"
    1: {
        id: 1,
        name: 'Jen Jones'
    }
};

// bring your own validation function
var validate = function (decoded, request, callback) {

    // do your checks to see if the person is valid
    if (!people[decoded.id]) {
        return callback(null, false);
    }
    else {
        return callback(null, true);
    }
};

var server = new Hapi.Server();
server.connection({host:'localhost', port: 8000 });
// include our module here ↓↓
server.register(require('hapi-auth-jwt2'), function (err) {

    if(err){
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt',
        { key: 'NeverShareYourSecret',          // Never Share your secret key
            validateFunc: validate,            // validate function defined above
            verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
        });

    server.auth.default('jwt');

    server.route([
        {
            method: "GET", path: "/", config: { auth: false },
            handler: function(request, reply) {
                reply({text: 'Token not required'});
            }
        },
        {
            method: 'GET', path: '/restricted', config: { auth: 'jwt' },
            handler: function(request, reply) {
                reply({text: 'You used a Token!'})
                    .header("Authorization", request.headers.authorization);
            }
        }
    ]);
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});






















/*
var Hapi = require('hapi');

  // var Routes = require('./routes');        //includes file which has all the routes for an application

    var config = require ('./app/config/config.js');

 var mongoose = require ('./app/config/mongoose.js');

//Db = require('./config/db'),

   var  Moment = require('moment');//a lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates

    //Config = require('./config/config'); // includes file which has app configuration details such as hostname, hostport, etc ..


var app = {};
app.config = config;
var privateKey = app.config.privateKey;
var ttl = app.config.tokenExpiry;

var Vision = require('vision');
var Handlebars = require('handlebars');


//creates server
var server = new Hapi.Server();
server.connection({host:config.host, port: config.port });
// start your server
//server.connection({host: "localhost", port: 9000});
// Validate function to be injected
var validate = function(token, callback) {
    // Check token timestamp
    var diff = Moment().diff(Moment(token.iat * 1000));
    if (diff > ttl) {
        return callback(null, false);
    }
    callback(null, true, token);
};

// Plugins, register hapi-auth-jwt to server
server.register([{
    register: require('hapi-auth-jwt')
},{register:Vision}], function(err) {
    server.auth.strategy('token', 'jwt', {
        validateFunc: validate,
        key: privateKey
    });
    server.views({
        engines: {ejs: require('ejs')},
        relativeTo: __dirname,
        path: './app/views'
    });
    // add routes to server
    server.register(Vision, function (err) {
        if (err) {
            console.log('Cannot register vision')

        }
    });
    var route = require('./app/routes/jswroute.js');
    server.route(route.endpoints);
    server.log('Routes registered');
});

server.start(function (err) {
    if (err) {
        throw err
    }

    console.log('Server running at: ' + server.info.uri)
});


*/














