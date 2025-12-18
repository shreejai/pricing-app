const express = require('express');
const router = express.Router();
const products = require('../data/products');
const calculatePrice = require('../utils/pricingCalculator');

router.post('/preview', (req, res) => {
  const { productIds, adjustmentType, increment, value } = req.body;

  const result = products
    .filter((p) => productIds.includes(p.id))
    .map((p) => ({
      ...p,
      newPrice: calculatePrice(p.price, adjustmentType, increment, value),
    }));

  res.json(result);
});

module.exports = router;
