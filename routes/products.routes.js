const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');

router.get('/products', async (req, res) => {
  try {
  res.json(await Product.find());
  }
  catch(err) {
  res.status(500).json({ message: err });
  }
 });

 router.get('/products/random', async (req, res) => {
  try {
  const count = await Product.countDocuments();
  const random = Math.floor(Math.random() * count);
  const prod = await Product.findOne().skip(random);
  if(!prod) res.status(404).json({ message: 'Not found' });
  else res.json(prod);
  }
  catch(err) {
  res.status(500).json({ message: err });
  }
 });

 router.get('/products/:id', async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if(!product) res.status(404).json({ message: 'Not found' }) 
    else res.json(await product);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/products', async (req, res) => {
  try {
  const { name, client } = req.body;
  const newProduct = new Product({ name: name }, {client: client});
  await newProduct.save();
  res.json({ message: 'OK' });
  } catch(err) {
  res.status(500).json({ message: err });
  }
 });

 router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;

  try {
  const prod = await Product.findById(req.params.id);
  if(prod) {
  const updatedProd = await Product.updateOne({_id: req.params.id}, {$set: {name: name, client: client}}, { new: true })
  res.json(updatedProd);
    } else {
      res.status(404).json({ message: 'Not found...' })
    }
  } 
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) res.status(404).json({ message: 'Not found' }) 
    else {
      await Product.deleteOne({_id: req.params.id})
      res.json(product);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});
module.exports = router;
