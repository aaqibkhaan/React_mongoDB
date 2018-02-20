const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20");

const mongoose = require("mongoose");

const keys = require("../config/keys");

const User = mongoose.model("users");

// Serializing User
passport.serializeUser((user , done) => {
	done(null, user.id);
});

// Turning id to a user 
passport.deserializeUser((id, done) => {
User.findById(id).then((user) => {
	done(null, user);
});

});



passport.use(
	new GoogleStrategy(
		{

			clientID: keys.googleClientID, 
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback",
			proxy: true
		},
		async (accessToken, refreshToken, profile, done ) => {

		const exisitingUser = await User.findOne({ googleID: profile.id});
				if (exisitingUser) {
					return done(null, exisitingUser);
				} 
					const user = await new User({ googleID: profile.id}).save();
					done(null, user);

		}
	)
);