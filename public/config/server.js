const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                // Eventually would like to say 'Either username or password incorrect'
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                // Eventually would like to say 'Either username or password incorrect'
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

app.post('l/login',
    post.authenticate('local'),
    function(req, res) {

    res.redirect('/users/' + req.user.username);
    });