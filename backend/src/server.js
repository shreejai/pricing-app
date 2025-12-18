const express = require('express');
const cors = require('cors');


const productRoutes = require('./routes/products');
const pricingRoutes = require('./routes/pricing');


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/pricing', pricingRoutes);


app.listen(4000, () => {
console.log('Backend running on http://localhost:4000');
});