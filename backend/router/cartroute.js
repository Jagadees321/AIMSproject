const express = require('express');
const router = express.Router();
const { addtocart, allcarts, getcartsByuserid, updatecart,deletecart }=require('../controllers/cartcontroller');

router.post('/cart/:userid/:productid',addtocart);
router.get('/cart',allcarts);
router.get('/cart/:userid',getcartsByuserid);
router.put('/cart/:id',updatecart);
router.delete('/cart/:id',deletecart);
module.exports = router;