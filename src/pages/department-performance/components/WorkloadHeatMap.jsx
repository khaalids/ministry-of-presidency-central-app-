import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const WorkloadHeatMap = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedView, setSelectedView] = useState('tasks');

  const getIntensityColor = (value) => {
    if (value >= 90) return 'bg-brown-600 text-white';
    if (value >= 75) return 'bg-brown-500 text-white';
    if (value >= 60) return 'bg-brown-400 text-white';
    if (value >= 45) return 'bg-brown-300 text-foreground';
    if (value >= 30) return 'bg-brown-200 text-foreground';
    return 'bg-brown-100 text-foreground';
  };

  const getViewData = () => {
    switch (selectedView) {
      case 'tasks':
        return data?.taskWorkload;
      case 'documents':
        return data?.documentWorkload;
      case 'users':
        return data?.userActivity;
      default:
        return data?.taskWorkload;
    }
  };

  const viewData = getViewData();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Workload Distribution Heat Map
            </h3>
            <p className="text-sm font-caption text-muted-foreground mt-1">
              Department activity across time periods
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedView('tasks')}
              className={`px-3 py-1.5 rounded-md text-sm font-caption transition-smooth ${
                selectedView === 'tasks' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setSelectedView('documents')}
              className={`px-3 py-1.5 rounded-md text-sm font-caption transition-smooth ${
                selectedView === 'documents'
                  ? 'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setSelectedView('users')}
              className={`px-3 py-1.5 rounded-md text-sm font-caption transition-smooth ${
                selectedView === 'users' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[200px_repeat(6,1fr)] gap-2 mb-2">
            <div className="font-caption text-sm font-medium text-muted-foreground" />
            {viewData?.timeLabels?.map((label, index) => (
              <div key={index} className="text-center font-caption text-sm font-medium text-muted-foreground">
                {label}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {viewData?.departments?.map((dept, deptIndex) => (
              <div key={deptIndex} className="grid grid-cols-[200px_repeat(6,1fr)] gap-2">
                <div className="flex items-center font-body text-sm font-medium text-foreground">
                  {dept?.name}
                </div>
                {dept?.values?.map((value, valueIndex) => (
                  <div
                    key={valueIndex}
                    className={`relative h-16 rounded-md flex items-center justify-center font-caption text-sm font-semibold cursor-pointer transition-smooth hover:scale-105 ${getIntensityColor(value)}`}
                    onMouseEnter={() => setHoveredCell({ dept: dept?.name, time: viewData?.timeLabels?.[valueIndex], value })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {value}%
                    
                    {hoveredCell?.dept === dept?.name && hoveredCell?.time === viewData?.timeLabels?.[valueIndex] && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-popover border border-border rounded-lg shadow-warm-lg p-3 min-w-[200px]">
                        <p className="font-caption font-medium text-foreground mb-2">
                          {dept?.name}
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="font-caption text-muted-foreground">Period:</span>
                            <span className="font-body font-medium text-foreground">{viewData?.timeLabels?.[valueIndex]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-caption text-muted-foreground">Workload:</span>
                            <span className="font-body font-medium text-foreground">{value}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-caption text-muted-foreground">Status:</span>
                            <span className={`font-body font-medium ${value >= 75 ? 'text-success' : value >= 50 ? 'text-warning' : 'text-error'}`}>
                              {value >= 75 ? 'High' : value >= 50 ? 'Medium' : 'Low'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="text-sm font-caption text-muted-foreground">Intensity:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-brown-100 rounded" />
                <span className="text-xs font-caption text-muted-foreground">Low</span>
                <div className="w-8 h-4 bg-brown-300 rounded" />
                <div className="w-8 h-4 bg-brown-400 rounded" />
                <div className="w-8 h-4 bg-brown-500 rounded" />
                <div className="w-8 h-4 bg-brown-600 rounded" />
                <span className="text-xs font-caption text-muted-foreground">High</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="MousePointer2" size={16} className="text-muted-foreground" />
              <span className="text-xs font-caption text-muted-foreground">
                Hover for detailed statistics
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkloadHeatMap;