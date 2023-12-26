import passport from "passport";
import local from "passport-local"
import GithubStrategyOptions from 'passport-github2';
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
export const initializedPassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userModel.findOne({ email: username });
                if (user) return done(null, false);
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let res = await userModel.create(newUser);
                return done(null, res);
            } catch (error) {
                return done('usuario no encontrado' + error);
            }
        }));

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        try {
            const user = await userModel.findOne({ email: email });
            console.log('Usuario: ' + user);
            if (!user) return done(null, false);
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(null, false);
        }
    }))

    passport.use('github', new GithubStrategyOptions({
        clientID: "Iv1.a0d6b68b53746763",
        clientSecret: "1db1da6ebc85a08c3d42fcadacf51b986fe7ec6c",
        callbackURL: "http://localhost:8080/api/sessions/github",
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    name: profile._json.name,
                    last_name: "",
                    age: 22,
                    email: profile._json.email,
                    password: ""
                }
                let res = await userModel.create(newUser);
                done(null, res);
            }
            else {
                done(null, user);
            }
        } catch (error) {
            done(null, error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Lógica para deserializar al usuario
        userModel.findById(id, (err, user) => {
            done(err, user);
        });
    });

}


//App ID: 702635

//Client ID: Iv1.a0d6b68b53746763
//1db1da6ebc85a08c3d42fcadacf51b986fe7ec6c