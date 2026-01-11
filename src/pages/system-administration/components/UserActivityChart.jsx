import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserActivityChart = ({ data, selectedMetrics, onMetricToggle }) => {
  const metrics = [
    { key: 'logins', label: 'User Logins', color: '#2563eb' },
    { key: 'documentUploads', label: 'Document Uploads', color: '#10b981' },
    { key: 'taskCompletions', label: 'Task Completions', color: '#f59e0b' },
    { key: 'apiCalls', label: 'API Calls', color: '#8b5cf6' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="font-caption font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="font-body text-muted-foreground">{entry?.name}:</span>
              <span className="font-body font-medium text-foreground">{entry?.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            User Activity Patterns
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Real-time monitoring of platform usage metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics?.map((metric) => (
            <button
              key={metric?.key}
              onClick={() => onMetricToggle(metric?.key)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-caption transition-smooth
                ${selectedMetrics?.includes(metric?.key)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: metric?.color }}
              />
              {metric?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-64 md:h-80 lg:h-96" aria-label="User Activity Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}
            />
            {selectedMetrics?.includes('logins') && (
              <Line 
                type="monotone" 
                dataKey="logins" 
                stroke={metrics?.[0]?.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="User Logins"
              />
            )}
            {selectedMetrics?.includes('documentUploads') && (
              <Line 
                type="monotone" 
                dataKey="documentUploads" 
                stroke={metrics?.[1]?.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Document Uploads"
              />
            )}
            {selectedMetrics?.includes('taskCompletions') && (
              <Line 
                type="monotone" 
                dataKey="taskCompletions" 
                stroke={metrics?.[2]?.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Task Completions"
              />
            )}
            {selectedMetrics?.includes('apiCalls') && (
              <Line 
                type="monotone" 
                dataKey="apiCalls" 
                stroke={metrics?.[3]?.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="API Calls"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;