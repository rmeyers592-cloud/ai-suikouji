import { CATEGORY_CONFIG, type CardCategory } from '../types';

interface CategoryBadgeProps {
  category: CardCategory;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{ color: config.colorVar, background: config.bgVar }}
    >
      {config.label}
    </span>
  );
}
