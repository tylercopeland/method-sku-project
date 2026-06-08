import { CreditCard, Mail, Settings, Target, Users } from 'lucide-react';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  icon: React.ReactNode;
  recommended: true;
}

export const adminRecommendations: RecommendationItem[] = [
  {
    id: 'track-pipeline-opportunities',
    title: 'Track pipeline with Opportunities',
    description: 'Set up your sales pipeline to track deals through every stage.',
    dueDate: 'Checklist complete',
    completed: false,
    icon: <Target className="w-5 h-5 text-purple-500" />,
    recommended: true,
  },
  {
    id: 'invite-your-team',
    title: 'Invite your team',
    description: 'Bring teammates into Method to collaborate on customers and deals.',
    dueDate: 'Day 1–2 post-checklist',
    completed: false,
    icon: <Users className="w-5 h-5 text-purple-500" />,
    recommended: true,
  },
  {
    id: 'customize-workspace',
    title: 'Customize your workspace',
    description: 'Tailor Method to fit your workflow with custom fields and views.',
    dueDate: 'Day 3–5 post-checklist',
    completed: false,
    icon: <Settings className="w-5 h-5 text-purple-500" />,
    recommended: true,
  },
  {
    id: 'connect-payment-gateway',
    title: 'Connect a payment gateway',
    description: 'Accept online payments and get paid faster with Method Pay.',
    dueDate: 'After first invoice',
    completed: false,
    icon: <CreditCard className="w-5 h-5 text-purple-500" />,
    recommended: true,
  },
  {
    id: 'send-email-campaign',
    title: 'Send an email campaign',
    description: 'Engage your customers with targeted email campaigns.',
    dueDate: 'Day 10+ post-checklist',
    completed: false,
    icon: <Mail className="w-5 h-5 text-purple-500" />,
    recommended: true,
  },
];
