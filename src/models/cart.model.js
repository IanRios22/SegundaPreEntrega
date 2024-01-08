import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  // Asegúrate de que coincida con el nombre de tu modelo de usuario
    }
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);
