import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CategoryChart = ({ data, onCategoryClick }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const total = data?.reduce((sum, item) => sum + item?.count, 0);
  
  const colors = [
    'var(--color-primary)',
    'var(--color-accent)',
    'var(--color-secondary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)'
  ];

  const calculatePercentage = (count) => {
    return ((count / total) * 100)?.toFixed(1);
  };

  let currentAngle = 0;
  const segments = data?.map((item, index) => {
    const percentage = (item?.count / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const endX = 50 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
    const endY = 50 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`,
      color: colors?.[index % colors?.length],
      percentage: percentage?.toFixed(1)
    };
  });

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            Document Categories
          </h3>
          <p className="text-sm font-caption text-muted-foreground mt-1">
            Distribution by document type
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
            {total?.toLocaleString()}
          </p>
          <p className="text-xs font-caption text-muted-foreground">Total Documents</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-square">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {segments?.map((segment, index) => (
                <path
                  key={index}
                  d={segment?.path}
                  fill={segment?.color}
                  opacity={hoveredCategory === segment?.category ? 1 : 0.85}
                  className="cursor-pointer transition-all duration-300 hover:opacity-100"
                  onMouseEnter={() => setHoveredCategory(segment?.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => onCategoryClick?.(segment?.category)}
                />
              ))}
              <circle cx="50" cy="50" r="25" fill="var(--color-background)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="FileText" size={32} color="var(--color-primary)" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {segments?.map((segment, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer transition-smooth hover:shadow-warm-sm ${
                hoveredCategory === segment?.category ? 'bg-muted/50' : ''
              }`}
              onMouseEnter={() => setHoveredCategory(segment?.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => onCategoryClick?.(segment?.category)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: segment?.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-foreground line-clamp-1">
                    {segment?.category}
                  </p>
                  <p className="text-xs font-caption text-muted-foreground">
                    {segment?.count?.toLocaleString()} documents
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-heading font-semibold text-foreground">
                  {segment?.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;