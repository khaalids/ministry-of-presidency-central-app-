import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      label: 'Export Executive Report',
      icon: 'FileDown',
      variant: 'default'
    },
    {
      id: 2,
      label: 'Schedule Review Meeting',
      icon: 'Calendar',
      variant: 'outline'
    },
    {
      id: 3,
      label: 'View Detailed Analytics',
      icon: 'BarChart3',
      variant: 'outline'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            fullWidth
            className="justify-start"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;