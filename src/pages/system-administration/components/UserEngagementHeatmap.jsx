import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UserEngagementHeatmap = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getIntensityColor = (value) => {
    if (value >= 80) return 'bg-primary text-primary-foreground';
    if (value >= 60) return 'bg-primary/70 text-primary-foreground';
    if (value >= 40) return 'bg-primary/50 text-foreground';
    if (value >= 20) return 'bg-primary/30 text-foreground';
    return 'bg-primary/10 text-muted-foreground';
  };

  const timeSlots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            User Engagement Heat Map
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Activity patterns across departments and time periods
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-caption text-muted-foreground">Low</span>
          <div className="flex gap-1">
            {[10, 30, 50, 70, 90]?.map((value) => (
              <div
                key={value}
                className={`w-6 h-6 rounded ${getIntensityColor(value)}`}
              />
            ))}
          </div>
          <span className="text-xs font-caption text-muted-foreground">High</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-7 gap-2 mb-2">
            <div className="text-xs font-caption text-muted-foreground font-medium">
              Department
            </div>
            {timeSlots?.map((time) => (
              <div key={time} className="text-xs font-caption text-muted-foreground font-medium text-center">
                {time}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {data?.map((dept) => (
              <div key={dept?.id} className="grid grid-cols-7 gap-2">
                <button
                  onClick={() => setSelectedDepartment(dept?.id === selectedDepartment ? null : dept?.id)}
                  className={`
                    text-left text-sm font-body font-medium px-3 py-2 rounded-lg transition-smooth
                    ${selectedDepartment === dept?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  {dept?.name}
                </button>
                {dept?.activity?.map((value, index) => (
                  <button
                    key={index}
                    className={`
                      h-12 rounded-lg transition-smooth hover:scale-105 hover:shadow-warm-sm
                      ${getIntensityColor(value)}
                      flex items-center justify-center text-sm font-caption font-medium
                    `}
                    title={`${dept?.name} - ${timeSlots?.[index]}: ${value}% activity`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedDepartment && (
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={18} className="text-accent-foreground flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <h4 className="font-body font-medium text-foreground mb-1">
                {data?.find(d => d?.id === selectedDepartment)?.name} Details
              </h4>
              <p className="text-sm font-body text-muted-foreground">
                Peak activity: {Math.max(...(data?.find(d => d?.id === selectedDepartment)?.activity || []))}% 
                • Average engagement: {Math.round(data?.find(d => d?.id === selectedDepartment)?.activity?.reduce((a, b) => a + b, 0) / 6)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEngagementHeatmap;