const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    user = {
        _id: 1,
        username: 'Jacob',
        email: 'jacobneterer@gmail.com',
        password: 'password'
    };

// Register a