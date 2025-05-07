const cartmodel = require("../models/cartmodel");
const productsModel = require("../models/productsmodel");
const userModel = require("../models/usermodel");

async function addtocart(req,res){
    try {
        let userid=req.params.userid;
        let productid=req.params.productid;
        let quantity=req.body.quantity;
        // Check if the product exists
        console.log('point 1');
        
        const product = await productsModel.findById(productid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if the user exists
        console.log('point 2');
        
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the product is already in the cart
        console.log('point 3');
       let newcart=new cartmodel({
            userid:userid,
            productid:productid,
            quantity:quantity
        });
        newcart.save();
        return res.status(200).json({ message: 'Product added to cart successfully', newcart });
    } catch (error) {
        console.log('point 4',error);
    
        return res.status(500).json({ message: 'Internal server error',error });
    }
}

async function allcarts(req,res){
    try {
        const carts = await cartmodel.find().populate('productid').populate('userid');
        return res.status(200).json({ message: 'Carts fetched successfully', carts });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error',error });
    }
}


async function getcartsByuserid(req,res){
    try {
        let userid=req.params.userid;
        const carts = await cartmodel.find({userid:userid}).populate('productid').populate('userid');
        if (!carts) {
            return res.status(404).json({ message: 'Carts not found' });
        }
        return res.status(200).json({ message: 'Carts fetched successfully', carts });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error',error });
    }
}

module.exports={addtocart,allcarts,getcartsByuserid}