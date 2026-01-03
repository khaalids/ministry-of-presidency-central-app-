import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityLogPanel = ({ logs }) => {
  const [filter, setFilter] = useState('all');

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: 'AlertTriangle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/30'
        };
      case 'high':
        return {
          icon: 'AlertCircle',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30'
        };
      case 'medium':
        return {
          icon: 'Info',
          color: 'text-accent-foreground',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/30'
        };
      default:
        return {
          icon: 'CheckCircle2',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30'
        };
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs?.filter(log => log?.severity === filter);

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Security Event Log
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Real-time security monitoring and threat detection
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'critical', 'high', 'medium', 'low']?.map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-caption whitespace-nowrap transition-smooth flex-shrink-0
                ${filter === severity
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {severity?.charAt(0)?.toUpperCase() + severity?.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {filteredLogs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="Shield" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-foreground font-body font-medium mb-1">No security events</p>
            <p className="text-sm text-muted-foreground font-caption">
              All systems operating normally
            </p>
          </div>
        ) : (
          filteredLogs?.map((log) => {
            const config = getSeverityConfig(log?.severity);
            return (
              <div
                key={log?.id}
                className={`
                  border-l-4 rounded-lg p-3 transition-smooth hover:shadow-warm-sm
                  ${config?.bgColor} ${config?.borderColor}
                `}
              >
                <div className="flex items-start gap-3">
                  <Icon 
                    name={config?.icon} 
                    size={18} 
                    className={`flex-shrink-0 mt-0.5 ${config?.color}`}
                    strokeWidth={2}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-body font-medium text-foreground text-sm">
                        {log?.event}
                      </h4>
                      <span className={`text-xs font-caption font-medium px-2 py-0.5 rounded ${config?.bgColor} ${config?.color} whitespace-nowrap`}>
                        {log?.severity?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body mb-2 line-clamp-2">
                      {log?.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-caption text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={12} strokeWidth={2} />
                        {log?.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} strokeWidth={2} />
                        {log?.source}
                      </span>
                      {log?.user && (
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={12} strokeWidth={2} />
                          {log?.user}
                        </span>
                      )}
                    </div>
                    {log?.action && (
                      <button className="mt-2 text-xs font-caption text-primary hover:text-primary/80 transition-smooth">
                        {log?.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SecurityLogPanel;