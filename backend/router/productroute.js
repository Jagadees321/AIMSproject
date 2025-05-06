const express = require('express');
const router = express.Router();
const { createproduct, getallproducts, getproductById, updateproduct, deleteproduct } = require('../controllers/productscontroller');

router.post('/products',createproduct);
router.get('/products/',getallproducts);
router.get('/products/:id',getproductById);
router.put('/products',updateproduct);
router.delete('/products/:id',deleteproduct)
module.exports = router;