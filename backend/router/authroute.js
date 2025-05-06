const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');


router.post('/register', async(req, res) => {
    try {
        console.log('reading data',req.body);
        const { username, email, password } = req.body;
        // Check if user already exists

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = await new User({
            username,
            email,
            password: bcrypt.hashSync(password, 10), // Hash the password
        });
        newUser.save();
        return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
})

router.post('/login',async(req,res)=>{
    try {
        //reading data which is coming from frontend
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }   

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
})

module.exports = router;