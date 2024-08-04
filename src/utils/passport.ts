import config from 'config';
import { saveUser, findUser } from '../services/user.service';
import { Request } from 'express';
import ApiError from '../utils/apiError';
import { INVALID_CREDENTIAL, USER_EXISTS } from '../data/errors';
import GitHubClient from '../utils/githubClient';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

export function configurePassport(): void {
    passport.use(
        new GitHubStrategy(
            {
                clientID: config.get<string>('githubClientID'),
                clientSecret: config.get<string>('githubClientSecret'),
                callbackURL: `${config.get<string>('rootUrl')}/auth/github/callback`,
                passReqToCallback: false
            },
            async function (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
                try {
                    let user = profile;

                    if (!user.email) {
                        const GithubClient = new GitHubClient(accessToken);

                        const data = await GithubClient.getPrimaryEmail();

                        user = {
                            ...profile,
                            email: data?.email
                        };
                    }

                    if (!user.email) return done(new ApiError(INVALID_CREDENTIAL));

                    const existingUser = await findUser({ email: user.email });

                    if (existingUser) {
                        if (existingUser.githubId === user.id) return done(null, existingUser);
                        else return done(new ApiError(USER_EXISTS));
                    } else {
                        const nameParts = user.displayName ? user.displayName.split(' ') : [];
                        const lastName = nameParts.length > 1 ? nameParts.pop() : '';
                        const firstName = nameParts.join(' ');

                        const newUser = await saveUser({
                            firstName: firstName,
                            lastName: lastName,
                            email: user.email,
                            githubId: user.id,
                            imgUrl: user.photos[0].value
                        });

                        return done(null, newUser);
                    }
                } catch (error) {
                    return done(new ApiError(INVALID_CREDENTIAL));
                }
            }
        )
    );
    passport.use(
        new GoogleStrategy(
            {
                clientID: config.get<string>('googleClientID'),
                clientSecret: config.get<string>('googleClientSecret'),
                callbackURL: `${config.get<string>('rootUrl')}/auth/google/callback`,
                passReqToCallback: false
            },
            async function (request: Request, accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
                try {
                    if (!profile.email) return done(new ApiError(INVALID_CREDENTIAL));

                    const existingUser = await findUser({ email: profile.email });

                    if (existingUser) {
                        if (existingUser.googleId === profile.id) return done(null, existingUser);
                        else return done(new ApiError(USER_EXISTS));
                    } else {
                        const newUser = await saveUser({
                            firstName: profile.given_name,
                            lastName: profile.family_name,
                            email: profile.email,
                            googleId: profile.id,
                            imgUrl: profile.picture
                        });

                        return done(null, newUser);
                    }
                } catch (error) {
                    return done(new ApiError(INVALID_CREDENTIAL));
                }
            }
        )
    );

    passport.serializeUser(function (user: any, done: any) {
        done(null, user);
    });

    passport.deserializeUser(function (user: any, done: any) {
        done(null, user);
    });
}
