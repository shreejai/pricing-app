function calculatePrice(basePrice, adjustmentType, increment, value) {
  let newPrice = basePrice;

  if (adjustmentType === 'fixed') {
    newPrice = increment === 'increase' ? basePrice + value : basePrice - value;
  }

  if (adjustmentType === 'dynamic') {
    const change = (value / 100) * basePrice;
    newPrice =
      increment === 'increase' ? basePrice + change : basePrice - change;
  }

  return Math.max(newPrice, 0);
}

module.exports = calculatePrice;
