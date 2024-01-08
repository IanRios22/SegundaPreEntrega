// session.model.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const sessionSchema = new Schema({
    _id: String,
    session: {
        cookie: {
            originalMaxAge: {
                type: Number,
                required: true,
            },
            expires: {
                type: Date,
                required: true,
            },
            secure: Boolean,
            httpOnly: Boolean,
            path: String,
            sameSite: String,
        },
        passport: {
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User', // Asegúrate de que coincida con el nombre de tu modelo de usuario
            },
        },
    },
});

const sessionModel = mongoose.model('Session', sessionSchema);

export { sessionModel };
