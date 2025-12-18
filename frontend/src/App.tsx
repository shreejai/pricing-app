import { useEffect, useMemo, useState } from 'react';
import { fetchProducts, previewPricing } from './lib/api';
import { PricingControls } from './components/PricingControls';
import { formatCurrency } from './lib/utils';

type Product = {
  id: number;
  title: string;
  sku: string;
  brand: string;
  category: string;
  segment: string;
  price: number;
};

type PreviewRow = Product & {
  newPrice: number;
};

type SelectionType = 'one' | 'multiple' | 'all';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectionType, setSelectionType] = useState<SelectionType>('multiple');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [search, setSearch] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const segments = new Set<string>();
    const brands = new Set<string>();

    products.forEach((p) => {
      if (p.category) categories.add(p.category);
      if (p.segment) segments.add(p.segment);
      if (p.brand) brands.add(p.brand);
    });

    return {
      categories: Array.from(categories).sort(),
      segments: Array.from(segments).sort(),
      brands: Array.from(brands).sort(),
    };
  }, [products]);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter;
      const matchesSegment =
        segmentFilter === 'all' || p.segment === segmentFilter;
      const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;

      return matchesSearch && matchesCategory && matchesSegment && matchesBrand;
    });
  }, [products, search, categoryFilter, segmentFilter, brandFilter]);

  useEffect(() => {
    // Clear any selected ids that no longer exist in the current products list
    const ids = new Set(products.map((p) => p.id));
    setSelectedIds((current) => current.filter((id) => ids.has(id)));
  }, [products]);

  const effectiveSelectedIds = useMemo(() => {
    if (selectionType === 'all') {
      return products.map((p) => p.id);
    }
    return selectedIds;
  }, [selectionType, products, selectedIds]);

  const toggleProductSelection = (id: number) => {
    setSelectedIds((current) => {
      if (selectionType === 'one') {
        return current.includes(id) ? [] : [id];
      }

      if (current.includes(id)) {
        return current.filter((x) => x !== id);
      }
      return [...current, id];
    });
  };

  const handleSelectAll = () => {
    if (effectiveSelectedIds.length === visibleProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleProducts.map((p) => p.id));
    }
  };

  const handleApplyPricing = async (params: {
    adjustmentType: 'fixed' | 'dynamic';
    increment: 'increase' | 'decrease';
    value: number;
  }) => {
    const productIds =
      selectionType === 'all'
        ? products.map((p) => p.id)
        : selectedIds.length
        ? selectedIds
        : [];

    if (!productIds.length) {
      setPreviewRows([]);
      return;
    }

    setIsPreviewLoading(true);
    try {
      const result = await previewPricing({
        productIds,
        adjustmentType: params.adjustmentType,
        increment: params.increment,
        value: params.value,
      });
      setPreviewRows(result);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const totals = useMemo(() => {
    if (!previewRows.length) {
      return { oldTotal: 0, newTotal: 0, diff: 0, diffPercent: 0 };
    }

    const oldTotal = previewRows.reduce((sum, row) => sum + row.price, 0);
    const newTotal = previewRows.reduce((sum, row) => sum + row.newPrice, 0);
    const diff = newTotal - oldTotal;
    const diffPercent = oldTotal ? (diff / oldTotal) * 100 : 0;

    return { oldTotal, newTotal, diff, diffPercent };
  }, [previewRows]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Pricing Profile Management</h1>
          <p className="text-sm text-slate-600">
            Create custom pricing profiles for your products with flexible
            adjustment options.
          </p>
        </header>

        <section className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Product selection and results */}
          <div className="flex-1 space-y-6">
            <div className="rounded-xl bg-white border shadow-sm p-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-medium">1. Select Products</h2>
                <p className="text-xs text-slate-500">
                  Choose which products you want to apply pricing changes to.
                </p>
              </div>

              {/* Product selection type */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700">
                  Product Selection Type
                </p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selection-type"
                      value="one"
                      checked={selectionType === 'one'}
                      onChange={() => setSelectionType('one')}
                    />
                    <span>One Product</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selection-type"
                      value="multiple"
                      checked={selectionType === 'multiple'}
                      onChange={() => setSelectionType('multiple')}
                    />
                    <span>Multiple Products</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selection-type"
                      value="all"
                      checked={selectionType === 'all'}
                      onChange={() => setSelectionType('all')}
                    />
                    <span>All Products</span>
                  </label>
                </div>
              </div>

              {/* Search and filters */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by product name or SKU..."
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                />

                <div className="flex flex-wrap gap-3 text-xs">
                  <select
                    className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-700 bg-white"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    <option value="all">All Sub-Categories</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-700 bg-white"
                    value={segmentFilter}
                    onChange={(event) => setSegmentFilter(event.target.value)}
                  >
                    <option value="all">All Segments</option>
                    {filterOptions.segments.map((segment) => (
                      <option key={segment} value={segment}>
                        {segment}
                      </option>
                    ))}
                  </select>
                  <select
                    className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-700 bg-white"
                    value={brandFilter}
                    onChange={(event) => setBrandFilter(event.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {filterOptions.brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Products ({visibleProducts.length}
                    {isLoading ? ' loading...' : ' found'})
                  </span>
                  <button
                    type="button"
                    className="text-slate-800 underline underline-offset-4"
                    onClick={handleSelectAll}
                    disabled={!visibleProducts.length}
                  >
                    Select All
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-[11px] text-slate-500">
                        <th className="w-10 px-3 py-2 font-medium">Select</th>
                        <th className="px-3 py-2 font-medium">Product</th>
                        <th className="px-3 py-2 font-medium">SKU</th>
                        <th className="px-3 py-2 font-medium">Brand</th>
                        <th className="px-3 py-2 font-medium text-right">
                          Price (AUD)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProducts.map((p) => {
                        const checked = effectiveSelectedIds.includes(p.id);
                        return (
                          <tr
                            key={p.id}
                            className="border-b border-slate-100 last:border-0 text-[11px] text-slate-700"
                          >
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleProductSelection(p.id)}
                                disabled={selectionType === 'all'}
                              />
                            </td>
                            <td className="px-3 py-2">{p.title}</td>
                            <td className="px-3 py-2 text-slate-500">
                              {p.sku}
                            </td>
                            <td className="px-3 py-2">{p.brand}</td>
                            <td className="px-3 py-2 text-right">
                              {formatCurrency(p.price)}
                            </td>
                          </tr>
                        );
                      })}

                      {!visibleProducts.length && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-6 text-center text-xs text-slate-500"
                          >
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Calculated prices */}
            <div className="rounded-xl bg-white border shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-medium">Calculated Prices</h2>

              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 font-medium">SKU</th>
                      <th className="px-3 py-2 font-medium text-right">
                        Based On Price
                      </th>
                      <th className="px-3 py-2 font-medium text-right">
                        New Price
                      </th>
                      <th className="px-3 py-2 font-medium text-right">
                        Difference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => {
                      const diff = row.newPrice - row.price;
                      const isIncrease = diff > 0;
                      const isDecrease = diff < 0;
                      const diffClass = isIncrease
                        ? 'text-emerald-600'
                        : isDecrease
                        ? 'text-red-600'
                        : 'text-slate-700';

                      return (
                        <tr
                          key={row.id}
                          className="border-b border-slate-100 last:border-0 text-[11px] text-slate-700"
                        >
                          <td className="px-3 py-2">{row.title}</td>
                          <td className="px-3 py-2 text-slate-500">
                            {row.sku}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCurrency(row.price)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCurrency(row.newPrice)}
                          </td>
                          <td className={`px-3 py-2 text-right ${diffClass}`}>
                            {diff === 0
                              ? formatCurrency(0)
                              : `${diff > 0 ? '+' : '-'}${formatCurrency(
                                  Math.abs(diff)
                                )}`}
                          </td>
                        </tr>
                      );
                    })}

                    {!!previewRows.length && (
                      <tr className="bg-slate-50 text-[11px] text-slate-800 font-medium border-t border-slate-200">
                        <td className="px-3 py-2" colSpan={2}>
                          Total
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(totals.oldTotal)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(totals.newTotal)}
                        </td>
                        <td
                          className={`px-3 py-2 text-right ${
                            totals.diff > 0
                              ? 'text-emerald-600'
                              : totals.diff < 0
                              ? 'text-red-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {totals.diff === 0
                            ? formatCurrency(0)
                            : `${totals.diff > 0 ? '+' : '-'}${formatCurrency(
                                Math.abs(totals.diff)
                              )} (${totals.diffPercent.toFixed(2)}%)`}
                        </td>
                      </tr>
                    )}

                    {!previewRows.length && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-6 text-center text-xs text-slate-500"
                        >
                          {isPreviewLoading
                            ? 'Calculating new prices...'
                            : 'Select products and recalculate prices to see the preview.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="mt-2 text-[11px] text-slate-600">
                Summary:{' '}
                <span className="font-medium">
                  {effectiveSelectedIds.length} product
                  {effectiveSelectedIds.length === 1 ? '' : 's'} selected.
                </span>{' '}
                Total price change:{' '}
                <span
                  className={
                    totals.diff > 0
                      ? 'text-emerald-600 font-medium'
                      : totals.diff < 0
                      ? 'text-red-600 font-medium'
                      : 'font-medium'
                  }
                >
                  {totals.diff === 0
                    ? formatCurrency(0)
                    : `${totals.diff > 0 ? '+' : '-'}${formatCurrency(
                        Math.abs(totals.diff)
                      )} (${totals.diffPercent.toFixed(2)}%)`}
                </span>
              </p>
            </div>
          </div>

          {/* Right: pricing controls */}
          <div className="w-full lg:w-[320px] xl:w-[360px]">
            <PricingControls
              onApply={handleApplyPricing}
              isLoading={isPreviewLoading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
