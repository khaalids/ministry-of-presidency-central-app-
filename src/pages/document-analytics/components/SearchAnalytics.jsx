import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchAnalytics = ({ searchData, retrievalPatterns }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-card rounded-lg border border-border p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Search" size={20} color="var(--color-primary)" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Popular Search Terms
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Most searched keywords this month
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {searchData?.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-lg font-heading font-semibold text-primary">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-body font-medium text-foreground line-clamp-1">
                    {item?.term}
                  </p>
                  <span className="text-sm font-caption text-muted-foreground whitespace-nowrap">
                    {item?.count?.toLocaleString()} searches
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                    style={{ width: `${(item?.count / searchData?.[0]?.count) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="var(--color-accent)" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Retrieval Patterns
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Document access trends
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {retrievalPatterns?.map((pattern, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-sm font-body font-medium text-foreground mb-1">
                    {pattern?.pattern}
                  </p>
                  <p className="text-xs font-caption text-muted-foreground">
                    {pattern?.description}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-caption font-medium whitespace-nowrap ${
                  pattern?.trend === 'up' ? 'bg-success/10 text-success' :
                  pattern?.trend === 'down'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon
                    name={pattern?.trend === 'up' ? 'ArrowUp' : pattern?.trend === 'down' ? 'ArrowDown' : 'Minus'}
                    size={12}
                    strokeWidth={2}
                    className="inline mr-1"
                  />
                  {pattern?.change}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-caption text-muted-foreground">
                <span>{pattern?.frequency}</span>
                <span>•</span>
                <span>{pattern?.avgTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;