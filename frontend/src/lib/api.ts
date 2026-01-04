// Get API URL from environment variable, fallback to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchProducts(search = '') {
  const res = await fetch(`${API_BASE_URL}/api/products?search=${search}`);
  return res.json();
}

export async function previewPricing(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/pricing/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return res.json();
}
