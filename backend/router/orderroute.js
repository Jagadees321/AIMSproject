const express = require('express');
const router = express.Router();
const { placeorder } = require('../controllers/ordercontroller');



// Route to place an order  
router.post('/order/:userid',placeorder);
module.exports = router;