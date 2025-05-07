const express = require('express');
const router = express.Router();
const { addtocart, allcarts, getcartsByuserid }=require('../controllers/cartcontroller');

router.post('/cart/:userid/:productid',addtocart);
router.get('/cart',allcarts);
router.get('/cart/:userid',getcartsByuserid);
module.exports = router;