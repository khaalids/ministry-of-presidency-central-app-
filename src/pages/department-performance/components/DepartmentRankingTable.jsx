import React from 'react';
import Icon from '../../../components/AppIcon';

const DepartmentRankingTable = ({ departments }) => {
  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-success text-success-foreground';
    if (rank === 2) return 'bg-accent text-accent-foreground';
    if (rank === 3) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'ArrowUp', color: 'var(--color-success)' };
    if (trend < 0) return { name: 'ArrowDown', color: 'var(--color-error)' };
    return { name: 'Minus', color: 'var(--color-muted-foreground)' };
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Department Rankings
        </h3>
        <p className="text-sm font-caption text-muted-foreground mt-1">
          Based on overall performance score
        </p>
      </div>
      <div className="divide-y divide-border">
        {departments?.map((dept) => {
          const trendIcon = getTrendIcon(dept?.trend);
          return (
            <div key={dept?.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-caption font-semibold ${getRankBadgeColor(dept?.rank)}`}>
                  {dept?.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-medium text-foreground text-sm truncate">
                    {dept?.name}
                  </h4>
                  <p className="text-xs font-caption text-muted-foreground">
                    {dept?.head}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name={trendIcon?.name} size={16} color={trendIcon?.color} strokeWidth={2} />
                  <span className="text-sm font-caption font-medium text-foreground">
                    {dept?.score}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-caption">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="text-foreground font-medium">{dept?.score}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-smooth"
                    style={{ width: `${dept?.score}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs font-caption text-muted-foreground">Tasks</p>
                  <p className="text-sm font-body font-medium text-foreground">{dept?.tasksCompleted}</p>
                </div>
                <div>
                  <p className="text-xs font-caption text-muted-foreground">Docs</p>
                  <p className="text-sm font-body font-medium text-foreground">{dept?.documentsProcessed}</p>
                </div>
                <div>
                  <p className="text-xs font-caption text-muted-foreground">Users</p>
                  <p className="text-sm font-body font-medium text-foreground">{dept?.activeUsers}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentRankingTable;