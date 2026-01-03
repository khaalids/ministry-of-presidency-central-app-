import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BackupStatusPanel = ({ backupHistory, nextScheduled }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle2', color: 'text-success' };
      case 'failed':
        return { name: 'XCircle', color: 'text-error' };
      case 'in-progress':
        return { name: 'Loader', color: 'text-accent-foreground' };
      default:
        return { name: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'failed':
        return 'bg-error/20 text-error';
      case 'in-progress':
        return 'bg-accent/20 text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Backup & Recovery Status
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Automated backup monitoring and disaster recovery metrics
          </p>
        </div>
        <Button variant="default" iconName="Download" iconPosition="left" size="sm">
          Initiate Backup
        </Button>
      </div>
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Calendar" size={24} className="text-accent-foreground" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h4 className="font-body font-semibold text-foreground mb-1">Next Scheduled Backup</h4>
            <p className="text-sm font-body text-muted-foreground mb-2">
              {nextScheduled?.date} at {nextScheduled?.time}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-caption text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Database" size={12} strokeWidth={2} />
                {nextScheduled?.type}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="HardDrive" size={12} strokeWidth={2} />
                Estimated size: {nextScheduled?.estimatedSize}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={12} strokeWidth={2} />
                Duration: ~{nextScheduled?.duration}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-body font-semibold text-foreground mb-4">Recent Backup History</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {backupHistory?.map((backup) => {
            const statusConfig = getStatusIcon(backup?.status);
            return (
              <div
                key={backup?.id}
                className="bg-muted/50 rounded-lg p-4 border border-border hover:shadow-warm-sm transition-smooth"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon 
                      name={statusConfig?.name} 
                      size={20} 
                      className={`${statusConfig?.color} flex-shrink-0`}
                      strokeWidth={2}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-body font-medium text-foreground mb-1">
                        {backup?.type} Backup
                      </h5>
                      <p className="text-sm font-caption text-muted-foreground">
                        {backup?.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-caption px-2 py-1 rounded whitespace-nowrap ${getStatusBadge(backup?.status)}`}>
                    {backup?.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-caption text-muted-foreground">
                  <div>
                    <p className="mb-1">Size</p>
                    <p className="font-medium text-foreground">{backup?.size}</p>
                  </div>
                  <div>
                    <p className="mb-1">Duration</p>
                    <p className="font-medium text-foreground">{backup?.duration}</p>
                  </div>
                  <div>
                    <p className="mb-1">Location</p>
                    <p className="font-medium text-foreground">{backup?.location}</p>
                  </div>
                  <div>
                    <p className="mb-1">Retention</p>
                    <p className="font-medium text-foreground">{backup?.retention}</p>
                  </div>
                </div>
                {backup?.status === 'failed' && backup?.error && (
                  <div className="mt-3 p-2 bg-error/10 border border-error/30 rounded text-xs font-body text-error">
                    Error: {backup?.error}
                  </div>
                )}
                {backup?.status === 'completed' && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="xs" iconName="Download" iconPosition="left">
                      Download
                    </Button>
                    <Button variant="ghost" size="xs" iconName="RotateCcw" iconPosition="left">
                      Restore
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BackupStatusPanel;