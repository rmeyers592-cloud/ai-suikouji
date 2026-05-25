import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
        <Icon size={30} className="text-primary/50" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-semibold text-text mb-1.5">{title}</h3>
      <p className="text-[13px] text-text-muted leading-relaxed max-w-[240px]">{description}</p>
    </div>
  );
}
