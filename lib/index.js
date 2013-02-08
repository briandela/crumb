// Load modules

var Hoek = require('hoek');


// Declare internals

var internals = {};

internals.config = {
    name: 'jar',
    isSingleUse: false,             // Cleared after every request, unless modified
    options: {}                     // hapi server.state() options, except 'encoding' which is always 'iron'. 'password' required.
};


exports.register = function (pack, options, next) {

    Hoek.merge(internals.config, options);
    internals.config.options.encoding = 'iron';

    pack.state(internals.config.name, internals.config.options);
    pack.ext('onPreHandler', internals.onPreHandler);
    pack.ext('onPostHandler', internals.onPostHandler);

    next();
};


internals.onPreHandler = function (request, next) {

    request.api.jar = {};

    if (internals.config.isSingleUse) {
        request.clearState(internals.config.name);
    }

    next();
};


internals.onPostHandler = function (request, next) {

    if (Object.keys(request.api.jar).length) {
        request.setState(internals.config.name, request.api.jar);
    }

    next();
};
