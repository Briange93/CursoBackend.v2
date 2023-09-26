import express from 'express';
import { ProductModel } from '../../models/productModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const response = await ProductModel.create(body); 
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const filter = req.query.filter === 'false' ? false : true;

    try {
        const availableFilter = filter ? {} : { available: filter };
        const options = { sort: { price: sort }, limit, page };
        const response = await ProductModel.paginate(availableFilter, options);  
        res.send({ status: 'Success', payload: response});
    } catch (error) {
        res.status(400).json(error.message);
    }
});


export default router;