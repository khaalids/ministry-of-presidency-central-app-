import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const StorageAnalyticsPanel = ({ storageData, uploadQueue }) => {
  const COLORS = [
    'var(--color-primary)',
    'var(--color-accent)',
    'var(--color-secondary)',
    'var(--color-success)',
    'var(--color-warning)'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="font-caption font-medium text-foreground mb-1">{payload?.[0]?.name}</p>
          <p className="text-sm font-body text-muted-foreground">
            {payload?.[0]?.value?.toFixed(2)} GB ({payload?.[0]?.payload?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const totalStorage = storageData?.reduce((sum, item) => sum + item?.value, 0);
  const usedPercentage = ((totalStorage / 1000) * 100)?.toFixed(1);

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          File Storage Analytics
        </h3>
        <p className="text-sm font-caption text-muted-foreground">
          Storage utilization and upload processing status
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-caption text-muted-foreground">Storage Used</span>
              <span className="text-sm font-caption font-medium text-foreground">
                {totalStorage?.toFixed(2)} GB / 1000 GB
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-smooth"
                style={{ width: `${usedPercentage}%` }}
              />
            </div>
            <p className="text-xs font-caption text-muted-foreground mt-1">
              {usedPercentage}% capacity utilized
            </p>
          </div>

          <div className="w-full h-64" aria-label="Storage Distribution Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="var(--color-primary)"
                  dataKey="value"
                >
                  {storageData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-body font-semibold text-foreground mb-4">Upload Processing Queue</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {uploadQueue?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="Upload" size={32} className="text-muted-foreground" />
                </div>
                <p className="text-foreground font-body font-medium mb-1">No pending uploads</p>
                <p className="text-sm text-muted-foreground font-caption">
                  All files processed successfully
                </p>
              </div>
            ) : (
              uploadQueue?.map((item) => (
                <div key={item?.id} className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon name="FileText" size={16} className="text-primary flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm font-body font-medium text-foreground truncate">
                        {item?.filename}
                      </span>
                    </div>
                    <span className={`
                      text-xs font-caption px-2 py-0.5 rounded whitespace-nowrap
                      ${item?.status === 'processing' ? 'bg-accent/20 text-accent-foreground' : ''}
                      ${item?.status === 'queued' ? 'bg-muted text-muted-foreground' : ''}
                      ${item?.status === 'completed' ? 'bg-success/20 text-success' : ''}
                    `}>
                      {item?.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-caption text-muted-foreground mb-2">
                    <span>{item?.size}</span>
                    <span>{item?.department}</span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-smooth"
                      style={{ width: `${item?.progress}%` }}
                    />
                  </div>
                  <p className="text-xs font-caption text-muted-foreground mt-1">
                    {item?.progress}% complete
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageAnalyticsPanel;