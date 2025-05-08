export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'false_positive' | 'wont_fix';
export type IssueType = 'security' | 'performance' | 'accessibility' | 'seo';

export interface Issue {
  id: string;
  scanId: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  title: string;
  description: string;
  location: string;
  element: string;
  url: string;
  codeSnippet?: string;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: string;
  websiteId: string;
  websiteUrl: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  startedAt: string; // For backward compatibility
  endTime?: string;
  completedAt?: string; // For backward compatibility
  duration?: number;
  error?: string;
  issues: Issue[];
  createdAt: string;
  updatedAt: string;
} 