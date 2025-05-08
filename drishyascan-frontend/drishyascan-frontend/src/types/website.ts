export interface Website {
  id: string;
  projectId: string;
  url: string;
  lastScan?: {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime: string;
    endTime?: string;
  };
  status: 'active' | 'inactive';
  accessibilityScore: number;
  createdAt: string;
  updatedAt: string;
} 