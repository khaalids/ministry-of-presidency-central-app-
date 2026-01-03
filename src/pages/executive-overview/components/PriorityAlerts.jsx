import React from 'react';
import Icon from '../../../components/AppIcon';

const PriorityAlerts = ({ alerts }) => {
  const getAlertIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return { name: 'AlertCircle', color: 'var(--color-error)' };
      case 'high':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      default:
        return { name: 'Info', color: 'var(--color-accent)' };
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-error/10 text-error',
      high: 'bg-warning/10 text-warning',
      medium: 'bg-accent/10 text-accent-foreground'
    };
    return styles?.[priority] || styles?.medium;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Priority Alerts
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            {alerts?.length} items requiring attention
          </p>
        </div>
        <Icon name="Bell" size={24} color="var(--color-primary)" strokeWidth={2} />
      </div>
      <div className="space-y-3 md:space-y-4">
        {alerts?.map((alert) => {
          const iconConfig = getAlertIcon(alert?.priority);
          return (
            <div 
              key={alert?.id}
              className="p-3 md:p-4 bg-background rounded-lg border border-border hover:shadow-warm-sm transition-smooth"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon 
                    name={iconConfig?.name} 
                    size={20} 
                    color={iconConfig?.color} 
                    strokeWidth={2} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-body font-medium text-foreground text-sm md:text-base">
                      {alert?.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-caption font-medium whitespace-nowrap ${getPriorityBadge(alert?.priority)}`}>
                      {alert?.priority?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body mb-2">
                    {alert?.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
                    <span>{alert?.department}</span>
                    <span>{alert?.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-4 py-2.5 text-sm font-body font-medium text-primary hover:text-primary/80 transition-smooth">
        View All Alerts
      </button>
    </div>
  );
};

export default PriorityAlerts;