import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { format } from 'date-fns';

const ReportCard = ({ report, onSubmit, onReview, isLeadership }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const statusColors = {
    requested: 'bg-warning/20 text-warning-foreground',
    in_progress: 'bg-accent/20 text-accent-foreground',
    submitted: 'bg-secondary/20 text-secondary-foreground',
    reviewed: 'bg-primary/20 text-primary-foreground',
    approved: 'bg-success/20 text-success-foreground',
    rejected: 'bg-destructive/20 text-destructive-foreground'
  };

  const handleApprove = () => {
    onReview(report?.id, 'approved', reviewNotes);
    setShowReviewForm(false);
    setReviewNotes('');
  };

  const handleReject = () => {
    onReview(report?.id, 'rejected', reviewNotes);
    setShowReviewForm(false);
    setReviewNotes('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-warm-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            {report?.title}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors?.[report?.status]}`}>
            {report?.status?.replace('_', ' ')?.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-smooth"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </button>
      </div>
      {report?.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {report?.description}
        </p>
      )}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon name="Building2" size={16} />
          <span>{report?.department?.name || 'No department'}</span>
        </div>
        {report?.requestedByProfile && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="User" size={16} />
            <span>Requested by: {report?.requestedByProfile?.full_name}</span>
          </div>
        )}
        {report?.dueDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Due: {format(new Date(report?.dueDate), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-3">
            {report?.content && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Report Content</p>
                <p className="text-sm whitespace-pre-wrap">{report?.content}</p>
              </div>
            )}
            {report?.submittedByProfile && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Submitted by</p>
                <p className="text-sm font-medium">{report?.submittedByProfile?.full_name}</p>
              </div>
            )}
            {report?.submittedAt && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                <p className="text-sm">{format(new Date(report?.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            )}
            {report?.reviewerNotes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Review Notes</p>
                <p className="text-sm">{report?.reviewerNotes}</p>
              </div>
            )}
          </div>

          {!isLeadership && (report?.status === 'requested' || report?.status === 'in_progress') && (
            <div className="mt-4">
              <Button
                size="sm"
                onClick={onSubmit}
                iconName="Upload"
                iconPosition="left"
              >
                Submit Report
              </Button>
            </div>
          )}

          {isLeadership && report?.status === 'submitted' && (
            <div className="mt-4">
              {!showReviewForm ? (
                <Button
                  size="sm"
                  onClick={() => setShowReviewForm(true)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  Review Report
                </Button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e?.target?.value)}
                    placeholder="Add review notes (optional)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={handleApprove}
                      iconName="CheckCircle2"
                      iconPosition="left"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleReject}
                      iconName="XCircle"
                      iconPosition="left"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewNotes('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;