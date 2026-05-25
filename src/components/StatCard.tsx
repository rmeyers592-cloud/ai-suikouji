import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  gradientFrom?: string;
}

export function StatCard({ label, count, icon: Icon, color, bg, gradientFrom }: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: '76px',
        padding: '8px 10px',
        borderRadius: '20px',
        background: gradientFrom
          ? `linear-gradient(145deg, ${gradientFrom} 0%, rgba(255,255,255,0.95) 100%)`
          : `linear-gradient(145deg, ${bg} 0%, rgba(255,255,255,0.95) 100%)`,
        border: '1px solid rgba(120,130,180,0.10)',
        boxShadow: '0 4px 16px rgba(36, 45, 100, 0.05)',
      }}
    >
      {/* Watermark icon - bottom right, very faint */}
      <div
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          right: '-4px',
          bottom: '-4px',
          width: '52px',
          height: '52px',
          opacity: 0.07,
        }}
      >
        <Icon size={40} style={{ color }} />
      </div>

      {/* Label */}
      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', position: 'relative', zIndex: 1 }}>
        {label}
      </span>

      {/* Number + Icon */}
      <div className="flex items-end justify-between w-full" style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1, color, letterSpacing: '-1px' }}>
          {count}
        </span>
        <div
          className="flex items-center justify-center"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: `${bg}`,
          }}
        >
          <Icon size={14} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
