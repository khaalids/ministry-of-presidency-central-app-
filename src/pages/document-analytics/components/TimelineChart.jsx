import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TimelineChart = ({ data }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'rejected':
        return 'bg-error';
      case 'in-review':
        return 'bg-accent';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return 'CheckCircle2';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      case 'in-review':
        return 'FileSearch';
      default:
        return 'File';
    }
  };

  const calculateProgress = (submittedDate, currentStage, totalStages) => {
    return (currentStage / totalStages) * 100;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Document Approval Timeline
        </h3>
        <p className="text-sm font-caption text-muted-foreground mt-1">
          Track document workflow progress and approval stages
        </p>
      </div>
      <div className="p-4 md:p-6">
        <div className="space-y-4">
          {data?.map((doc) => (
            <div
              key={doc?.id}
              className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-smooth cursor-pointer"
              onClick={() => setSelectedDocument(doc?.id === selectedDocument ? null : doc?.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getStatusColor(doc?.status)}/10`}>
                  <Icon
                    name={getStatusIcon(doc?.status)}
                    size={20}
                    color={`var(--color-${doc?.status === 'approved' ? 'success' : doc?.status === 'pending' ? 'warning' : doc?.status === 'rejected' ? 'error' : 'accent'})`}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-body font-medium text-foreground text-sm md:text-base line-clamp-1">
                      {doc?.title}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-caption font-medium whitespace-nowrap ${getStatusColor(doc?.status)} text-white`}>
                      {doc?.status}
                    </span>
                  </div>
                  <p className="text-sm font-caption text-muted-foreground mb-2">
                    {doc?.department} • Submitted {doc?.submittedDate}
                  </p>
                  
                  <div className="relative">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStatusColor(doc?.status)} transition-all duration-500`}
                        style={{ width: `${calculateProgress(doc?.submittedDate, doc?.currentStage, doc?.totalStages)}%` }}
                      />
                    </div>
                    <p className="text-xs font-caption text-muted-foreground mt-1">
                      Stage {doc?.currentStage} of {doc?.totalStages} • {doc?.daysInProgress} days
                    </p>
                  </div>
                </div>
              </div>

              {selectedDocument === doc?.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {doc?.stages?.map((stage, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        stage?.completed ? 'bg-success' : index === doc?.currentStage - 1 ? 'bg-warning' : 'bg-muted'
                      }`}>
                        {stage?.completed ? (
                          <Icon name="Check" size={14} color="white" strokeWidth={3} />
                        ) : (
                          <span className="text-xs font-caption text-white">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-body font-medium text-foreground">
                          {stage?.name}
                        </p>
                        <p className="text-xs font-caption text-muted-foreground">
                          {stage?.assignee} • {stage?.date}
                        </p>
                        {stage?.comment && (
                          <p className="text-xs font-caption text-muted-foreground mt-1 italic">
                            "{stage?.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {doc?.isDelayed && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-error/10 rounded-lg">
                  <Icon name="AlertTriangle" size={16} color="var(--color-error)" strokeWidth={2} />
                  <span className="text-sm font-caption text-error">
                    Delayed by {doc?.delayDays} days
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;