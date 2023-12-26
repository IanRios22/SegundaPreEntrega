import { Router } from "express";
import { userModel } from "../models/user.model.js";
// Importamos el createHash
import { createHash } from "../utils.js";
import passport from "passport";

export const router = Router();

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
router.get("/current", (req, res) => {
    if (req.user) {
        res.status(200).json({ status: "success", user: req.user });
    } else {
        res.status(401).json({ status: "error", error: "Not logged user" });
    }
});


router.post('/login', async (req, res) => {
    passport.authenticate('login', { failureRedirect: '/faillogin' }, async (err, user) => {
        if (err) {
            return res.status(500).send({ status: 'error', error: err.message });
        }
        if (!req.user) {
            return res.status(400).send({ status: 'error', error: "valores incompletos" });
        }

        req.session.user = {
            name: req.user.first_name + " " + req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.ro
        };

        res.send({ status: 'success', payload: req.user });
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
