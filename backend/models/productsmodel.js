const mongoose=require('mongoose');

const productschema=new mongoose.Schema({
   productname:{
       type:String
       
   },
   price:{
       type:Number
       
   },
    description:{
         type:String
         
    },
    category:{
        type:String
       
    },
    image:{
        type:String
    },
    rating:{
        type:Number
    },
    stock:{
        type:Number,
        default:0
    },
   //reviews in array of objects username and review and rating and optional
    reviews:[{
         username:{
              type:String,
              required:true
         },
         review:{
              type:String,
              required:true
         },
         rating:{
              type:Number,
              required:true
         }
    }],

    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
    

},{
    collection:'products',
    timestamps:true
});
const productmodel=mongoose.model('products',productschema);
module.exports=productmodel;