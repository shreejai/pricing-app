import { useState } from 'react';
import { Button } from './ui/button';

type Props = {
  onApply: (params: {
    adjustmentType: 'fixed' | 'dynamic';
    increment: 'increase' | 'decrease';
    value: number;
  }) => void;
  isLoading?: boolean;
};

export function PricingControls({ onApply, isLoading }: Props) {
  const [basedOn] = useState('global-wholesale');
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'dynamic'>(
    'dynamic'
  );
  const [increment, setIncrement] = useState<'increase' | 'decrease'>(
    'decrease'
  );
  const [value, setValue] = useState('10');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return;
    }

    onApply({
      adjustmentType,
      increment,
      value: numericValue,
    });
  };

  return (
    <div className="rounded-xl bg-white border shadow-sm p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">2. Adjust Pricing</h2>
        <p className="text-xs text-slate-500">
          Configure how you want to adjust the prices for the selected products.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Based on */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">Based On</p>
          <select
            value={basedOn}
            onChange={() => {
              // In this simple demo, changing the base does not alter behaviour
            }}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800"
          >
            <option value="global-wholesale">Global Wholesale Price</option>
          </select>
          <p className="text-[11px] text-slate-500">
            The new pricing will be calculated based on the selected profile.
          </p>
        </div>

        {/* Adjustment mode */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">
            Price Adjustment Mode
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="adjustment-type"
                value="fixed"
                checked={adjustmentType === 'fixed'}
                onChange={() => setAdjustmentType('fixed')}
              />
              <span>Fixed ($)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="adjustment-type"
                value="dynamic"
                checked={adjustmentType === 'dynamic'}
                onChange={() => setAdjustmentType('dynamic')}
              />
              <span>Dynamic (%)</span>
            </label>
          </div>
        </div>

        {/* Increment */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">
            Price Adjustment Increment
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="increment"
                value="increase"
                checked={increment === 'increase'}
                onChange={() => setIncrement('increase')}
              />
              <span>Increase (+)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="increment"
                value="decrease"
                checked={increment === 'decrease'}
                onChange={() => setIncrement('decrease')}
              />
              <span>Decrease (-)</span>
            </label>
          </div>
        </div>

        {/* Value */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">Adjustment</p>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={adjustmentType === 'fixed' ? 'e.g. 10' : 'e.g. 10'}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
          />
          <p className="text-[11px] text-slate-500">
            Enter a positive number. This value will be applied as a{' '}
            {adjustmentType === 'fixed' ? 'dollar' : 'percentage'}{' '}
            {increment === 'increase' ? 'increase' : 'decrease'} to the base
            price.
          </p>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? 'Recalculating...' : 'Recalculate Prices'}
        </Button>
      </form>
    </div>
  );
}
