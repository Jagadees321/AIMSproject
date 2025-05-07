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

async function getorders(req,res){
    try {
        const userid=req.params.userid;
        // Check if the user exists
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //check user is admin or not
        if(!user.isAdmin){
            return res.status(403).json({ message: 'You are not authorized to view this page' });
        }
        const orders = await orderModel.find({}).populate('userid').populate('productids.productid');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
       
        return res.status(200).json({message:'Orders fetched successfully',orders});
    } catch (error) {
        console.log('Error fetching orders:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

async function userorderhistory(req,res){
    try {
        const userid=req.params.userid;
        // Check if the user exists
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const orders = await orderModel.find({userid}).populate('userid').populate('productids.productid');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
       
        
        return res.status(200).json({message:'Orders fetched successfully',total:orders.length,noofproducts:orders[0].productids.length,orders});
    } catch (error) {
        console.log('Error fetching orders:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}
async function deleteorder(req,res){
    try {
        const orderid=req.params.id;
        // Check if the order exists
        const order = await orderModel.findById(orderid);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await orderModel.findByIdAndDelete(orderid);
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.log('Error deleting order:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

async function updateorder(req,res){
    try {
        const orderid=req.params.id;
        // Check if the order exists
        const order = await orderModel.findById(orderid);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(orderid, req.body, { new: true });
        return res.status(200).json({ message: 'Order updated successfully', updatedOrder });
    } catch (error) {
        console.log('Error updating order:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}
module.exports={placeorder,getorders,userorderhistory ,updateorder,deleteorder};