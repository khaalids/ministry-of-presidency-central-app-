import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  threshold,
  description 
}) => {
  const getThresholdColor = () => {
    if (value >= threshold?.excellent) return 'text-success bg-success/10';
    if (value >= threshold?.good) return 'text-accent bg-accent/10';
    if (value >= threshold?.warning) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 hover:shadow-warm-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getThresholdColor()}`}>
          <Icon name={icon} size={24} strokeWidth={2} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${getTrendColor()} bg-current/10`}>
          <Icon name={getTrendIcon()} size={14} strokeWidth={2} />
          <span className="text-xs font-caption font-medium">{change}%</span>
        </div>
      </div>
      
      <h3 className="text-sm font-caption text-muted-foreground mb-1">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-3xl md:text-4xl font-heading font-semibold text-foreground">
          {value}%
        </p>
      </div>
      
      {description && (
        <p className="text-xs font-caption text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default PerformanceMetricCard;