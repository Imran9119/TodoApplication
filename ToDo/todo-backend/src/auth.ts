import express, { Application } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

interface User {
    id: string;
    displayName: string;
    // Add other properties relevant to your user
}

export const setupAuth = (app: Application) => {
    // Configure the Google strategy for use by Passport.
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }, (token, tokenSecret, profile, done) => {
        // In a real application, you would probably want to associate the Google account with a user record in your database.
        // For the purpose of this example, the user's Google profile is returned to represent the logged-in user.
        return done(null, profile);
    }));

    // Serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Deserialize the user from the session
    passport.deserializeUser((obj: unknown, done) => {
        const user = obj as User; // Type assertion
        done(null, user);
    });

    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Define your authentication routes here
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/' }),
        (_req, res) => {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
};

export default passport;
