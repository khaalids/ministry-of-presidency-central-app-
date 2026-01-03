import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TEMPLATES = [
  {
    id: 'financial-summary',
    name: 'Financial Summary Report',
    category: 'financial',
    description: 'Comprehensive financial overview including budget allocation, expenditure tracking, and variance analysis',
    icon: 'DollarSign',
    sections: [
      'Executive Summary',
      'Budget Overview',
      'Expenditure Analysis',
      'Revenue Streams',
      'Variance Report',
      'Recommendations'
    ],
    estimatedTime: '4-6 hours',
    title: 'Financial Summary Report',
    requirements: `Please provide a comprehensive financial summary including:

1. Budget Allocation Overview
   - Total allocated budget
   - Department-wise distribution
   - Quarter-wise breakdown

2. Expenditure Analysis
   - Actual spending vs. budgeted amounts
   - Major expense categories
   - Cost-saving initiatives

3. Revenue Streams
   - Income sources
   - Revenue trends
   - Projections for next quarter

4. Variance Analysis
   - Budget vs. actual comparison
   - Explanation for significant variances
   - Corrective actions taken

5. Recommendations
   - Financial optimization strategies
   - Risk mitigation measures
   - Future planning considerations`
  },
  {
    id: 'operational-review',
    name: 'Operational Review Report',
    category: 'operational',
    description: 'Detailed assessment of operational efficiency, resource utilization, and process improvements',
    icon: 'Activity',
    sections: [
      'Operations Overview',
      'Performance Metrics',
      'Resource Utilization',
      'Process Efficiency',
      'Challenges & Solutions',
      'Action Plan'
    ],
    estimatedTime: '5-7 hours',
    title: 'Operational Review Report',
    requirements: `Please provide a detailed operational review covering:

1. Operations Overview
   - Key activities and initiatives
   - Departmental objectives progress
   - Major milestones achieved

2. Performance Metrics
   - KPI achievement rates
   - Service delivery statistics
   - Quality indicators

3. Resource Utilization
   - Staff deployment and productivity
   - Equipment and facility usage
   - Technology adoption rates

4. Process Efficiency
   - Workflow optimization efforts
   - Bottleneck identification
   - Time and cost savings

5. Challenges & Solutions
   - Operational challenges faced
   - Mitigation strategies implemented
   - Lessons learned

6. Action Plan
   - Short-term improvement initiatives
   - Long-term strategic goals
   - Resource requirements`
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit Report',
    category: 'compliance',
    description: 'Regulatory compliance assessment, policy adherence verification, and risk management review',
    icon: 'ShieldCheck',
    sections: [
      'Compliance Status',
      'Policy Adherence',
      'Risk Assessment',
      'Audit Findings',
      'Corrective Actions',
      'Certification'
    ],
    estimatedTime: '6-8 hours',
    title: 'Compliance Audit Report',
    requirements: `Please provide a comprehensive compliance audit including:

1. Compliance Status
   - Regulatory requirements overview
   - Current compliance level
   - Certification status

2. Policy Adherence
   - Internal policy compliance
   - Standard operating procedures
   - Documentation completeness

3. Risk Assessment
   - Identified compliance risks
   - Risk severity classification
   - Exposure analysis

4. Audit Findings
   - Areas of non-compliance
   - Policy violations
   - Documentation gaps

5. Corrective Actions
   - Remediation plans
   - Timeline for compliance
   - Responsible parties

6. Recommendations
   - Process improvements
   - Training requirements
   - Monitoring mechanisms`
  },
  {
    id: 'quarterly-performance',
    name: 'Quarterly Performance Report',
    category: 'performance',
    description: 'Comprehensive quarterly assessment of departmental achievements, challenges, and strategic progress',
    icon: 'TrendingUp',
    sections: [
      'Quarter Highlights',
      'Goal Achievement',
      'Performance Trends',
      'Comparative Analysis',
      'Strategic Initiatives',
      'Next Quarter Plan'
    ],
    estimatedTime: '5-7 hours',
    title: 'Quarterly Performance Report',
    requirements: `Please provide a quarterly performance report covering:

1. Quarter Highlights
   - Major achievements
   - Key deliverables completed
   - Notable events

2. Goal Achievement
   - Quarterly objectives status
   - Target vs. actual performance
   - Success metrics

3. Performance Trends
   - Month-over-month analysis
   - Year-over-year comparison
   - Trend indicators

4. Comparative Analysis
   - Inter-departmental benchmarking
   - Industry standards comparison
   - Best practices adoption

5. Strategic Initiatives
   - Ongoing projects status
   - Innovation efforts
   - Change management activities

6. Next Quarter Plan
   - Upcoming priorities
   - Resource allocation
   - Expected outcomes`
  },
  {
    id: 'project-status',
    name: 'Project Status Report',
    category: 'project',
    description: 'Detailed project progress tracking, milestone achievement, and resource management overview',
    icon: 'FolderKanban',
    sections: [
      'Project Overview',
      'Milestone Status',
      'Budget & Resources',
      'Risk Management',
      'Stakeholder Updates',
      'Next Steps'
    ],
    estimatedTime: '3-5 hours',
    title: 'Project Status Report',
    requirements: `Please provide a project status report including:

1. Project Overview
   - Project objectives
   - Current phase
   - Overall progress percentage

2. Milestone Status
   - Completed milestones
   - Upcoming milestones
   - Delayed deliverables

3. Budget & Resources
   - Budget utilization
   - Resource allocation
   - Cost variance analysis

4. Risk Management
   - Identified risks
   - Mitigation strategies
   - Issue resolution status

5. Stakeholder Updates
   - Key decisions made
   - Change requests
   - Communication highlights

6. Next Steps
   - Immediate action items
   - Dependencies
   - Timeline adjustments`
  },
  {
    id: 'annual-review',
    name: 'Annual Review Report',
    category: 'strategic',
    description: 'Comprehensive yearly assessment of departmental performance, strategic achievements, and future planning',
    icon: 'Calendar',
    sections: [
      'Year in Review',
      'Strategic Goals',
      'Financial Performance',
      'Operational Excellence',
      'Innovation & Growth',
      'Future Outlook'
    ],
    estimatedTime: '8-10 hours',
    title: 'Annual Review Report',
    requirements: `Please provide an annual review report covering:

1. Year in Review
   - Major accomplishments
   - Significant challenges
   - Organizational changes

2. Strategic Goals
   - Annual objectives achievement
   - Long-term vision progress
   - Strategic alignment

3. Financial Performance
   - Annual budget performance
   - Cost optimization results
   - Investment outcomes

4. Operational Excellence
   - Process improvements
   - Efficiency gains
   - Quality enhancements

5. Innovation & Growth
   - New initiatives launched
   - Technology adoption
   - Capability development

6. Future Outlook
   - Next year priorities
   - Strategic initiatives
   - Resource planning`
  }
];

