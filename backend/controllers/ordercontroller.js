const orderModel = require('../models/ordermodel');
const userModel = require('../models/usermodel');
const productModel = require('../models/productsmodel');
const cartModel = require('../models/cartmodel');

async function placeorder(req,res){
    try {
        let userid=req.params.userid;
        console.log('point 1');
        
        const{productids,shippingaddress,status,totalprice}=req.body;

        // Check if the user exists
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //calculate total price
        let total=0;    
        for(let i=0;i<productids.length;i++){
            const product=await productModel.findById(productids[i].productid);
            if(!product){
                return res.status(404).json({ message: 'Product not found' });
            }
            total+=product.price*productids[i].quantity;
        }
        console.log('point 2');
        req.body.totalprice=total;
        req.body.userid=userid;
        const newOrder = new orderModel(req.body);

        await newOrder.save();

        return res.status(200).json({ message: 'Order placed successfully', newOrder });
    } catch (error) {
        console.log('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports={placeorder }