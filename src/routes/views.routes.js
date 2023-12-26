import { Router } from "express";
import { productFilter } from "../controllers/products.controller.js";
import { cartId } from "../controllers/carts.controller.js";
export const router = Router();

router.get('/products', async (req, res) => {
    const prodData = await productFilter(req, res);

    if (!prodData.payload || !prodData.payload.docs) {
        // Manejar el caso en el que prodData.payload o prodData.payload.docs es undefined
        console.error('Payload or docs is undefined:', prodData);
        return res.status(500).send('Internal Server Error');
    }

    res.render('products', {
        style: 'product.css',
        products: prodData.payload.docs,
        prevLink: prodData.prevLink,
        nextLink: prodData.nextLink,
    });
});


router.get('/carts/:cid', async (req, res) => {
    const cartData = await cartId(req, res);
    res.render('carts', {
        style: 'cart.css',
        cart: cartData.payload
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        style: 'index.css',
        user: req.session.user
    });
})

router.get('/login', (req, res) => {
    res.render('login', {
        style: 'index.css',
        user: req.session.user
    });
})

router.get('/profile', (req, res) => {
    res.render('profile', {
        style: 'index.css',
        user: req.session.user
    });
})

router.get('/restartPassword', (req, res) => {
    res.render('restartPassword', {
        style: 'index.css',
        user: req.session.user
    });
})