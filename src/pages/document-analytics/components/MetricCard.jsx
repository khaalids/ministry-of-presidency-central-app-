import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, sparklineData }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  
  const sparklinePoints = sparklineData?.map((value, index) => {
    const x = (index / (sparklineData?.length - 1)) * 100;
    const y = 100 - (value / Math.max(...sparklineData)) * 100;
    return `${x},${y}`;
  })?.join(' ');

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border hover:shadow-warm-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-caption text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
            {value}
          </h3>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={20} color="var(--color-primary)" strokeWidth={2} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-2 mb-3">
          <Icon
            name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'}
            size={16}
            color={isPositive ? 'var(--color-success)' : isNegative ? 'var(--color-error)' : 'var(--color-muted-foreground)'}
            strokeWidth={2}
          />
          <span className={`text-sm font-caption font-medium ${
            isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-muted-foreground'
          }`}>
            {change}
          </span>
          <span className="text-xs font-caption text-muted-foreground">vs last month</span>
        </div>
      )}
      {sparklineData && sparklineData?.length > 0 && (
        <div className="h-8 mt-2">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points={sparklinePoints}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MetricCard;