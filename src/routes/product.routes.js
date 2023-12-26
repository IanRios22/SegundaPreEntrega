import { Router } from "express";
import { productFilter, prodAdd, prodDelete, prodId, prodUpdate } from "../controllers/products.controller.js";
export const router = Router();

router.get('/', async (req, res) => {
    const prodData = await productFilter(req, res);
    res.json(prodData);
})
router.get('/:pid', prodId);
router.post('/add', prodAdd);
router.put('/:pid', prodUpdate);
router.delete('/:pid', prodDelete);