import React from 'react';
import Icon from '../../../components/AppIcon';

const WorkflowFunnel = ({ stages }) => {
  const maxValue = Math.max(...stages?.map(s => s?.count));

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Document Workflow Pipeline
        </h3>
        <p className="text-sm md:text-base font-caption text-muted-foreground">
          Current approval stages and bottleneck identification
        </p>
      </div>
      <div className="space-y-3 md:space-y-4">
        {stages?.map((stage, index) => {
          const widthPercentage = (stage?.count / maxValue) * 100;
          const isBottleneck = stage?.bottleneck;

          return (
            <div key={stage?.id} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-body font-medium text-foreground">
                    {stage?.name}
                  </span>
                  {isBottleneck && (
                    <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-caption font-medium rounded">
                      Bottleneck
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-heading font-semibold text-foreground">
                    {stage?.count}
                  </span>
                  <span className="text-xs md:text-sm font-caption text-muted-foreground">
                    documents
                  </span>
                </div>
              </div>
              <div className="relative h-10 md:h-12 bg-muted rounded-lg overflow-hidden">
                <div 
                  className={`h-full rounded-lg transition-all duration-500 flex items-center justify-between px-3 md:px-4 ${
                    isBottleneck ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  <span className="text-xs md:text-sm font-caption font-medium text-white">
                    {stage?.percentage}%
                  </span>
                  <span className="text-xs font-caption text-white/80">
                    Avg: {stage?.avgTime}
                  </span>
                </div>
              </div>
              {index < stages?.length - 1 && (
                <div className="flex justify-center my-2">
                  <Icon name="ChevronDown" size={20} color="var(--color-muted-foreground)" strokeWidth={2} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-3 md:p-4 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} color="var(--color-accent)" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm md:text-base font-body font-medium text-foreground mb-1">
              Optimization Insight
            </h4>
            <p className="text-xs md:text-sm font-caption text-muted-foreground">
              The Review & Approval stage shows 35% longer processing time than average. Consider allocating additional reviewers to reduce bottleneck.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowFunnel;