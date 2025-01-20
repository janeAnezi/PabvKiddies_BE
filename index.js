const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const MemberModel = require('./models/member')
const Product = require('./models/product');
const path = require('path');
const products = require('./product');

require('dotenv').config();

const uri = process.env.MONGO_URI;


const app = express()

app.use(express.json()) 
app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'public/images')));
mongoose.connect(uri) 

const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('Connected to database')
})

app.post('/api/products', async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (deletedProduct) {
        res.status(200).json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await MemberModel.findOne({ email });
    if (user) {
        if (user.password === password) {
            res.status(200).json('Success');
        } else {
            res.status(401).json('Incorrect password');
        }
    } else {
        res.status(404).json('User not found');
    }
});


app.post("/register", async (req, res) => {
    try {
        //console.log(req.body);
        const member = await MemberModel.create(req.body);
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



app.listen(3001, () => {
    console.log('Server is running on port')
})