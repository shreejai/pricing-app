export async function fetchProducts(search = '') {
  const res = await fetch(
    `http://localhost:4000/api/products?search=${search}`
  );
  return res.json();
}

export async function previewPricing(payload: any) {
  const res = await fetch('http://localhost:4000/api/pricing/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return res.json();
}
