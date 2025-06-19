import type { Badge } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react'; // Import all icons
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badge: Badge;
}

export function BadgeDisplay({ badge }: BadgeDisplayProps) {
  const IconComponent = LucideIcons[badge.iconName] as LucideIcons.LucideIcon;

  return (
    <Card className={cn(
      "text-center transition-all duration-300 rounded-lg shadow-md",
      badge.achievedAt ? "bg-accent/20 border-accent" : "bg-card opacity-60 hover:opacity-100"
    )}>
      <CardContent className="p-4 flex flex-col items-center gap-2">
        {IconComponent && <IconComponent 
          size={48} 
          className={cn(badge.achievedAt ? "text-accent" : "text-muted-foreground")} 
        />}
        <h3 className={cn(
          "font-semibold", "text-foreground"
        )}>{badge.name}</h3>
        <p className={cn(
          "text-xs", "text-muted-foreground"
        )}>{badge.description}</p>
        {badge.achievedAt && (
          <p className="text-xs text-muted-foreground/70 italic">
            Achieved: {new Date(badge.achievedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
