import { productsModel } from "../models/products.model.js";

const getPrevLink = (baseUrl, result) => {
    return baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`);
}
const getNextLink = (baseUrl, result) => {
    return baseUrl.includes('page') ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`);
}

export const productFilter = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1
        let limit = req.query.limit ? parseInt(req.query.limit) : 10
        let sort = 0
        let query = {}

        if (req.query.sort) {
            const sortOption = req.query.sort.toLowerCase()
            if (sortOption === 'asc') {
                sort = 1
            } else {
                sortOption === 'desc'
                sort = -1
            }
        }
        if (req.query.query) {
            query = { category: { $regex: req.query.query, $options: "i" } }
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort != 0 ? { price: sort } : null
        }

        let result = await productsModel.paginate(query, options)
        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        return {
            status: 200,
            payload: result,
            prevLink: result.hasPrevPage ? getPrevLink(baseUrl, result) : null,
            nextLink: result.hasNextPage ? getNextLink(baseUrl, result) : null
        }

    } catch (error) {
        return {
            status: 500,
            error: 'Error en el server' + error
        }
    }
}

export const prodId = async (req, res) => {
    try {
        let { pid } = req.params;
        let result = await productsModel.findById(pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send(`No se encontro el producto con el id: ${pid}`);
    }
}

export const prodAdd = async (req, res) => {
    try {
        let { title, description, price, thumbnail, code, stock, category } = req.body
        if (!req.body || !title || !description || !price || !thumbnail || !code || !stock || !category) {
            return res.status(400).send('Valores incompletos');
        }
        let result = await productsModel.create({ title, description, price, thumbnail, code, stock, category });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send('Error al crear el producto' + error);
    }
}

export const prodUpdate = async (req, res) => {
    try {
        let { pid } = req.params;
        let prodReplace = req.body;
        if (!prodReplace.title || !prodReplace.description || !prodReplace.price || !prodReplace.thumbnail || !prodReplace.code || !prodReplace.stock || !prodReplace.category) return res.status(400).send({ status: "error", error: "Valores Imcpletos" });

        let result = await productsModel.updateOne({ _id: pid }, prodReplace);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(400).send("Error al actualizar el producto");
    }
}

export const prodDelete = async (req, res) => {
    try {
        let { pid } = req.params;
        let result = await productsModel.deleteOne({ _id: pid });
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(400).send('Error deleting product')
    }
}