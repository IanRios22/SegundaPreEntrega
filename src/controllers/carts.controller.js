import { cartsModel } from "../models/cart.model.js";
import { productsModel } from "../models/products.model.js";

export const cartId = async (req, res) => {
    try {
        let cid = req.params.cid;
        let result = await cartsModel.findById({ _id: cid }).populate('products.product');
        return { status: 'sucessful', payload: result };
    } catch (error) {
        return { status: 'error', error: 'error' + error }
    }
}

export const cartCreate = async (req, res) => {
    try {
        // Obtiene el ID del usuario actual, asumiendo que está almacenado en req.user._id
        const userId = req.user._id;

        // Crea el carrito asociado al usuario
        let result = await cartsModel.create({ products: [], user: userId });
        res.send({ status: 'cart created', payload: result });
    } catch (error) {
        res.status(404).send({ status: 'error' + error });
    }
}

export const cartAddProduct = async (req, res) => {
    try {
        let { cid, pid } = req.params;
        let cart = await cartsModel.findById({ _id: cid });
        const existProd = cart.products.findIndex(a => a.product.equals(pid));
        if (existProd === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[existProd].quantity += 1;
        }
        await cart.save();

        let result = await cartsModel.findById({ _id: cid }).populate('products.product');
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
}

export const cartList = async (req, res) => {
    try {
        let result = await cartsModel.find();
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
}

export const cartDelete = async (req, res) => {
    try {
        let { cid } = req.params;
        let result = await cartsModel.deleteOne({ _id: cid });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
}

export const cartProdDelete = async (req, res) => {
    let { cid, pid } = req.params;
    try {
        let product = await productsModel.findById(pid);
        let cart = await cartsModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $inc: { 'products.$.quantity': -1 } },
            { new: true }
        )
        if (!cart) {
            return res.status(404).send('carrito no encontrado')
        }
        await cartsModel.findOneAndUpdate({ _id: cid, 'products.product': pid, 'products.quantity': { $lte: 0 } },
            { $pull: { 'products': { product: pid } } },
            { new: true });

        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
};

export const cartUpdate = async (req, res) => {
    try {
        let { cid } = req.params;
        let prodUpdate = req.body.products;
        let updateCart = await cartsModel.findByIdAndUpdate(
            cid,
            {
                $set: {
                    'products': prodUpdate
                },
            }
        );
        if (!updateCart) {
            return res.status(404).send({ status: 'error no se pudo actualizar' });
        }
        res.send({ status: 'success', payload: updateCart });
    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
}

export const cartAndProductUpdate = async (req, res) => {
    try {
        let { cid, pid } = req.params;
        let product = await productsModel.findById(pid);
        let cart = await cartsModel.findById(cid);
        let prodQuantity = req.body.quantity;
        const existProductIndex = cart.products.findIndex(a => a._id.equals(product._id));
        const existProd = cart.products[existProductIndex];
        await cartsModel.findOneAndUpdate(
            { _id: cid, 'products._id': existProd._id },
            { $set: { 'products.$.quantity': prodQuantity } },
        )
        let cartSave = await cartsModel.findById(cid);
        res.send({ status: 'success', payload: cartSave });

    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
}

export const cartDeleteAll = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModel.findById(cid);
        if (!cart) return res.status(404).send({ status: 'Not Found' });
        cart.products = [];
        const result = await cart.save();
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error' + error });
    }
}