const express = require('express');
const router = express.Router();
const products = require('../data/products');


router.get('/', (req, res) => {
const { search } = req.query;


let result = products;


if (search) {
const q = search.toLowerCase();
result = result.filter(
p => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
);
}


res.json(result);
});


module.exports = router;