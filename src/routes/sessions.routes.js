import { Router } from "express";
import { userModel } from "../models/user.model.js";
// Importamos el createHash
import { createHash } from "../utils.js";
import passport from "passport";
import { sessionModel } from "../models/session.model.js";

export const router = Router();


router.get('/current', async (req, res) => {
    try {
        // Verifica si el usuario está autenticado
        if (req.isAuthenticated()) {
            // Obtén la información de la sesión utilizando el modelo de sesión
            const sessionId = req.sessionID;
            const session = await sessionModel.findOne({ _id: sessionId });

            // Comprueba si hay una sesión y si tiene información del usuario
            if (session && session.passport && session.passport.user) {
                const userId = session.passport.user;

                // Utiliza el modelo de usuario para obtener la información del usuario
                const user = await userModel.findById(userId);

                // Devuelve la información del usuario en la respuesta
                res.status(200).json({ status: "success", user });
            } else {
                // No se encontró información de usuario en la sesión
                res.status(401).json({ status: "error", error: "No authenticated user" });
            }
        } else {
            // El usuario no está autenticado
            res.status(401).json({ status: "error", error: "Not logged in" });
        }
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});



router.post('/register', async (req, res) => {
    passport.authenticate('register', { failureRedirect: '/failregister' }, async (err, user) => {
        if (err) {
            return res.status(500).send({ status: 'error', error: err.message });
        }
        res.send({ status: 'success', message: "Usuario registrado" });
    })(req, res);
});

router.get('/failregister', async (req, res) => {
    res.send({ error: 'failed register' });
});

router.post('/login', async (req, res) => {
    passport.authenticate('login', { failureRedirect: '/faillogin' }, async (err, user) => {
        if (err) {
            return res.status(500).send({ status: 'error', error: err.message });
        }
        if (!user) {
            return res.status(400).send({ status: 'error', error: "valores incompletos" });
        }

        req.session.user = {
            name: user.first_name + user.last_name,
            age: user.age,
            email: user.email,
            rol: user.rol,
        };

        res.send({ status: 'success', payload: user });
    })(req, res);
});

router.get('/faillogin', async (req, res) => {
    res.send({ error: 'Error al loguearte' });
});

router.get('/github', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = {
        name: req.user.first_name + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
    };
    res.redirect('/profile');
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: "logout", body: err });
        }
        res.send('logout OK!');
    });
});

router.post('/restartpassword', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Incomplete password" });
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).send({ status: "error", error: "User does not exist" });
        }

        const newHashPassword = createHash(password);
        await userModel.updateOne({ _id: user._id }, { $set: { password: newHashPassword } });

        res.send({ status: "success", message: "Password updated successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});
