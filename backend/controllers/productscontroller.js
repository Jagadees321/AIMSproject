const productsModel = require('../models/productsmodel');


async function createproduct(req,res){
    try {
        const { productname, price, description, category, image, rating, stock } = req.body;
        // Check if product already exists
        const existingProduct = await productsModel.findOne({ productname });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }
        // Create a new product
        const newProduct = await new productsModel(req.body); 
        newProduct.save();
        return res.status(200).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getallproducts(req,res){
    try {
        const products = await productsModel.find();
        return res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) { 
        res.status(500).json({ message: 'Internal server error',error });
    }
}

async function getproductById(req,res){
    try {
        let id = req.params.id;
        const product = await productsModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product fetched successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error',error });
        
    }
}

//update product by product name
async function updateproduct(req,res){  
    try {
        const { productname } = req.body;
        const updatedProduct = await productsModel.findOneAndUpdate(
            { productname },//condition
            req.body,//data to update
            { new: true }//options
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    }   catch (error) { 
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//delete product by id
async function deleteproduct(req,res){
    try {
        let id = req.params.id;
        const deletedProduct = await productsModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error',error });
    }
}
module.exports = {createproduct,getallproducts,getproductById,updateproduct,deleteproduct};