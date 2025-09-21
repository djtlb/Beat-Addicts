import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, Crown } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  premium?: boolean;
  comingSoon?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  gradient,
  premium = false,
  comingSoon = false
}) => {
  console.log('FeatureCard rendered:', { title, premium, comingSoon });

  const CardWrapper = comingSoon ? 'div' : Link;
  const cardProps = comingSoon ? {} : { to: href };

  return (
    <CardWrapper
      {...cardProps}
      className={`
        group glass-card p-6 rounded-xl transition-all duration-300 relative overflow-hidden
        ${comingSoon 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer'
        }
      `}
    >
      {/* Premium badge */}
      {premium && (
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-1 rounded-full border border-yellow-500/30">
          <Crown className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-medium">Premium</span>
        </div>
      )}

      {/* Coming soon badge */}
      {comingSoon && (
        <div className="absolute top-3 right-3 bg-muted px-3 py-1 rounded-full">
          <span className="text-muted-foreground text-xs font-medium">Coming Soon</span>
        </div>
      )}

      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      {/* Hover effect overlay */}
      {!comingSoon && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300" />
      )}
    </CardWrapper>
  );
};

export default FeatureCard;