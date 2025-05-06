const cartmodel = require("../models/cartmodel");
const productsModel = require("../models/productsmodel");
const userModel = require("../models/usermodel");

async function addtocart(req,res){
    try {
        let userid=req.params.userid;
        let productid=req.params.productid;
        let quantity=req.body.quantity;
        // Check if the product exists
        const product = await productsModel.findById(productid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if the user exists
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the product is already in the cart
        const existingCartItem = await cartmodel.findOne({      
            userid: userid,
            productid: productid
        });
       let newcart=new cartmodel({
            userid:userid,
            productid:productid,
            quantity:quantity
        });
        newcart.save();
        return res.status(200).json({ message: 'Product added to cart successfully', newcart });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error',error });
    }
}
