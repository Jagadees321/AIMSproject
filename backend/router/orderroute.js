const express = require('express');
const router = express.Router();
const { placeorder,getorders, userorderhistory ,deleteorder,updateorder} = require('../controllers/ordercontroller');



// Route to place an order  
router.post('/orders/:userid',placeorder);
router.get('/orders/:userid',getorders);
router.get('/orders/userorderhistory/:userid',userorderhistory);
router.delete('/orders/:id',deleteorder);
router.put('/orders/:id',updateorder);
module.exports = router;