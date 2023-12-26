import { Router } from "express";
import { cartId, cartAddProduct, cartCreate, cartAndProductUpdate, cartDelete, cartList, cartProdDelete, cartDeleteAll, cartUpdate } from "../controllers/carts.controller.js";
export const router = Router();

router.get('/list', cartList);
router.get('/:cid', async (req, res) => {
    const cartData = await cartId(req, res);
    res.json(cartData);
})
router.put('/:cid', cartUpdate);
router.put('/:cid/products/:pid', cartAndProductUpdate);

router.post('/create', cartCreate);
router.post('/:cid/products/:pid', cartAddProduct);

router.delete('/cartDelete/:cid', cartDelete);
router.delete('/:cid/prodDelete/:pid', cartProdDelete);
router.delete('/:cid', cartDeleteAll);