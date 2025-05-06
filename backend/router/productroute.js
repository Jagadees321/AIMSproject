const express = require('express');
const router = express.Router();
const { createproduct, getallproducts, getproductById } = require('../controllers/productscontroller');

router.post('/products',createproduct);
router.get('/products/',getallproducts);
router.get('/products/:id',getproductById);




module.exports = router;