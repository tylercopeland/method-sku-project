import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AddLeadModal } from '@/components/AddLeadModal';
import { ConnectAccountingModal } from '@/components/ConnectAccountingModal';
import { CreateEstimateModal } from '@/components/CreateEstimateModal';
import { CreateCustomerModal } from '@/components/CreateCustomerModal';
import { LogActivityModal } from '@/components/LogActivityModal';
import { AddProductServiceModal } from '@/components/AddProductServiceModal';
import { CreateInvoiceModal } from '@/components/CreateInvoiceModal';
import { 
  FileText, 
  Users, 
  Receipt, 
  Plus, 
  Search, 
  Settings, 
  Phone, 
  Calendar,
  Mail,
  MessageCircle,
  Clock,
  Target,
  Building2,
  Database,
  CreditCard,
  BarChart3,
  FileSpreadsheet,
  UserPlus,
  Activity,
  Package
} from 'lucide-react';
import { useState } from 'react';

interface QuickLinksBarProps {
  // Removed homeExperience - Admin only now
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  enabled: boolean;
}

export function QuickLinksBar({}: QuickLinksBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isConnectAccountingModalOpen, setIsConnectAccountingModalOpen] = useState(false);
  const [isCreateEstimateModalOpen, setIsCreateEstimateModalOpen] = useState(false);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
  const [isAddProductServiceModalOpen, setIsAddProductServiceModalOpen] = useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  
  const allAdminActions: QuickAction[] = [
    {
      id: 'create-estimate',
      icon: <FileText className="w-5 h-5" />,
      label: 'Create Estimate',
      description: 'Build a new estimate',
      color: 'text-green-600 hover:bg-green-50',
      enabled: true
    },
    {
      id: 'new-customer',
      icon: <UserPlus className="w-5 h-5" />,
      label: 'New Customer',
      description: 'Add a new customer',
      color: 'text-blue-600 hover:bg-blue-50',
      enabled: true
    },
    {
      id: 'log-activity',
      icon: <Activity className="w-5 h-5" />,
      label: 'Log Activity',
      description: 'Record customer activity',
      color: 'text-indigo-600 hover:bg-indigo-50',
      enabled: true
    },
    {
      id: 'add-product-service',
      icon: <Package className="w-5 h-5" />,
      label: 'Add Product/Service',
      description: 'Add new product or service',
      color: 'text-purple-600 hover:bg-purple-50',
      enabled: true
    },
    {
      id: 'create-invoice',
      icon: <Receipt className="w-5 h-5" />,
      label: 'Create Invoice',
      description: 'Create an invoice',
      color: 'text-orange-600 hover:bg-orange-50',
      enabled: true
    },
    {
      id: 'schedule-call',
      icon: <Phone className="w-5 h-5" />,
      label: 'Schedule Call',
      description: 'Book a customer call',
      color: 'text-teal-600 hover:bg-teal-50',
      enabled: false
    },
    {
      id: 'send-email',
      icon: <Mail className="w-5 h-5" />,
      label: 'Send Email',
      description: 'Email a customer',
      color: 'text-red-600 hover:bg-red-50',
      enabled: false
    },
    {
      id: 'view-reports',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'View Reports',
      description: 'Check business metrics',
      color: 'text-cyan-600 hover:bg-cyan-50',
      enabled: false
    },
    {
      id: 'manage-inventory',
      icon: <Database className="w-5 h-5" />,
      label: 'Manage Items',
      description: 'Update inventory items',
      color: 'text-gray-600 hover:bg-gray-50',
      enabled: false
    },
    {
      id: 'process-payment',
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Process Payment',
      description: 'Record a payment',
      color: 'text-emerald-600 hover:bg-emerald-50',
      enabled: false
    }
  ];

  const allGeneralActions: QuickAction[] = [
    {
      id: 'view-customers',
      icon: <Users className="w-5 h-5" />,
      label: 'View Customers',
      description: 'Browse customer list',
      color: 'text-blue-600 hover:bg-blue-50',
      enabled: true
    },
    {
      id: 'create-estimate',
      icon: <FileText className="w-5 h-5" />,
      label: 'Create Estimate',
      description: 'Build a new estimate',
      color: 'text-green-600 hover:bg-green-50',
      enabled: true
    },
    {
      id: 'log-activity',
      icon: <Activity className="w-5 h-5" />,
      label: 'Log Activity',
      description: 'Record customer activity',
      color: 'text-purple-600 hover:bg-purple-50',
      enabled: true
    },
    {
      id: 'schedule-followup',
      icon: <Clock className="w-5 h-5" />,
      label: 'Schedule Follow-up',
      description: 'Set reminder for customer',
      color: 'text-orange-600 hover:bg-orange-50',
      enabled: true
    },
    {
      id: 'view-opportunities',
      icon: <Target className="w-5 h-5" />,
      label: 'View Opportunities',
      description: 'Check sales pipeline',
      color: 'text-indigo-600 hover:bg-indigo-50',
      enabled: true
    },
    {
      id: 'send-message',
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Send Message',
      description: 'Contact a customer',
      color: 'text-red-600 hover:bg-red-50',
      enabled: false
    }
  ];

  const [adminActions, setAdminActions] = useState(allAdminActions);
  const [generalActions, setGeneralActions] = useState(allGeneralActions);

  const currentActions = adminActions;
  const enabledActions = currentActions.filter(action => action.enabled);

  const toggleAction = (actionId: string) => {
    setAdminActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, enabled: !action.enabled }
          : action
      )
    );
  };

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'create-estimate':
        setIsCreateEstimateModalOpen(true);
        break;
      case 'new-customer':
        setIsCreateCustomerModalOpen(true);
        break;
      case 'log-activity':
        setIsLogActivityModalOpen(true);
        break;
      case 'add-product-service':
        setIsAddProductServiceModalOpen(true);
        break;
      case 'create-invoice':
        setIsCreateInvoiceModalOpen(true);
        break;
      case 'view-customers':
        // Navigate to customers page
        console.log('Navigate to customers page');
        break;
      case 'schedule-followup':
        // Open follow-up scheduler
        console.log('Open follow-up scheduler');
        break;
      case 'view-opportunities':
        setIsAddLeadModalOpen(true);
        break;
      default:
        console.log(`Action clicked: ${actionId}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Get Started</h3>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configure Quick Actions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-600">
                  Choose which actions to display in your Quick Actions panel. You can show up to 5 actions.
                </p>
                <Separator />
                <div className="max-h-80 overflow-y-auto">
                  <div className="space-y-2">
                    {currentActions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white"
                      >
                        <Checkbox
                          id={action.id}
                          checked={action.enabled}
                          onCheckedChange={() => toggleAction(action.id)}
                          disabled={!action.enabled && enabledActions.length >= 5}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="p-1 rounded">
                            {action.icon}
                          </div>
                          <Label htmlFor={action.id} className="flex-1 cursor-pointer">
                            <div className="font-medium text-sm">{action.label}</div>
                            <div className="text-xs text-gray-500">{action.description}</div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {enabledActions.length >= 5 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    Maximum of 5 actions can be displayed. Disable an action to add a new one.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-2">
          {enabledActions.slice(0, 5).map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleActionClick(action.id)}
              className={`w-full h-auto flex items-center justify-start gap-3 p-3 ${action.color} border border-transparent hover:border-gray-200 transition-all duration-200 text-left`}
            >
              <div className="p-2 rounded-md bg-gray-50 flex-shrink-0">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Modals for different actions */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
      />

      <ConnectAccountingModal
        isOpen={isConnectAccountingModalOpen}
        onClose={() => setIsConnectAccountingModalOpen(false)}
      />
      
      <CreateEstimateModal
        isOpen={isCreateEstimateModalOpen}
        onClose={() => setIsCreateEstimateModalOpen(false)}
      />
      
      <CreateCustomerModal
        isOpen={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
      />
      
      <LogActivityModal
        isOpen={isLogActivityModalOpen}
        onClose={() => setIsLogActivityModalOpen(false)}
      />
      
      <AddProductServiceModal
        isOpen={isAddProductServiceModalOpen}
        onClose={() => setIsAddProductServiceModalOpen(false)}
      />
      
      <CreateInvoiceModal
        isOpen={isCreateInvoiceModalOpen}
        onClose={() => setIsCreateInvoiceModalOpen(false)}
      />
    </>
  );
}