import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DepartmentPerformanceChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="font-body font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="font-caption text-muted-foreground">{entry?.name}:</span>
              <span className="font-body font-medium text-foreground">{entry?.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Department Performance Comparison
        </h3>
        <p className="text-sm md:text-base font-caption text-muted-foreground">
          Efficiency scores across all departments for Q4 2025
        </p>
      </div>
      
      <div className="w-full h-64 md:h-80 lg:h-96" aria-label="Department Performance Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="department" 
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis 
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
              label={{ 
                value: 'Efficiency Score (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'var(--color-muted-foreground)', fontSize: 12 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar 
              dataKey="efficiency" 
              fill="#2563eb" 
              name="Efficiency Score"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="completion" 
              fill="#10b981" 
              name="Task Completion"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentPerformanceChart;