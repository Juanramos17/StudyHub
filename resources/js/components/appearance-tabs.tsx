import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();

  const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div
      className={cn(
        'grid w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm shadow-md dark:border-gray-700 dark:bg-[#0d1117] sm:grid-cols-3 sm:divide-x dark:sm:divide-gray-700',
        className
      )}
      {...props}
    >
      {tabs.map(({ value, icon: Icon, label }, index) => (
        <button
          key={value}
          onClick={() => updateAppearance(value)}
          className={cn(
            'flex w-full items-center justify-center gap-2 px-4 py-3 transition-colors sm:first:rounded-l-2xl sm:last:rounded-r-2xl',
            index !== 0 && 'border-t border-gray-200 dark:border-gray-700 sm:border-t-0',
            appearance === value
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
          )}
        >
          <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-semibold">{label}</span>
        </button>
      ))}
    </div>
  );
}
