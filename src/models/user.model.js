import mongoose from "mongoose";

const userCollection = 'users';
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number
    },
    password: {
        type: String
    },
    rol: {
        type: String,
        default: 'user'
    }

});

export const userModel = mongoose.model(userCollection, userSchema);