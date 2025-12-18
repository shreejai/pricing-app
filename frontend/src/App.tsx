import { useEffect, useState } from 'react';
import { fetchProducts, previewPricing } from './lib/api';
import { PricingControls } from './components/PricingControls';

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handlePreview = async (type: string, inc: string, value: number) => {
    const result = await previewPricing({
      productIds: selected,
      adjustmentType: type,
      increment: inc,
      value,
    });

    console.log(result);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pricing</h1>

      {products.map((p) => (
        <div key={p.id}>
          <input
            type="checkbox"
            onChange={() => setSelected([...selected, p.id])}
          />
          {p.title} – ${p.price}
        </div>
      ))}

      <PricingControls onPreview={handlePreview} />
    </div>
  );
}

export default App;
