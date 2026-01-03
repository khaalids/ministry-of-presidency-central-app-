import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemMetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  trendValue, 
  status,
  description 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-error/10 border-error/30 text-error';
      case 'warning':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'success':
        return 'bg-success/10 border-success/30 text-success';
      default:
        return 'bg-accent/10 border-accent/30 text-accent-foreground';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (status === 'critical' || status === 'warning') {
      return trend === 'up' ? 'text-error' : 'text-success';
    }
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div className={`rounded-lg border-2 p-4 md:p-6 transition-smooth hover:shadow-warm-md ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-background/50 flex items-center justify-center">
            <Icon name={icon} size={20} strokeWidth={2} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-caption text-foreground/70 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground">
                {value}
              </span>
              {unit && (
                <span className="text-sm md:text-base font-caption text-foreground/60">{unit}</span>
              )}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md bg-background/50 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={14} strokeWidth={2} />
            <span className="text-xs font-caption font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs md:text-sm font-body text-foreground/60 line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default SystemMetricCard;