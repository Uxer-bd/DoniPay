import { Card, CardContent } from '../components/ui/card';
import { Badge as BadgeType } from '../types';
import { Star, Award, TrendingUp, Trophy, Target } from 'lucide-react';

interface GamificationBadgeProps {
  badge: BadgeType;
}

export function GamificationBadge({ badge }: GamificationBadgeProps) {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Star: <Star className="h-8 w-8" />,
      Award: <Award className="h-8 w-8" />,
      TrendingUp: <TrendingUp className="h-8 w-8" />,
      Trophy: <Trophy className="h-8 w-8" />,
      Target: <Target className="h-8 w-8" />,
    };
    return icons[iconName] || <Star className="h-8 w-8" />;
  };

  return (
    <Card 
      className={`transition-all ${
        badge.earned 
          ? 'border-primary bg-primary/5' 
          : 'opacity-50 grayscale'
      }`}
    >
      <CardContent className="p-6 text-center">
        <div 
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
            badge.earned 
              ? 'bg-primary/20 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {getIcon(badge.icon)}
        </div>
        <h4 className="font-semibold mb-1">{badge.name}</h4>
        <p className="text-sm text-muted-foreground">{badge.description}</p>
        {badge.earned && badge.earnedDate && (
          <p className="text-xs text-primary mt-2">
            Obtenu le {new Date(badge.earnedDate).toLocaleDateString('fr-FR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