const TemplateLibrary = ({ onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Templates', icon: 'LayoutGrid' },
    { id: 'financial', label: 'Financial', icon: 'DollarSign' },
    { id: 'operational', label: 'Operational', icon: 'Activity' },
    { id: 'compliance', label: 'Compliance', icon: 'ShieldCheck' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'project', label: 'Project', icon: 'FolderKanban' },
    { id: 'strategic', label: 'Strategic', icon: 'Target' }
  ];

  const filteredTemplates = TEMPLATES?.filter(template => {
    if (selectedCategory !== 'all' && template?.category !== selectedCategory) return false;
    if (searchQuery && !template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())) return false;
    return true;
  });

  const handleSelectTemplate = (template) => {
    onSelect({
      name: template?.name,
      title: template?.title,
      description: template?.requirements
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Template Library</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a pre-configured report template to streamline your request
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={24} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-64 border-r border-border bg-muted/10 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categories?.map(category => (
                <button
                  key={category?.id}
                  onClick={() => setSelectedCategory(category?.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                    selectedCategory === category?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <Icon name={category?.icon} size={18} />
                  <span className="text-sm font-medium">{category?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {previewTemplate ? (
              /* Template Preview */
              (<div className="max-w-4xl mx-auto">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="flex items-center gap-2 text-primary hover:underline mb-6"
                >
                  <Icon name="ArrowLeft" size={18} />
                  <span>Back to templates</span>
                </button>
                <div className="bg-background border border-border rounded-lg p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon name={previewTemplate?.icon} size={32} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                          {previewTemplate?.name}
                        </h3>
                        <p className="text-muted-foreground">{previewTemplate?.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {previewTemplate?.estimatedTime}
                          </span>
                          <span className="text-sm text-muted-foreground capitalize">
                            {previewTemplate?.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSelectTemplate(previewTemplate)}
                      iconName="Check"
                      iconPosition="left"
                    >
                      Use Template
                    </Button>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4">Report Sections</h4>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {previewTemplate?.sections?.map((section, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                          <Icon name="CheckCircle2" size={16} className="text-success" />
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-semibold text-foreground mb-4">Requirements</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                        {previewTemplate?.requirements}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>)
            ) : (
              /* Templates Grid */
              (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTemplates?.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No templates found</p>
                  </div>
                ) : (
                  filteredTemplates?.map(template => (
                    <div
                      key={template?.id}
                      className="bg-background border border-border rounded-lg p-6 hover:border-primary transition-smooth cursor-pointer"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon name={template?.icon} size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {template?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template?.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {template?.estimatedTime}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {template?.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleSelectTemplate(template);
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;