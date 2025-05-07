const express = require('express');
const connectDB = require('./dbconnection/db');
const userRoute = require('./router/authroute');
const cors = require('cors');
const productRoute = require('./router/productroute');
const cartRoute = require('./router/cartroute');
const orderRoute = require('./router/orderroute');

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
app.use('/api', cartRoute);
app.use('/api', orderRoute);
// Handle 404 errors  
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
// // Handle 500 errors    
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal server error' });
// });



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



