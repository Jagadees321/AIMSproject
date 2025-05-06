const express = require('express');
const connectDB = require('./dbconnection/db');
const userRoute = require('./router/authroute');
const cors = require('cors');
const productRoute = require('./router/productroute');



// Connect to MongoDB
connectDB();
const app = express();
const port = 4001;
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
   res.status(200).json("Welcome to the backend server");
})

app.get('/api/allproducts', (req, res) => {
    const products = [
        { name: "Laptop", price: 1200 },
        { name: "Smartphone", price: 800 }
      ];
    res.status(200).json({ message: 'Hello from the backend!', products });
    
});

app.use('/api', userRoute);
app.use('/api', productRoute);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



