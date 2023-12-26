import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { router as viewsRouter } from "./routes/views.routes.js";
import { router as sessionRouter } from "./routes/sessions.routes.js";
import { router as prodRouter } from './routes/product.routes.js'
import { router as cartRouter } from './routes/cart.routes.js'
import passport from "passport";
import { initializedPassport } from "./config/passport.config.js";
import { __dirname } from "./utils.js";
import './db/db.config.js';
import { connectionString } from "./db/db.config.js";
//import 'dotenv/db';


const app = express();
const mongoStoreOptions = {
    store: MongoStore.create({
        mongoUrl: connectionString,
        ttl: 120,
        crypto: {
            secret: '1234'
        }
    }),
    secret: '1234',
    resave: false,
    saveUninitialized: false
};

//const port = process.env.PORT || 8080;
const port = 8080;

app.listen(port, () => { console.log(`El server funcionando en puerto ${port}`) });
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine({
    defaultLayout: 'main',
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
    },
}))
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Configuración de express-session y passport antes de las rutas
app.use(session(mongoStoreOptions));
initializedPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', prodRouter);

app.get('/', (req, res) => {
    res.send('Welcome al refactor login => disponible: /profile /login /register /restartPassword');
})