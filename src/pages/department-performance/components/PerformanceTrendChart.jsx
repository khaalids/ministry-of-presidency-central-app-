import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceTrendChart = ({ data, selectedDepartments }) => {
  const [chartType, setChartType] = useState('combined');
  const [timeRange, setTimeRange] = useState('6months');

  const departmentColors = {
    'Finance': '#2563eb',
    'Human Resources': '#10b981',
    'Operations': '#f59e0b',
    'Legal Affairs': '#8b5cf6',
    'Communications': '#ec4899',
    'Strategic Planning': '#14b8a6',
    'Information Technology': '#6366f1'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-warm-lg p-3">
          <p className="font-caption font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="font-caption text-muted-foreground">{entry?.name}:</span>
              <span className="font-body font-medium" style={{ color: entry?.color }}>
                {entry?.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Performance Trends & Resource Allocation
            </h3>
            <p className="text-sm font-caption text-muted-foreground mt-1">
              Task completion rates with resource utilization overlay
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'combined' ? 'default' : 'outline'}
              size="sm"
              iconName="BarChart3"
              onClick={() => setChartType('combined')}
            >
              Combined
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              iconName="TrendingUp"
              onClick={() => setChartType('line')}
            >
              Trends
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              iconName="BarChart2"
              onClick={() => setChartType('bar')}
            >
              Resources
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="w-full h-80 md:h-96" aria-label="Department Performance Trend Chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'combined' ? (
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
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
                {selectedDepartments?.map((dept) => (
                  <Line
                    key={dept}
                    type="monotone"
                    dataKey={dept}
                    stroke={departmentColors?.[dept]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
                <Bar dataKey="resourceAllocation" fill="#64748b" opacity={0.3} />
              </ComposedChart>
            ) : chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
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
                {selectedDepartments?.map((dept) => (
                  <Line
                    key={dept}
                    type="monotone"
                    dataKey={dept}
                    stroke={departmentColors?.[dept]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
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
                {selectedDepartments?.map((dept) => (
                  <Bar
                    key={dept}
                    dataKey={dept}
                    fill={departmentColors?.[dept]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <Icon name="Info" size={16} className="text-muted-foreground" />
            <span className="text-xs font-caption text-muted-foreground">
              Click department names in legend to toggle visibility
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Icon name="MousePointer2" size={16} className="text-muted-foreground" />
            <span className="text-xs font-caption text-muted-foreground">
              Drag to zoom timeline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;