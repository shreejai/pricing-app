import { Button } from './ui/button';

export function PricingControls({ onPreview }: any) {
  return (
    <div className="flex gap-4">
      <Button onClick={() => onPreview('fixed', 'decrease', 10)}>
        Decrease $10
      </Button>
      <Button onClick={() => onPreview('dynamic', 'decrease', 10)}>
        Decrease 10%
      </Button>
    </div>
  );
}
