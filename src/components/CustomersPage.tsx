import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, Eye, Edit, Phone, Mail, MoreHorizontal, MoreVertical, ArrowUpDown, Columns3, Sparkles, Building2, MapPin, ArrowLeft, Calendar, DollarSign, FileText, Activity, Users, ShoppingCart, Receipt, CheckCircle2, ArrowRight, X, Target, UserPlus, Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useFieldSurface, AIFieldGroup, useAIFields, formatFieldValue } from '@/lib/ai-fields';

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  lifetimeValue: number;
  lastContact: string;
  status: 'active' | 'inactive' | 'prospect';
  estimatesCount: number;
  invoicesCount: number;
}

interface CustomersPageProps {
  initialFilter?: string;
}

export function CustomersPage({ initialFilter }: CustomersPageProps) {
  const [sortFilter, setSortFilter] = useState(initialFilter === 'add-lead' ? 'all' : (initialFilter || 'all'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('estimates');
  // Register the Customer surface so the global header launcher can add fields.
  // Customer fields render on the detail screen, not inline in the data table.
  useFieldSurface({ entityType: 'customer', entityLabel: 'Customers', surface: 'detail' });
  const ai = useAIFields();
  // AI-added fields shown as columns on the Customers list, managed via the
  // Columns menu (which also kicks off "Add field" for this list component).
  const listFields = ai.getFields('customer');
  // Columns hidden via the Columns toggle menu (everything visible by default).
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const showColumn = (key: string) => !hiddenColumns.has(key);
  const toggleColumn = (key: string) =>
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  const toggleableColumns = [
    { key: 'customer', label: 'Customer' },
    { key: 'company', label: 'Company' },
    { key: 'contact', label: 'Contact' },
    { key: 'location', label: 'Location' },
    { key: 'lifetimeValue', label: 'Lifetime Value' },
    { key: 'lastContact', label: 'Last Contact' },
    { key: 'status', label: 'Status' },
    { key: 'activity', label: 'Activity' },
    ...listFields.map((f) => ({ key: f.id, label: f.label })),
  ];
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [showAddLeadPanel, setShowAddLeadPanel] = useState(initialFilter === 'add-lead');
  const [addLeadTab, setAddLeadTab] = useState('manual');
  const [leadFormData, setLeadFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    estimatedValue: '',
    expectedCloseDate: '',
    leadSource: '',
    notes: ''
  });

  // Show Add Lead panel when navigating with 'add-lead' filter
  useEffect(() => {
    if (initialFilter === 'add-lead') {
      setShowAddLeadPanel(true);
    }
  }, [initialFilter]);

  const handleLeadSubmit = () => {
    console.log('Adding lead:', leadFormData);
    setShowAddLeadPanel(false);
    setLeadFormData({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      estimatedValue: '',
      expectedCloseDate: '',
      leadSource: '',
      notes: ''
    });
  };

  // Sample customers data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      company: 'Acme Corporation',
      email: 'john.smith@acme.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      lifetimeValue: 45200,
      lastContact: '2023-06-15', // More than 6 months ago
      status: 'active',
      estimatesCount: 8,
      invoicesCount: 12
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'Tech Solutions Inc',
      email: 'sarah@techsolutions.com',
      phone: '(555) 234-5678',
      location: 'San Francisco, CA',
      lifetimeValue: 32400,
      lastContact: '2024-01-18',
      status: 'active',
      estimatesCount: 5,
      invoicesCount: 9
    },
    {
      id: '3',
      name: 'Michael Brown',
      company: 'Global Industries',
      email: 'mbrown@global.com',
      phone: '(555) 345-6789',
      location: 'Chicago, IL',
      lifetimeValue: 28900,
      lastContact: '2023-05-20', // More than 6 months ago
      status: 'active',
      estimatesCount: 6,
      invoicesCount: 7
    },
    {
      id: '4',
      name: 'Emily Davis',
      company: 'StartupXYZ',
      email: 'emily@startupxyz.com',
      phone: '(555) 456-7890',
      location: 'Austin, TX',
      lifetimeValue: 15600,
      lastContact: '2024-01-22',
      status: 'active',
      estimatesCount: 3,
      invoicesCount: 4
    },
    {
      id: '5',
      name: 'David Wilson',
      company: 'Local Business Co',
      email: 'david@localbiz.com',
      phone: '(555) 567-8901',
      location: 'Denver, CO',
      lifetimeValue: 8300,
      lastContact: '2023-04-10', // More than 6 months ago
      status: 'active',
      estimatesCount: 2,
      invoicesCount: 3
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      company: 'Creative Agency',
      email: 'lisa@creative.com',
      phone: '(555) 678-9012',
      location: 'Los Angeles, CA',
      lifetimeValue: 5200,
      lastContact: '2023-07-08', // More than 6 months ago
      status: 'prospect',
      estimatesCount: 1,
      invoicesCount: 0
    },
    // Add more inactive customers to demonstrate the feature
    {
      id: '7',
      name: 'Robert Chen',
      company: 'Manufacturing Plus',
      email: 'robert@mfgplus.com',
      phone: '(555) 789-0123',
      location: 'Detroit, MI',
      lifetimeValue: 18700,
      lastContact: '2023-03-15', // More than 6 months ago
      status: 'active',
      estimatesCount: 4,
      invoicesCount: 6
    },
    {
      id: '8',
      name: 'Jennifer Martinez',
      company: 'Retail Solutions',
      email: 'jennifer@retailsol.com',
      phone: '(555) 890-1234',
      location: 'Phoenix, AZ',
      lifetimeValue: 12300,
      lastContact: '2023-02-28', // More than 6 months ago
      status: 'active',
      estimatesCount: 3,
      invoicesCount: 4
    },
    {
      id: '9',
      name: 'Thomas Lee',
      company: 'Construction Co',
      email: 'thomas@constructco.com',
      phone: '(555) 901-2345',
      location: 'Seattle, WA',
      lifetimeValue: 22100,
      lastContact: '2023-01-20', // More than 6 months ago
      status: 'active',
      estimatesCount: 7,
      invoicesCount: 8
    }
  ];

  // Sort customers based on filter
  const getSortedCustomers = () => {
    let sorted = [...customers];
    
    switch (sortFilter) {
      case 'lifetime-value':
        sorted = sorted.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
        break;
      case 'inactive':
        // Filter customers with no recent activity (simulated as those with older lastContact dates)
        sorted = sorted.filter(customer => {
          const lastContactDate = new Date(customer.lastContact);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return lastContactDate < sixMonthsAgo;
        }).sort((a, b) => new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime());
        break;
      case 'recent-contact':
        sorted = sorted.sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime());
        break;
      case 'alphabetical':
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'company':
        sorted = sorted.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default:
        // Keep original order for 'all'
        break;
    }
    
    return sorted;
  };

  // Filter customers based on search term
  const filteredCustomers = getSortedCustomers().filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Main sample customer - all sample data across apps ties back to this contact
  const MAIN_SAMPLE_CUSTOMER_NAME = 'Demo Customer';
  const MAIN_SAMPLE_COMPANY = 'Example Company Inc';

  // Sample customer record to display at the top (always visible, not affected by filters/sorts)
  const sampleCustomer: Customer = {
    id: 'sample-1',
    name: `[Sample Data] ${MAIN_SAMPLE_CUSTOMER_NAME}`,
    company: MAIN_SAMPLE_COMPANY,
    email: 'demo@example.com',
    phone: '(555) 000-0000',
    location: 'San Francisco, CA',
    lifetimeValue: 125000,
    lastContact: '2025-01-15',
    status: 'active',
    estimatesCount: 1,
    invoicesCount: 1
  };

  // Prepend sample customer to the list (always show at top, regardless of filters/sorts)
  const customersToDisplay = [sampleCustomer, ...filteredCustomers];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'secondary' as const, color: 'bg-green-100 text-green-800 border-green-200' },
      inactive: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 border-gray-200' },
      prospect: { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800 border-blue-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate summary stats
  const activeCustomers = customers.filter(c => c.status === 'active');
  const totalLifetimeValue = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const averageLifetimeValue = totalLifetimeValue / customers.length;

  // Customer drilldown view
  if (selectedCustomer) {
    
    return (
      <div className="flex flex-col md:flex-row min-h-0 flex-1">
        {/* Left Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 space-y-6 overflow-y-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCustomer(null)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Customer Header */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-white text-xl font-medium">
              {selectedCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h2>
              <p className="text-sm text-gray-600">Main Contact</p>
              <p className="text-sm text-gray-600">{selectedCustomer.company}</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Health Score</span>
              <span className="text-xs text-gray-500">(Updated today at 1:28 AM)</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">10</div>
            <p className="text-xs text-gray-600">No change in health score compared to last week.</p>
          </div>

          {/* Contact Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Phone</div>
                <div className="text-sm text-blue-600">{selectedCustomer.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Email</div>
                <div className="text-sm text-blue-600">{selectedCustomer.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Tags</div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  Hot Leads
                </Badge>
              </div>
            </div>
            {/* AI-added custom fields live under Contact Details */}
            <AIFieldGroup
              entityType="customer"
              entityLabel="Customers"
              recordId={selectedCustomer.id}
              heading={null}
            />
          </div>

          {/* Customer Lead Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Lead Details</h3>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Lead Status</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Lead Rating</div>
                <div className="text-sm text-gray-600">Hot</div>
              </div>
            </div>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white min-h-0 overflow-y-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {(() => {
                const isSampleCustomer = selectedCustomer.id === 'sample-1';
                const getTabCount = (tabId: string) => {
                  if (isSampleCustomer) {
                    // For sample customer, all tabs have exactly 1 item
                    switch (tabId) {
                      case 'estimates':
                      case 'invoices':
                      case 'payments':
                      case 'receipts':
                      case 'activities':
                        return 1;
                      default:
                        return 0;
                    }
                  }
                  // For regular customers, use the stored counts
                  switch (tabId) {
                    case 'estimates':
                      return selectedCustomer.estimatesCount;
                    case 'invoices':
                      return selectedCustomer.invoicesCount;
                    default:
                      return 0;
                  }
                };
                
                return [
                  { id: 'estimates', label: 'Estimates', count: getTabCount('estimates') },
                  { id: 'invoices', label: 'Invoices', count: getTabCount('invoices') },
                  { id: 'payments', label: 'Payments', count: getTabCount('payments') },
                  { id: 'contacts', label: 'Other Contacts', count: getTabCount('contacts') },
                  { id: 'orders', label: 'Sales Orders', count: getTabCount('orders') },
                  { id: 'receipts', label: 'Sales Receipts', count: getTabCount('receipts') },
                  { id: 'activities', label: 'Activities Open', count: getTabCount('activities') }
                ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {tab.count}
                    </span>
                  )}
                </button>
              ));
              })()}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Search" className="w-64" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New {activeTab === 'estimates' ? 'Estimate' : activeTab === 'invoices' ? 'Invoice' : 'Item'}
              </Button>
            </div>

            {/* Tab Content */}
            {(() => {
              const isSampleCustomer = selectedCustomer.id === 'sample-1';
              
              const getTabData = () => {
                switch (activeTab) {
                  case 'estimates':
                    if (isSampleCustomer) {
                      return {
                        data: [{
                          id: 'EST-001',
                          date: new Date(2025, 1, 3).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: '2-digit' 
                          }),
                          memo: '[Sample Data] Project Opportunity',
                          amount: 50000
                        }],
                        headers: ['Date', 'Estimate #', 'Memo', 'Amount']
                      };
                    }
                    return {
                      data: Array.from({ length: selectedCustomer.estimatesCount }, (_, i) => ({
                        id: `EST-${String(i + 1).padStart(3, '0')}`,
                        date: new Date(2025, 1, 3 + i).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: '2-digit' 
                        }),
                        memo: [
                          'Website redesign project',
                          'Mobile app development',
                          'Database optimization',
                          'Security audit services',
                          'Cloud migration project'
                        ][i] || `Project ${i + 1}`,
                        amount: [15000, 8500, 12000, 5500, 22000][i] || (10000 + i * 1000)
                      })),
                      headers: ['Date', 'Estimate #', 'Memo', 'Amount']
                    };
                  case 'invoices':
                    if (isSampleCustomer) {
                      return {
                        data: [{
                          id: 'INV-1001',
                          date: new Date(2025, 0, 15).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: '2-digit' 
                          }),
                          memo: '[Sample Data] Invoice for Example Company Inc',
                          amount: 5247.50
                        }],
                        headers: ['Date', 'Invoice #', 'Memo', 'Amount']
                      };
                    }
                    return {
                      data: Array.from({ length: selectedCustomer.invoicesCount }, (_, i) => ({
                        id: `INV-${String(i + 1001).padStart(4, '0')}`,
                        date: new Date(2025, 0, 15 + i * 3).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: '2-digit' 
                        }),
                        memo: [
                          'Website redesign - Phase 1',
                          'Mobile app development - Initial',
                          'Database optimization - Complete',
                          'Security audit - Final report',
                          'Cloud migration - Setup',
                          'Maintenance services - Q1',
                          'Additional features - Sprint 1',
                          'Bug fixes and updates',
                          'Performance optimization'
                        ][i] || `Invoice ${i + 1}`,
                        amount: [7500, 4250, 12000, 5500, 11000, 3500, 6800, 2200, 4900][i] || (5000 + i * 500)
                      })),
                      headers: ['Date', 'Invoice #', 'Memo', 'Amount']
                    };
                  case 'payments':
                    if (isSampleCustomer) {
                      return {
                        data: [{
                          id: 'PAY-001',
                          date: new Date(2025, 0, 2).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: '2-digit' 
                          }),
                          method: 'ACH',
                          amount: 5000.00
                        }],
                        headers: ['Date', 'Payment #', 'Method', 'Amount']
                      };
                    }
                    return { data: [], headers: ['Date', 'Payment #', 'Method', 'Amount'] };
                  case 'contacts':
                    return { data: [], headers: ['Name', 'Role', 'Email', 'Phone'] };
                  case 'orders':
                    return { data: [], headers: ['Date', 'Order #', 'Items', 'Total'] };
                  case 'receipts':
                    if (isSampleCustomer) {
                      return {
                        data: [{
                          id: 'SR-001',
                          date: new Date(2025, 0, 5).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: '2-digit' 
                          }),
                          description: '[Sample Data] Sales Receipt for Demo Customer',
                          amount: 250.00
                        }],
                        headers: ['Date', 'Receipt #', 'Description', 'Amount']
                      };
                    }
                    return { data: [], headers: ['Date', 'Receipt #', 'Description', 'Amount'] };
                  case 'activities':
                    if (isSampleCustomer) {
                      return {
                        data: [{
                          id: 'ACT-001',
                          date: 'Jan-15-2025',
                          memo: '[Sample Data] Follow-up with Demo Customer',
                          amount: null
                        }],
                        headers: ['Date', 'Activity #', 'Description', 'Status']
                      };
                    }
                    return {
                      data: [
                        {
                          id: 'ACT-001',
                          date: 'Jan-15-2025',
                          memo: 'Follow up call scheduled',
                          amount: null
                        },
                        {
                          id: 'ACT-002', 
                          date: 'Jan-10-2025',
                          memo: 'Sent proposal document',
                          amount: null
                        },
                        {
                          id: 'ACT-003',
                          date: 'Jan-08-2025',
                          memo: 'Initial consultation meeting',
                          amount: null
                        }
                      ],
                      headers: ['Date', 'Activity #', 'Description', 'Status']
                    };
                  default:
                    return { data: [], headers: ['Date', 'Item #', 'Description', 'Amount'] };
                }
              };

              const { data, headers } = getTabData();
              
              // Type assertion to handle different data structures across tabs
              type TabDataItem = {
                id: string;
                date: string;
                memo?: string;
                description?: string;
                method?: string;
                amount: number | null;
              };

              if (data.length === 0) {
                // Value-focused Empty State
                const getBalancedEmptyState = () => {
                  switch (activeTab) {
                    case 'estimates':
                      return {
                        icon: <FileText className="w-6 h-6 text-blue-600" />,
                        title: "No estimates yet",
                        description: `Create your first estimate for ${selectedCustomer.name}`,
                        primaryAction: "Create Estimate"
                      };
                    case 'invoices':
                      return {
                        icon: <FileText className="w-6 h-6 text-green-600" />,
                        title: "No invoices yet",
                        description: `Send your first invoice to ${selectedCustomer.name}`,
                        primaryAction: "Create Invoice"
                      };
                    case 'payments':
                      return {
                        icon: <DollarSign className="w-6 h-6 text-green-600" />,
                        title: "No payments recorded",
                        description: `Track payments from ${selectedCustomer.name}`,
                        primaryAction: "Record Payment"
                      };
                    case 'contacts':
                      return {
                        icon: <Users className="w-6 h-6 text-purple-600" />,
                        title: "No additional contacts",
                        description: `Add more contacts at ${selectedCustomer.company}`,
                        primaryAction: "Add Contact"
                      };
                    case 'orders':
                      return {
                        icon: <ShoppingCart className="w-6 h-6 text-indigo-600" />,
                        title: "No orders yet",
                        description: `Create your first order for ${selectedCustomer.name}`,
                        primaryAction: "Create Order"
                      };
                    case 'receipts':
                      return {
                        icon: <Receipt className="w-6 h-6 text-orange-600" />,
                        title: "No receipts yet",
                        description: `Record sales receipts for ${selectedCustomer.name}`,
                        primaryAction: "Create Receipt"
                      };
                    case 'activities':
                      return {
                        icon: <Activity className="w-6 h-6 text-blue-600" />,
                        title: "No activities logged",
                        description: `Start tracking interactions with ${selectedCustomer.name}`,
                        primaryAction: "Log Activity"
                      };
                    default:
                      return {
                        icon: <Plus className="w-6 h-6 text-gray-400" />,
                        title: "No items found",
                        description: "Add your first item to get started",
                        primaryAction: "Create Item"
                      };
                  }
                };

                const emptyState = getBalancedEmptyState();

                return (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {emptyState.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {emptyState.title}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      {emptyState.description}
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      {emptyState.primaryAction}
                    </Button>
                  </div>
                );
              }

              // Table with Data
              return (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        {headers.map((header, index) => (
                          <TableHead 
                            key={header} 
                            className={`text-gray-600 font-medium ${index === headers.length - 1 ? 'text-right' : ''}`}
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data as TabDataItem[]).map((item, index) => {
                        const thirdColumnValue = 'memo' in item ? item.memo : 
                                                  'description' in item ? item.description : 
                                                  'method' in item ? item.method : '-';
                        return (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-gray-200">
                            <TableCell className="text-gray-900">{item.date}</TableCell>
                            <TableCell className="text-blue-600">{item.id}</TableCell>
                            <TableCell className="text-gray-900">
                              {thirdColumnValue}
                            </TableCell>
                            <TableCell className="text-gray-900 text-right">
                              {item.amount !== null && item.amount !== undefined ? formatCurrency(item.amount) : '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="mt-4 text-sm text-gray-600">
                    {data.length} - {data.length} of {data.length} records.
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  // Add Lead Page View
  if (showAddLeadPanel) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddLeadPanel(false)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Add Your First Lead</h1>
                <p className="text-sm text-gray-600 mt-1">Start tracking potential customers and opportunities</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6">
            <Tabs value={addLeadTab} onValueChange={setAddLeadTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Manually
                </TabsTrigger>
                <TabsTrigger value="import" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import CSV
                </TabsTrigger>
              </TabsList>

              {/* Manual Entry Tab */}
              <TabsContent value="manual" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={leadFormData.firstName}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={leadFormData.lastName}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={leadFormData.company}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@acme.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadSource">Lead Source</Label>
                    <Select value={leadFormData.leadSource} onValueChange={(value) => setLeadFormData(prev => ({ ...prev, leadSource: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="cold-call">Cold Call</SelectItem>
                        <SelectItem value="trade-show">Trade Show</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue">Estimated Value</Label>
                    <Input
                      id="estimatedValue"
                      value={leadFormData.estimatedValue}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                      placeholder="$15,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={leadFormData.expectedCloseDate}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={leadFormData.address}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={leadFormData.notes}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional information about this lead..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setShowAddLeadPanel(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLeadSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!leadFormData.firstName || !leadFormData.lastName || !leadFormData.email}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              </TabsContent>

              {/* Import CSV Tab */}
              <TabsContent value="import" className="mt-6">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-blue-300 transition-colors">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Import leads from CSV</h3>
                  <p className="text-sm text-gray-600 mb-6">Drag and drop your CSV file here, or click to browse</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" className="text-blue-600 border-blue-200">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Button variant="ghost" className="text-gray-600">
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-6">
                  <Button variant="outline" onClick={() => setShowAddLeadPanel(false)}>
                    Cancel
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Value proposition for Customers
  const customersValueProps = {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: 'Manage All Your Customer Relationships',
    description: 'Customers syncs automatically from QuickBooks, giving you a complete view of every customer interaction, purchase history, and lifetime value in one place.',
    valueProps: [
      'View complete customer history and interaction timeline',
      'Track lifetime value and identify your best customers',
      'See all estimates, invoices, and payments in one place',
      'Identify inactive customers who need re-engagement'
    ],
    primaryAction: {
      label: 'Add New Customer',
      onClick: () => console.log('Add customer')
    },
    secondaryAction: {
      label: 'Import Customers',
      onClick: () => console.log('Import customers')
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Value Proposition Banner */}
      {!dismissedBanner && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4">
                  <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-sm w-fit mb-3">
                    {customersValueProps.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{customersValueProps.title}</h3>
                  <p className="text-sm text-gray-600">{customersValueProps.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {customersValueProps.valueProps.map((prop, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{prop}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-start mt-4">
                  {customersValueProps.primaryAction && (
                    <Button
                      onClick={customersValueProps.primaryAction.onClick}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {customersValueProps.primaryAction.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {customersValueProps.secondaryAction && (
                    <Button
                      onClick={customersValueProps.secondaryAction.onClick}
                      variant="outline"
                      size="lg"
                      className="px-6 py-4 text-sm border-2 hover:bg-gray-50"
                    >
                      {customersValueProps.secondaryAction.label}
                    </Button>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDismissedBanner(true)}
                className="ml-4 h-8 w-8 p-0 hover:bg-blue-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards - Hidden */}
      {false && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Customers</div>
              <div className="text-2xl font-semibold text-gray-900">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Active Customers</div>
              <div className="text-2xl font-semibold text-green-600">{activeCustomers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Lifetime Value</div>
              <div className="text-2xl font-semibold text-blue-600">{formatCurrency(totalLifetimeValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Avg Lifetime Value</div>
              <div className="text-2xl font-semibold text-purple-600">{formatCurrency(averageLifetimeValue)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Card with Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Customers</CardTitle>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Customer
            </Button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <CardTitle>All Customers</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Sort Filter */}
              <Select value={sortFilter} onValueChange={setSortFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="lifetime-value">By Lifetime Value</SelectItem>
                  <SelectItem value="recent-contact">By Recent Contact</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="company">By Company</SelectItem>
                 <SelectItem value="inactive">Inactive Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Show filter indicator */}
          {sortFilter === 'lifetime-value' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">Showing customers sorted by lifetime value (highest first)</span>
              </div>
            </div>
          )}

         {sortFilter === 'inactive' && (
           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
             <div className="flex items-center gap-2 text-orange-800">
               <Building2 className="w-4 h-4" />
               <span className="font-medium">Showing customers with no purchases in the last 6 months</span>
             </div>
           </div>
         )}
          {/* Data table toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <div className="absolute right-0 top-0 h-full flex items-center pr-3 border-l border-gray-200 pl-3 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[
                { icon: Filter, label: 'Filter' },
                { icon: ArrowUpDown, label: 'Sort' },
              ].map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="icon"
                  aria-label={label}
                  className="h-10 w-10 text-gray-500 hover:text-gray-700"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}

              {/* Columns: toggle visibility + kick off "Add field" for this list */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Columns"
                    className="h-10 w-10 text-gray-500 hover:text-gray-700"
                  >
                    <Columns3 className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {ai.enabled && (
                    <>
                      <DropdownMenuItem
                        onClick={() =>
                          ai.openAddField({
                            entityType: 'customer',
                            entityLabel: 'Customers',
                            surface: 'list',
                          })
                        }
                        className="cursor-pointer font-medium text-purple-700 focus:bg-purple-50 focus:text-purple-800"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Add field
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                    Show columns
                  </DropdownMenuLabel>
                  {toggleableColumns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={showColumn(col.key)}
                      onCheckedChange={() => toggleColumn(col.key)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                aria-label="More options"
                className="h-10 w-10 text-gray-500 hover:text-gray-700"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Customers Table */}
          <Table>
            <TableHeader>
              <TableRow>
                {showColumn('customer') && <TableHead>Customer</TableHead>}
                {showColumn('company') && <TableHead>Company</TableHead>}
                {showColumn('contact') && <TableHead>Contact</TableHead>}
                {showColumn('location') && <TableHead>Location</TableHead>}
                {showColumn('lifetimeValue') && <TableHead>Lifetime Value</TableHead>}
                {showColumn('lastContact') && <TableHead>Last Contact</TableHead>}
                {showColumn('status') && <TableHead>Status</TableHead>}
                {showColumn('activity') && <TableHead>Activity</TableHead>}
                {/* AI-added field columns */}
                {listFields.map(
                  (field) =>
                    showColumn(field.id) && (
                      <TableHead
                        key={field.id}
                        className={field.id === ai.lastAddedId ? 'field-added-glow' : undefined}
                      >
                        {field.label}
                      </TableHead>
                    ),
                )}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersToDisplay.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  {showColumn('customer') && (
                    <TableCell>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                    </TableCell>
                  )}
                  {showColumn('company') && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {customer.company}
                      </div>
                    </TableCell>
                  )}
                  {showColumn('contact') && (
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </TableCell>
                  )}
                  {showColumn('location') && (
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {customer.location}
                      </div>
                    </TableCell>
                  )}
                  {showColumn('lifetimeValue') && (
                    <TableCell>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(customer.lifetimeValue)}
                      </div>
                    </TableCell>
                  )}
                  {showColumn('lastContact') && <TableCell>{formatDate(customer.lastContact)}</TableCell>}
                  {showColumn('status') && <TableCell>{getStatusBadge(customer.status)}</TableCell>}
                  {showColumn('activity') && (
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        <div>{customer.estimatesCount} estimates</div>
                        <div>{customer.invoicesCount} invoices</div>
                      </div>
                    </TableCell>
                  )}
                  {/* AI-added field values (read-only on the list) */}
                  {listFields.map(
                    (field) =>
                      showColumn(field.id) && (
                        <TableCell
                          key={field.id}
                          className={`text-sm text-gray-600 ${
                            field.id === ai.lastAddedId ? 'field-added-glow' : ''
                          }`}
                        >
                          {formatFieldValue(field, ai.getValue('customer', customer.id, field.id))}
                        </TableCell>
                      ),
                  )}
                  <TableCell>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {customersToDisplay.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No customers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
