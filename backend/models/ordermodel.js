const mongoose = require('mongoose');

const orderSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //product of array of objects in object productid quantity
    productid:[{
        productid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        },
        quantity:{
            type:Number,
           
        }
    }],
   
    shippingaddress:{
        type:String
        
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','shipped','delivered','cancelled'],
        lowercase:true
    },
    totalprice:{
        type:Number
    },
    paymentstatus:{
        type:String,
        default:'pending',
        enum:['pending','paid'],
        lowercase:true
    },
    paymentmethod:{
        type:String,
        default:'cod',
        enum:['cod','online'],
        lowercase:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    orderdate:{
        type:Date,
        default:Date.now
    },
    deliverydate:{
        type:Date,
        default:Date.now
    },
    cancelleddate:{
        type:Date,
        default:Date.now
    },
    delivereddate:{
        type:Date,
        default:Date.now
    },

},{timestamps:true});
module.exports=mongoose.model('order',orderSchema);
