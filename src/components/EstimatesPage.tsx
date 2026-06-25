import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, Eye, Edit, Send, MoreHorizontal, FileText, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Estimate {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  dateCreated: string;
  expiryDate: string;
  description: string;
}

interface EstimatesPageProps {
  initialFilter?: string;
  /** Hide the value-prop banner above the screen (used when embedded in App Builder). */
  hideBanner?: boolean;
}

export function EstimatesPage({ initialFilter, hideBanner = false }: EstimatesPageProps) {
  const [statusFilter, setStatusFilter] = useState(initialFilter || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // Sample estimates data
  const estimates: Estimate[] = [
    {
      id: '1',
      number: 'EST-2024-001',
      customer: 'Acme Corporation',
      amount: 15000,
      status: 'pending',
      dateCreated: '2024-01-15',
      expiryDate: '2024-02-15',
      description: 'Website redesign and development'
    },
    {
      id: '2',
      number: 'EST-2024-002',
      customer: 'Tech Solutions Inc',
      amount: 8500,
      status: 'pending',
      dateCreated: '2024-01-18',
      expiryDate: '2024-02-18',
      description: 'Mobile app development'
    },
    {
      id: '3',
      number: 'EST-2024-003',
      customer: 'Global Industries',
      amount: 21500,
      status: 'pending',
      dateCreated: '2024-01-20',
      expiryDate: '2024-02-20',
      description: 'Enterprise software integration'
    },
    {
      id: '4',
      number: 'EST-2024-004',
      customer: 'StartupXYZ',
      amount: 5200,
      status: 'accepted',
      dateCreated: '2024-01-10',
      expiryDate: '2024-02-10',
      description: 'Brand identity package'
    },
    {
      id: '5',
      number: 'EST-2024-005',
      customer: 'Local Business Co',
      amount: 3800,
      status: 'declined',
      dateCreated: '2024-01-08',
      expiryDate: '2024-02-08',
      description: 'Social media management'
    }
  ];

  // Filter estimates based on status and search term
  const filteredEstimates = estimates.filter(estimate => {
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    const matchesSearch = estimate.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      accepted: { variant: 'secondary' as const, color: 'bg-green-100 text-green-800 border-green-200' },
      declined: { variant: 'secondary' as const, color: 'bg-red-100 text-red-800 border-red-200' },
      expired: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 border-gray-200' }
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
  const pendingEstimates = estimates.filter(e => e.status === 'pending');
  const totalPendingValue = pendingEstimates.reduce((sum, e) => sum + e.amount, 0);

  // Value proposition for Estimates
  const estimatesValueProps = {
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    title: 'Create Professional Estimates Faster',
    description: 'Estimates helps you quote jobs quickly and accurately. Send professional estimates to customers and track their status from creation to acceptance.',
    valueProps: [
      'Create and send professional estimates in seconds',
      'Track estimate status and see which quotes are pending',
      'Convert accepted estimates directly to invoices',
      'Get notified when customers view or accept your estimates'
    ],
    primaryAction: {
      label: 'Create New Estimate',
      onClick: () => console.log('Create estimate')
    },
    secondaryAction: {
      label: 'Learn More',
      onClick: () => console.log('Learn more')
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Value Proposition Banner */}
      {!dismissedBanner && !hideBanner && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4">
                  <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-sm w-fit mb-3">
                    {estimatesValueProps.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{estimatesValueProps.title}</h3>
                  <p className="text-sm text-gray-600">{estimatesValueProps.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {estimatesValueProps.valueProps.map((prop, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{prop}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-start mt-4">
                  {estimatesValueProps.primaryAction && (
                    <Button
                      onClick={estimatesValueProps.primaryAction.onClick}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {estimatesValueProps.primaryAction.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {estimatesValueProps.secondaryAction && (
                    <Button
                      onClick={estimatesValueProps.secondaryAction.onClick}
                      variant="outline"
                      size="lg"
                      className="px-6 py-4 text-sm border-2 hover:bg-gray-50"
                    >
                      {estimatesValueProps.secondaryAction.label}
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
              <div className="text-sm text-gray-600">Total Estimates</div>
              <div className="text-2xl font-semibold text-gray-900">{estimates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-semibold text-yellow-600">{pendingEstimates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Pending Value</div>
              <div className="text-2xl font-semibold text-green-600">{formatCurrency(totalPendingValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Accepted</div>
              <div className="text-2xl font-semibold text-green-600">
                {estimates.filter(e => e.status === 'accepted').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Estimates</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Estimate
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <CardTitle>All Estimates</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search estimates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estimates Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estimate #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstimates.map((estimate) => (
                <TableRow key={estimate.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{estimate.number}</TableCell>
                  <TableCell>{estimate.customer}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{estimate.description}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(estimate.amount)}</TableCell>
                  <TableCell>{getStatusBadge(estimate.status)}</TableCell>
                  <TableCell>{formatDate(estimate.dateCreated)}</TableCell>
                  <TableCell>{formatDate(estimate.expiryDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {estimate.status === 'pending' && (
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredEstimates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No estimates found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}