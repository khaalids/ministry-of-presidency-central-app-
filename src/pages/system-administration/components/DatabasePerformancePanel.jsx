import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const DatabasePerformancePanel = ({ data, connectionStats }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="font-caption font-medium text-foreground mb-2">{label}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="font-body text-muted-foreground">Response Time:</span>
            <span className="font-body font-medium text-foreground">{payload?.[0]?.value}ms</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Database Performance Metrics
        </h3>
        <p className="text-sm font-caption text-muted-foreground">
          Query response times and connection statistics
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-success/10 border border-success/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={20} className="text-success" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Active Connections</p>
              <p className="text-2xl font-heading font-semibold text-foreground">
                {connectionStats?.active}
              </p>
            </div>
          </div>
          <p className="text-xs font-body text-muted-foreground">
            Pool size: {connectionStats?.poolSize}
          </p>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-accent-foreground" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-heading font-semibold text-foreground">
                {connectionStats?.avgResponse}ms
              </p>
            </div>
          </div>
          <p className="text-xs font-body text-muted-foreground">
            Last hour average
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-primary" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Queries/sec</p>
              <p className="text-2xl font-heading font-semibold text-foreground">
                {connectionStats?.queriesPerSec}
              </p>
            </div>
          </div>
          <p className="text-xs font-body text-muted-foreground">
            Current throughput
          </p>
        </div>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Database Query Response Time Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="query" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}
              label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="responseTime" 
              fill="#2563eb" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DatabasePerformancePanel;