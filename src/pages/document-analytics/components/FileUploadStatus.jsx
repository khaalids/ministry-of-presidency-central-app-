import React from 'react';
import Icon from '../../../components/AppIcon';

const FileUploadStatus = ({ uploads }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle2';
      case 'processing':
        return 'Loader2';
      case 'failed':
        return 'AlertCircle';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024)?.toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024))?.toFixed(1)} MB`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            File Upload Status
          </h3>
          <p className="text-sm font-caption text-muted-foreground mt-1">
            Real-time processing tracking
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted transition-smooth">
          <Icon name="RefreshCw" size={18} strokeWidth={2} />
        </button>
      </div>
      <div className="space-y-3">
        {uploads?.map((upload) => {
          const statusColor = getStatusColor(upload?.status);
          const statusIcon = getStatusIcon(upload?.status);
          
          return (
            <div key={upload?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${statusColor}/10`}>
                  <Icon
                    name={statusIcon}
                    size={20}
                    color={`var(--color-${statusColor})`}
                    strokeWidth={2}
                    className={upload?.status === 'processing' ? 'animate-spin' : ''}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-body font-medium text-foreground line-clamp-1">
                      {upload?.fileName}
                    </p>
                    <span className={`px-2 py-1 rounded text-xs font-caption font-medium whitespace-nowrap bg-${statusColor}/10 text-${statusColor}`}>
                      {upload?.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-caption text-muted-foreground mb-2">
                    <span>{formatFileSize(upload?.fileSize)}</span>
                    <span>•</span>
                    <span>{upload?.uploadedBy}</span>
                    <span>•</span>
                    <span>{upload?.timestamp}</span>
                  </div>

                  {upload?.status === 'processing' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-caption">
                        <span className="text-muted-foreground">Processing...</span>
                        <span className="text-foreground font-medium">{upload?.progress}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-warning transition-all duration-300"
                          style={{ width: `${upload?.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {upload?.status === 'failed' && upload?.error && (
                    <div className="mt-2 p-2 bg-error/10 rounded text-xs font-caption text-error">
                      <Icon name="AlertCircle" size={12} strokeWidth={2} className="inline mr-1" />
                      {upload?.error}
                    </div>
                  )}

                  {upload?.status === 'completed' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="text-xs font-caption text-primary hover:text-primary/80 transition-smooth">
                        View Document
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button className="text-xs font-caption text-primary hover:text-primary/80 transition-smooth">
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileUploadStatus;