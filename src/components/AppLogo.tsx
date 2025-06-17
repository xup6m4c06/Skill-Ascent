import { MountainSnow } from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export function AppLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
      legacyBehavior>
      <MountainSnow className={`${iconSize} text-accent`} />
      <span className={`${textSize} font-semibold text-foreground`}>{APP_NAME}</span>
    </Link>
  );
}
