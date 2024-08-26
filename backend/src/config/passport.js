const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt}= require('passport-jwt');
const User = require('../models/UserModel');

require('dotenv').config({ path: '.env' });

// Passport JWT Strategy Configuration
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        const user = await User.findOne({ where: { email: jwt_payload.email }});
        if (user === null) {
            return done(null, false);
        } else {
            return done(null, user);
        }
    })
)

module.exports = passport;
