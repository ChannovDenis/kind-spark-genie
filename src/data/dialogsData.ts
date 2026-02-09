// Types for Quality Dialogs Audit Queue

export interface DialogIssue {
  id: string;
  messageId: string;
  category: 'hallucination' | 'inaccuracy' | 'empathy' | 'protocol' | 'safety';
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface QualityDialog {
  id: string;
  
  // Participants
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Context
  service: 'lawyer' | 'doctor' | 'psychologist' | 'financier';
  tenantId: string;
  
  // Quality metrics
  aiScore: number;                    // 0-100
  messagesCount: number;
  duration: string;                   // "8:45"
  tokensUsed: number;
  avgResponseTime: string;            // "1.2s"
  
  // Issues
  flaggedMessagesCount: number;
  issues: DialogIssue[];
  
  // Workflow
  status: 'pending' | 'in_review' | 'reviewed' | 'escalated' | 'training';
  assignedTo?: string;
  assignedToName?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  
  // Metadata
  createdAt: string;
  endedAt: string;
  escalatedToExpert: boolean;
  
  // Risk ranking
  riskScore: number;                  // 0-100
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface DialogFilters {
  status: string[];
  services: string[];
  scoreRange: [number, number];
  dateRange: [string, string] | null;
  assignedTo: string | null;
  hasIssues: boolean | null;
  issueCategories: string[];
  priority: string[];
  search: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: DialogFilters;
  createdBy: string;
  isDefault?: boolean;
}

export interface DialogStats {
  total: number;
  pending: number;
  inReview: number;
  reviewed: number;
  escalated: number;
  
  avgAiScore: number;
  avgReviewTime: string;
  
  byService: Record<string, number>;
  byScoreRange: {
    critical: number;
    warning: number;
    good: number;
  };
}

export interface Reviewer {
  id: string;
  name: string;
  avatar: string;
  activeDialogs: number;
}

// Default filters
export const defaultFilters: DialogFilters = {
  status: [],
  services: [],
  scoreRange: [0, 100],
  dateRange: null,
  assignedTo: null,
  hasIssues: null,
  issueCategories: [],
  priority: [],
  search: '',
};

// Service labels
export const serviceLabels: Record<string, string> = {
  lawyer: 'Юрист',
  doctor: 'Врач',
  psychologist: 'Психолог',
  financier: 'Финансист',
};

// Status labels
export const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  in_review: 'На проверке',
  reviewed: 'Проверен',
  escalated: 'Эскалирован',
  training: 'В дообучении',
};

// Issue category labels
export const issueCategoryLabels: Record<string, string> = {
  hallucination: 'Галлюцинация',
  inaccuracy: 'Неточность',
  empathy: 'Эмпатия',
  protocol: 'Протокол',
  safety: 'Безопасность',
};

// Mock data
export const qualityDialogs: QualityDialog[] = [
  {
    id: 'dlg-4521',
    userId: 'u-1001',
    userName: 'Пользователь 1001',
    service: 'lawyer',
    tenantId: 'tenant-a',
    aiScore: 92,
    messagesCount: 8,
    duration: '6:30',
    tokensUsed: 1850,
    avgResponseTime: '0.9s',
    flaggedMessagesCount: 0,
    issues: [],
    status: 'reviewed',
    reviewedAt: '2026-02-08T11:00:00',
    reviewedBy: 'Ревьюер 1',
    createdAt: '2026-02-08T10:30:00',
    endedAt: '2026-02-08T10:36:30',
    escalatedToExpert: false,
    riskScore: 8,
    priority: 'low',
  },
  {
    id: 'dlg-4520',
    userId: 'u-1002',
    userName: 'Пользователь 1002',
    service: 'doctor',
    tenantId: 'tenant-a',
    aiScore: 45,
    messagesCount: 6,
    duration: '8:45',
    tokensUsed: 2340,
    avgResponseTime: '1.2s',
    flaggedMessagesCount: 2,
    issues: [
      { 
        id: 'iss-1', 
        messageId: 'msg-4', 
        category: 'inaccuracy', 
        description: 'Преждевременный диагноз',
        severity: 'critical'
      },
      { 
        id: 'iss-2', 
        messageId: 'msg-4', 
        category: 'protocol', 
        description: 'Не уточнён анамнез',
        severity: 'warning'
      }
    ],
    status: 'pending',
    createdAt: '2026-02-08T09:15:00',
    endedAt: '2026-02-08T09:23:45',
    escalatedToExpert: false,
    riskScore: 78,
    priority: 'critical',
  },
  {
    id: 'dlg-4519',
    userId: 'u-1003',
    userName: 'Пользователь 1003',
    service: 'psychologist',
    tenantId: 'tenant-a',
    aiScore: 78,
    messagesCount: 12,
    duration: '15:20',
    tokensUsed: 3200,
    avgResponseTime: '1.0s',
    flaggedMessagesCount: 1,
    issues: [
      { 
        id: 'iss-3', 
        messageId: 'msg-8', 
        category: 'empathy', 
        description: 'Недостаточная эмпатия',
        severity: 'warning'
      }
    ],
    status: 'in_review',
    assignedTo: 'rev-1',
    assignedToName: 'Ревьюер 1',
    createdAt: '2026-02-08T08:45:00',
    endedAt: '2026-02-08T09:00:20',
    escalatedToExpert: false,
    riskScore: 35,
    priority: 'medium',
  },
  {
    id: 'dlg-4518',
    userId: 'u-1004',
    userName: 'Пользователь 1004',
    service: 'financier',
    tenantId: 'tenant-b',
    aiScore: 95,
    messagesCount: 5,
    duration: '4:15',
    tokensUsed: 1200,
    avgResponseTime: '0.8s',
    flaggedMessagesCount: 0,
    issues: [],
    status: 'reviewed',
    reviewedAt: '2026-02-07T16:30:00',
    reviewedBy: 'Ревьюер 2',
    createdAt: '2026-02-07T15:45:00',
    endedAt: '2026-02-07T15:49:15',
    escalatedToExpert: false,
    riskScore: 5,
    priority: 'low',
  },
  {
    id: 'dlg-4517',
    userId: 'u-1005',
    userName: 'Пользователь 1005',
    service: 'lawyer',
    tenantId: 'tenant-a',
    aiScore: 32,
    messagesCount: 4,
    duration: '3:10',
    tokensUsed: 980,
    avgResponseTime: '1.5s',
    flaggedMessagesCount: 3,
    issues: [
      { 
        id: 'iss-4', 
        messageId: 'msg-2', 
        category: 'hallucination', 
        description: 'Ссылка на несуществующий закон',
        severity: 'critical'
      },
      { 
        id: 'iss-5', 
        messageId: 'msg-3', 
        category: 'inaccuracy', 
        description: 'Неверные сроки исковой давности',
        severity: 'critical'
      },
      { 
        id: 'iss-6', 
        messageId: 'msg-4', 
        category: 'safety', 
        description: 'Совет может навредить клиенту',
        severity: 'critical'
      }
    ],
    status: 'escalated',
    assignedTo: 'rev-3',
    assignedToName: 'Ревьюер 3',
    createdAt: '2026-02-08T07:30:00',
    endedAt: '2026-02-08T07:33:10',
    escalatedToExpert: true,
    riskScore: 95,
    priority: 'critical',
  },
  {
    id: 'dlg-4516',
    userId: 'u-1006',
    userName: 'Пользователь 1006',
    service: 'doctor',
    tenantId: 'tenant-b',
    aiScore: 88,
    messagesCount: 7,
    duration: '5:40',
    tokensUsed: 1650,
    avgResponseTime: '0.9s',
    flaggedMessagesCount: 0,
    issues: [],
    status: 'reviewed',
    reviewedAt: '2026-02-07T14:20:00',
    reviewedBy: 'Ревьюер 4',
    createdAt: '2026-02-07T13:30:00',
    endedAt: '2026-02-07T13:35:40',
    escalatedToExpert: false,
    riskScore: 12,
    priority: 'low',
  },
  {
    id: 'dlg-4515',
    userId: 'u-1007',
    userName: 'Пользователь 1007',
    service: 'psychologist',
    tenantId: 'tenant-a',
    aiScore: 65,
    messagesCount: 10,
    duration: '12:30',
    tokensUsed: 2800,
    avgResponseTime: '1.1s',
    flaggedMessagesCount: 1,
    issues: [
      { 
        id: 'iss-7', 
        messageId: 'msg-6', 
        category: 'protocol', 
        description: 'Пропущен важный шаг протокола',
        severity: 'critical'
      }
    ],
    status: 'pending',
    createdAt: '2026-02-08T06:20:00',
    endedAt: '2026-02-08T06:32:30',
    escalatedToExpert: false,
    riskScore: 72,
    priority: 'high',
  },
  {
    id: 'dlg-4514',
    userId: 'u-1008',
    userName: 'Пользователь 1008',
    service: 'financier',
    tenantId: 'tenant-a',
    aiScore: 91,
    messagesCount: 6,
    duration: '5:00',
    tokensUsed: 1400,
    avgResponseTime: '0.85s',
    flaggedMessagesCount: 0,
    issues: [],
    status: 'reviewed',
    reviewedAt: '2026-02-07T12:00:00',
    reviewedBy: 'Ревьюер 1',
    createdAt: '2026-02-07T11:00:00',
    endedAt: '2026-02-07T11:05:00',
    escalatedToExpert: false,
    riskScore: 9,
    priority: 'low',
  },
  {
    id: 'dlg-4513',
    userId: 'u-1009',
    userName: 'Пользователь 1009',
    service: 'lawyer',
    tenantId: 'tenant-b',
    aiScore: 55,
    messagesCount: 9,
    duration: '7:45',
    tokensUsed: 2100,
    avgResponseTime: '1.3s',
    flaggedMessagesCount: 1,
    issues: [
      { 
        id: 'iss-8', 
        messageId: 'msg-5', 
        category: 'inaccuracy', 
        description: 'Неточная информация о штрафах',
        severity: 'warning'
      }
    ],
    status: 'training',
    assignedTo: 'rev-2',
    assignedToName: 'Ревьюер 2',
    createdAt: '2026-02-07T10:15:00',
    endedAt: '2026-02-07T10:22:45',
    escalatedToExpert: false,
    riskScore: 48,
    priority: 'medium',
  },
  {
    id: 'dlg-4512',
    userId: 'u-1010',
    userName: 'Пользователь 1010',
    service: 'doctor',
    tenantId: 'tenant-a',
    aiScore: 72,
    messagesCount: 8,
    duration: '9:20',
    tokensUsed: 2450,
    avgResponseTime: '1.0s',
    flaggedMessagesCount: 1,
    issues: [
      { 
        id: 'iss-9', 
        messageId: 'msg-7', 
        category: 'empathy', 
        description: 'Слишком сухой ответ на жалобу',
        severity: 'info'
      }
    ],
    status: 'in_review',
    assignedTo: 'rev-4',
    assignedToName: 'Ревьюер 4',
    createdAt: '2026-02-08T05:00:00',
    endedAt: '2026-02-08T05:09:20',
    escalatedToExpert: false,
    riskScore: 28,
    priority: 'medium',
  },
  {
    id: 'dlg-4511',
    userId: 'u-1011',
    userName: 'Пользователь 1011',
    service: 'psychologist',
    tenantId: 'tenant-b',
    aiScore: 82,
    messagesCount: 14,
    duration: '18:45',
    tokensUsed: 3800,
    avgResponseTime: '0.95s',
    flaggedMessagesCount: 0,
    issues: [],
    status: 'reviewed',
    reviewedAt: '2026-02-06T17:00:00',
    reviewedBy: 'Ревьюер 2',
    createdAt: '2026-02-06T15:30:00',
    endedAt: '2026-02-06T15:48:45',
    escalatedToExpert: false,
    riskScore: 18,
    priority: 'low',
  },
  {
    id: 'dlg-4510',
    userId: 'u-1012',
    userName: 'Пользователь 1012',
    service: 'financier',
    tenantId: 'tenant-a',
    aiScore: 48,
    messagesCount: 5,
    duration: '4:30',
    tokensUsed: 1150,
    avgResponseTime: '1.4s',
    flaggedMessagesCount: 2,
    issues: [
      { 
        id: 'iss-10', 
        messageId: 'msg-3', 
        category: 'hallucination', 
        description: 'Неверная процентная ставка',
        severity: 'critical'
      },
      { 
        id: 'iss-11', 
        messageId: 'msg-4', 
        category: 'inaccuracy', 
        description: 'Ошибка в расчёте',
        severity: 'warning'
      }
    ],
    status: 'pending',
    createdAt: '2026-02-08T04:15:00',
    endedAt: '2026-02-08T04:19:30',
    escalatedToExpert: false,
    riskScore: 75,
    priority: 'critical',
  },
];

export const savedFilters: SavedFilter[] = [
  {
    id: 'sf-1',
    name: 'Критичные сегодня',
    filters: {
      status: ['pending'],
      services: [],
      scoreRange: [0, 50],
      dateRange: ['today', 'today'],
      assignedTo: null,
      hasIssues: true,
      issueCategories: [],
      priority: ['critical', 'high'],
      search: '',
    },
    createdBy: 'system',
    isDefault: false,
  },
  {
    id: 'sf-2',
    name: 'Мои на проверке',
    filters: {
      status: ['in_review'],
      services: [],
      scoreRange: [0, 100],
      dateRange: null,
      assignedTo: 'current_user',
      hasIssues: null,
      issueCategories: [],
      priority: [],
      search: '',
    },
    createdBy: 'user',
    isDefault: true,
  },
  {
    id: 'sf-3',
    name: 'Психолог: эмпатия',
    filters: {
      status: [],
      services: ['psychologist'],
      scoreRange: [0, 100],
      dateRange: null,
      assignedTo: null,
      hasIssues: true,
      issueCategories: ['empathy'],
      priority: [],
      search: '',
    },
    createdBy: 'user',
  },
];

export const dialogStats: DialogStats = {
  total: 1234,
  pending: 156,
  inReview: 45,
  reviewed: 989,
  escalated: 44,
  
  avgAiScore: 78.5,
  avgReviewTime: '5m 23s',
  
  byService: {
    lawyer: 420,
    doctor: 380,
    psychologist: 234,
    financier: 200,
  },
  byScoreRange: {
    critical: 23,
    warning: 156,
    good: 1055,
  },
};

export const reviewers: Reviewer[] = [
  { id: 'rev-1', name: 'Анна Козлова', avatar: '', activeDialogs: 12 },
  { id: 'rev-2', name: 'Мария Иванова', avatar: '', activeDialogs: 8 },
  { id: 'rev-3', name: 'Алексей Петров', avatar: '', activeDialogs: 15 },
  { id: 'rev-4', name: 'Елена Смирнова', avatar: '', activeDialogs: 5 },
];

// Helper functions
export function getScoreColor(score: number): string {
  if (score < 50) return 'text-destructive';
  if (score < 80) return 'text-warning';
  return 'text-success';
}

export function getScoreBgColor(score: number): string {
  if (score < 50) return 'bg-destructive';
  if (score < 80) return 'bg-warning';
  return 'bg-success';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-warning/10 text-warning border-warning/20';
    case 'in_review': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'reviewed': return 'bg-success/10 text-success border-success/20';
    case 'escalated': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'training': return 'bg-primary/10 text-primary border-primary/20';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-destructive';
    case 'high': return 'text-warning';
    case 'medium': return 'text-blue-500';
    case 'low': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateOnly.getTime() === today.getTime()) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }
}
