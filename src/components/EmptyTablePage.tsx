import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, MoreHorizontal, X, CheckCircle2, FileText, Users, Lightbulb, List, Receipt, Lock, Store, Sparkles, ArrowLeft, ArrowRight, Phone, Mail, MapPin, Building2, Calendar, DollarSign, Activity, Clock, Target, TrendingUp, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface EmptyTablePageProps {
  page: string;
  showSampleData?: boolean;
  showBanner?: boolean;
}

// Detail View Components
function ActivityDetailView({ activity, onBack }: { activity: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Activities
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Activity
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" />
            {activity.subject}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Activity Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <p className="font-medium">{activity.type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-medium">{activity.customer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <p className="font-medium">{activity.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700">
                This is a sample activity that demonstrates the detailed view functionality. 
                In a real application, this would contain the full activity description and notes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VendorDetailView({ vendor, onBack }: { vendor: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Vendor
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-green-600" />
            {vendor.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Company:</span>
                    <p className="font-medium">{vendor.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium text-blue-600">{vendor.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <p className="font-medium">{vendor.location}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                    {vendor.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Purchase History</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Total Orders: <span className="font-medium text-gray-900">12</span></div>
                <div className="text-sm text-gray-600">Total Spent: <span className="font-medium text-green-600">$24,500</span></div>
                <div className="text-sm text-gray-600">Last Order: <span className="font-medium text-gray-900">Dec 15, 2024</span></div>
                <div className="text-sm text-gray-600">Average Order: <span className="font-medium text-gray-900">$2,042</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OpportunityDetailView({ opportunity, onBack }: { opportunity: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Opportunity
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-purple-600" />
            {opportunity.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Opportunity Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-medium">{opportunity.customer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Stage:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {opportunity.stage}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Value:</span>
                  <p className="font-medium text-green-600">{opportunity.value}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Probability:</span>
                  <p className="font-medium">{opportunity.probability}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Close Date:</span>
                  <p className="font-medium">{opportunity.closeDate}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Initial Contact</p>
                    <p className="text-xs text-gray-600">Dec 1, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Needs Assessment</p>
                    <p className="text-xs text-gray-600">Dec 10, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Proposal Sent</p>
                    <p className="text-xs text-gray-600">Jan 5, 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Follow up on proposal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Schedule demo call</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Negotiate terms</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeadDetailView({ lead, onBack }: { lead: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Web to Lead
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Lead
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Users className="w-4 h-4 mr-2" />
            Convert to Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-600" />
            {lead.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Lead Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium text-blue-600">{lead.email}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Source:</span>
                  <p className="font-medium">{lead.source}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="secondary" className={lead.status === 'New' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {lead.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date Received:</span>
                  <p className="font-medium">{lead.date}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Lead Score</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-lg font-semibold text-green-600">85/100</span>
                </div>
                <p className="text-sm text-gray-600">High quality lead based on engagement and profile match</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Email engagement:</span>
                    <span className="font-medium ml-2">High</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Company size:</span>
                    <span className="font-medium ml-2">Medium</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Industry match:</span>
                    <span className="font-medium ml-2">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceDetailView({ invoice, onBack }: { invoice: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Invoice
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Mail className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            Invoice {invoice.number}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Invoice Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-medium">{invoice.customer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Amount:</span>
                  <p className="font-medium text-green-600">{invoice.amount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="secondary" className={
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {invoice.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Invoice Date:</span>
                  <p className="font-medium">{invoice.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <p className="font-medium">{invoice.dueDate}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Line Items</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Consulting Services</span>
                  <span className="font-medium">$2,500.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Development Work</span>
                  <span className="font-medium">$2,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Project Management</span>
                  <span className="font-medium">$747.50</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-green-600">{invoice.amount}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
              {invoice.status === 'Paid' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Payment received</span>
                  </div>
                  <p className="text-sm text-gray-600">Paid on {invoice.date}</p>
                  <p className="text-sm text-gray-600">Method: Bank Transfer</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Payment pending</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {invoice.status === 'Overdue' ? 'Payment overdue' : 'Awaiting payment'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesReceiptDetailView({ receipt, onBack }: { receipt: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Sales Receipts
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Receipt
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Receipt className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-green-600" />
            Sales Receipt {receipt.number}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Receipt Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-medium">{receipt.customer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Amount:</span>
                  <p className="font-medium text-green-600">{receipt.amount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{receipt.method}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium">{receipt.date}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Transaction Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">{receipt.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Paid:</span>
                    <span className="text-green-600">{receipt.amount}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Payment Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentDetailView({ payment, onBack }: { payment: any, onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Payments
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Payment
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Receipt className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            Payment {payment.number}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-medium">{payment.customer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Invoice:</span>
                  <p className="font-medium text-blue-600">{payment.invoice}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Amount:</span>
                  <p className="font-medium text-green-600">{payment.amount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{payment.method}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium">{payment.date}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Status</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Payment Processed</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Successfully applied to invoice</p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium ml-2">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Processing fee:</span>
                    <span className="font-medium ml-2">$2.50</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Net amount:</span>
                    <span className="font-medium ml-2 text-green-600">{payment.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyTablePage({ page, showSampleData = false, showBanner = true }: EmptyTablePageProps) {
  const [dismissedBanners, setDismissedBanners] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Show detail view if an item is selected
  if (selectedItem) {
    switch (page) {
      case 'activities':
        return <ActivityDetailView activity={selectedItem} onBack={() => setSelectedItem(null)} />;
      case 'vendors':
        return <VendorDetailView vendor={selectedItem} onBack={() => setSelectedItem(null)} />;
      case 'opportunities':
        return <OpportunityDetailView opportunity={selectedItem} onBack={() => setSelectedItem(null)} />;
      case 'web-to-lead':
        return <LeadDetailView lead={selectedItem} onBack={() => setSelectedItem(null)} />;
      case 'invoices':
        return <InvoiceDetailView invoice={selectedItem} onBack={() => setSelectedItem(null)} />;
      case 'sales-receipts':
        return <SalesReceiptDetailView receipt={selectedItem} onBack={() => setSelectedItem(null)} />;
      case 'payments':
        return <PaymentDetailView payment={selectedItem} onBack={() => setSelectedItem(null)} />;
      default:
        return <div>Detail view not available</div>;
    }
  }
  const getTableConfig = () => {
    switch (page) {
      case 'activities':
        return {
          title: 'Activities',
          headers: ['Type', 'Subject', 'Customer', 'Date', 'Status', 'Actions'],
          addButtonLabel: 'Log Activity'
        };
      case 'vendors':
        return {
          title: 'Vendors',
          headers: ['Name', 'Company', 'Contact', 'Location', 'Status', 'Actions'],
          addButtonLabel: 'Add Vendor'
        };
      case 'opportunities':
        return {
          title: 'Opportunities',
          headers: ['Name', 'Customer', 'Stage', 'Value', 'Probability', 'Close Date', 'Actions'],
          addButtonLabel: 'Create Opportunity'
        };
      case 'web-to-lead':
        return {
          title: 'Web to Lead',
          headers: ['Name', 'Email', 'Source', 'Status', 'Date', 'Actions'],
          addButtonLabel: 'Setup Web to Lead'
        };
      case 'invoices':
        return {
          title: 'Invoices',
          headers: ['Invoice #', 'Customer', 'Amount', 'Status', 'Date', 'Due Date', 'Actions'],
          addButtonLabel: 'Create Invoice'
        };
      case 'sales-receipts':
        return {
          title: 'Sales Receipts',
          headers: ['Receipt #', 'Customer', 'Amount', 'Payment Method', 'Date', 'Actions'],
          addButtonLabel: 'Create Sales Receipt'
        };
      case 'payments':
        return {
          title: 'Payments',
          headers: ['Payment #', 'Customer', 'Invoice', 'Amount', 'Method', 'Date', 'Actions'],
          addButtonLabel: 'Record Payment'
        };
      case 'marketplace':
        return {
          title: 'App Marketplace',
          headers: ['App Name', 'Category', 'Rating', 'Status', 'Actions'],
          addButtonLabel: 'Browse Apps'
        };
      default:
        return {
          title: 'Items',
          headers: ['Name', 'Status', 'Actions'],
          addButtonLabel: 'Add Item'
        };
    }
  };

  const getValueProposition = () => {
    switch (page) {
      case 'activities':
        return {
          icon: <FileText className="w-5 h-5 text-blue-600" />,
          title: 'Track Every Customer Interaction',
          description: 'Activities helps you maintain a complete history of all customer communications, meetings, and follow-ups in one centralized place.',
          valueProps: [
            'Log calls, emails, meetings, and notes automatically',
            'Set follow-up reminders to never miss an opportunity',
            'View complete interaction history for each customer',
            'Sync activities across your team for better collaboration'
          ],
          primaryAction: {
            label: 'Log Your First Activity',
            onClick: () => console.log('Log activity')
          },
          secondaryAction: {
            label: 'Learn More',
            onClick: () => console.log('Learn more')
          }
        };
      case 'vendors':
        return {
          icon: <Users className="w-5 h-5 text-green-600" />,
          title: 'Manage Your Vendor Relationships',
          description: 'Keep track of all your suppliers, contractors, and vendors in one organized system. Build stronger relationships and streamline procurement.',
          valueProps: [
            'Store vendor contact information and details',
            'Track purchase history and spending patterns',
            'Manage vendor contracts and agreements',
            'Streamline procurement and ordering processes'
          ],
          primaryAction: {
            label: 'Add Your First Vendor',
            onClick: () => console.log('Add vendor')
          },
          secondaryAction: {
            label: 'Import Vendors',
            onClick: () => console.log('Import vendors')
          }
        };
      case 'opportunities':
        return {
          icon: <Lightbulb className="w-5 h-5 text-yellow-600" />,
          title: 'Turn Leads Into Revenue',
          description: 'Opportunities helps you track potential deals from initial contact through to close. Never lose a sale due to poor follow-up.',
          valueProps: [
            'Track deal stages and probability of closing',
            'Set revenue targets and forecast accurately',
            'Identify your best sales opportunities',
            'Automate follow-ups to keep deals moving forward'
          ],
          primaryAction: {
            label: 'Create Your First Opportunity',
            onClick: () => console.log('Create opportunity')
          },
          secondaryAction: {
            label: 'View Sales Pipeline',
            onClick: () => console.log('View pipeline')
          }
        };
      case 'web-to-lead':
        return {
          icon: <List className="w-5 h-5 text-purple-600" />,
          title: 'Capture Leads Automatically',
          description: 'Web to Lead automatically captures leads from your website forms and adds them directly to Method. No manual data entry required.',
          valueProps: [
            'Capture leads 24/7 from your website forms',
            'Automatically create customer records',
            'Get instant notifications for new leads',
            'Route leads to the right team members automatically'
          ],
          primaryAction: {
            label: 'Set Up Web Forms',
            onClick: () => console.log('Setup forms')
          },
          secondaryAction: {
            label: 'View Integration Guide',
            onClick: () => console.log('View guide')
          }
        };
      case 'invoices':
        return {
          icon: <Receipt className="w-5 h-5 text-indigo-600" />,
          title: 'Get Paid Faster with Professional Invoices',
          description: 'Create, send, and track invoices effortlessly. Accept online payments and get paid 2x faster with automated reminders.',
          valueProps: [
            'Create professional invoices in seconds',
            'Accept online payments directly through invoices',
            'Send automatic payment reminders',
            'Track invoice status and payment history'
          ],
          primaryAction: {
            label: 'Create Your First Invoice',
            onClick: () => console.log('Create invoice')
          },
          secondaryAction: {
            label: 'Learn About Online Payments',
            onClick: () => console.log('Learn payments')
          }
        };
      case 'sales-receipts':
        return {
          icon: <List className="w-5 h-5 text-teal-600" />,
          title: 'Record Sales Instantly',
          description: 'Sales Receipts lets you record completed sales transactions immediately. Perfect for point-of-sale and same-day transactions.',
          valueProps: [
            'Record sales transactions on the spot',
            'Generate receipts for customers instantly',
            'Track cash and card payments',
            'Sync with your accounting automatically'
          ],
          primaryAction: {
            label: 'Create Sales Receipt',
            onClick: () => console.log('Create receipt')
          },
          secondaryAction: {
            label: 'View Receipt History',
            onClick: () => console.log('View history')
          }
        };
      case 'payments':
        return {
          icon: <Lock className="w-5 h-5 text-emerald-600" />,
          title: 'Streamline Payment Processing',
          description: 'Payments helps you track, process, and reconcile customer payments efficiently. Reduce late payments and improve cash flow.',
          valueProps: [
            'Track all customer payments in one place',
            'Process online and offline payments',
            'Automatically match payments to invoices',
            'Generate payment reports and insights'
          ],
          primaryAction: {
            label: 'Record Payment',
            onClick: () => console.log('Record payment')
          },
          secondaryAction: {
            label: 'Set Up Payment Processing',
            onClick: () => console.log('Setup processing')
          }
        };
      case 'marketplace':
        return {
          icon: <Store className="w-5 h-5 text-orange-600" />,
          title: 'Extend Method with Powerful Apps',
          description: 'Discover apps that integrate seamlessly with Method to add new capabilities and streamline your workflow.',
          valueProps: [
            'Connect with popular business tools',
            'Automate workflows between apps',
            'Add specialized features for your industry',
            'All apps sync automatically with Method'
          ],
          primaryAction: {
            label: 'Browse Apps',
            onClick: () => console.log('Browse apps')
          },
          secondaryAction: {
            label: 'View Popular Integrations',
            onClick: () => console.log('View integrations')
          }
        };
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-gray-400" />,
          title: 'Coming Soon',
          description: 'This feature is under development and will be available soon.',
          valueProps: []
        };
    }
  };

  // Main sample contact reference - all sample data ties back to this
  const MAIN_SAMPLE_CUSTOMER = 'Demo Customer';
  const MAIN_SAMPLE_COMPANY = 'Example Company Inc';

  const getSampleData = () => {
    switch (page) {
      case 'activities':
        return [
          { type: 'Follow-up', subject: '[Sample Data] Follow-up with Demo Customer', customer: MAIN_SAMPLE_CUSTOMER, date: 'Today at 05:00pm', status: 'Not started' },
          { type: 'Meeting', subject: '[Sample Data] Meet with Demo Customer', customer: MAIN_SAMPLE_CUSTOMER, date: 'Tomorrow at 05:00pm', status: 'Not started' },
          { type: 'Email', subject: '[Sample Data] Send a follow-up email', customer: MAIN_SAMPLE_CUSTOMER, date: 'Dec-13-2025 05:00 PM', status: 'Not started' }
        ];
      case 'vendors':
        return [
          { name: '[Sample Data] Demo Vendor', company: MAIN_SAMPLE_COMPANY, contact: 'vendor@example.com', location: 'San Francisco, CA', status: 'Active' }
        ];
      case 'opportunities':
        return [
          { name: '[Sample Data] Project Opportunity', customer: MAIN_SAMPLE_CUSTOMER, stage: 'Proposal', value: '$50,000', probability: '75%', closeDate: 'Feb 15, 2025' }
        ];
      case 'web-to-lead':
        return [
          { name: '[Sample Data] Demo Customer', email: 'demo@example.com', source: 'Website Form', status: 'New', date: 'Jan 5, 2025' }
        ];
      case 'invoices':
        return [
          { number: 'INV-1001', customer: 'Acme Corporation', amount: '$5,247.50', status: 'Paid', date: 'Dec 15, 2024', dueDate: 'Jan 14, 2025' },
          { number: 'INV-1002', customer: 'Tech Solutions LLC', amount: '$3,890.00', status: 'Sent', date: 'Dec 22, 2024', dueDate: 'Jan 21, 2025' },
          { number: 'INV-1003', customer: 'Global Industries', amount: '$7,125.75', status: 'Paid', date: 'Dec 28, 2024', dueDate: 'Jan 27, 2025' },
          { number: 'INV-1004', customer: 'Metro Services', amount: '$2,450.00', status: 'Overdue', date: 'Nov 30, 2024', dueDate: 'Dec 30, 2024' },
          { number: 'INV-1005', customer: 'Sunrise Consulting', amount: '$4,680.25', status: 'Sent', date: 'Jan 5, 2025', dueDate: 'Feb 4, 2025' },
          { number: 'INV-1006', customer: 'Digital Solutions Inc', amount: '$6,200.00', status: 'Paid', date: 'Jan 10, 2025', dueDate: 'Feb 9, 2025' },
          { number: 'INV-1007', customer: 'Creative Agency', amount: '$3,150.50', status: 'Sent', date: 'Jan 12, 2025', dueDate: 'Feb 11, 2025' },
          { number: 'INV-1008', customer: 'Manufacturing Plus', amount: '$8,900.00', status: 'Paid', date: 'Jan 8, 2025', dueDate: 'Feb 7, 2025' }
        ];
      case 'sales-receipts':
        return [
          { number: '[Sample Data] SR-001', customer: MAIN_SAMPLE_CUSTOMER, amount: '$250.00', method: 'Credit Card', date: 'Jan 5, 2025' }
        ];
      case 'payments':
        return [
          { number: '[Sample Data] PAY-001', customer: MAIN_SAMPLE_COMPANY, invoice: 'INV-1001', amount: '$5,000.00', method: 'ACH', date: 'Jan 2, 2025' }
        ];
      case 'marketplace':
        return [
          { name: '[Sample Data] Email Integration', category: 'Communication', rating: '4.8', status: 'Installed' }
        ];
      default:
        return [];
    }
  };

  const config = getTableConfig();
  const sampleData = showSampleData ? getSampleData() : [];
  const valueProps = getValueProposition();

  // Get empty state configuration for when no sample data is shown
  const getEmptyStateConfig = () => {
    switch (page) {
      case 'activities':
        return {
          icon: <Activity className="w-6 h-6 text-blue-600" />,
          title: 'No activities logged',
          description: 'Start tracking interactions with your customers',
          actionLabel: 'Log Activity'
        };
      case 'vendors':
        return {
          icon: <Users className="w-6 h-6 text-green-600" />,
          title: 'No vendors yet',
          description: 'Add your first vendor to get started',
          actionLabel: 'Add Vendor'
        };
      case 'opportunities':
        return {
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          title: 'No opportunities yet',
          description: 'Create your first opportunity to track potential deals',
          actionLabel: 'Create Opportunity'
        };
      case 'web-to-lead':
        return {
          icon: <List className="w-6 h-6 text-purple-600" />,
          title: 'No leads captured',
          description: 'Set up web forms to automatically capture leads',
          actionLabel: 'Setup Web to Lead'
        };
      case 'invoices':
        return {
          icon: <Receipt className="w-6 h-6 text-indigo-600" />,
          title: 'No invoices yet',
          description: 'Create your first invoice to get paid faster',
          actionLabel: 'Create Invoice'
        };
      case 'sales-receipts':
        return {
          icon: <Receipt className="w-6 h-6 text-teal-600" />,
          title: 'No sales receipts yet',
          description: 'Record your first sales receipt',
          actionLabel: 'Create Sales Receipt'
        };
      case 'payments':
        return {
          icon: <DollarSign className="w-6 h-6 text-green-600" />,
          title: 'No payments recorded',
          description: 'Track payments from your customers',
          actionLabel: 'Record Payment'
        };
      case 'marketplace':
        return {
          icon: <Store className="w-6 h-6 text-orange-600" />,
          title: 'No apps installed',
          description: 'Browse the marketplace to extend Method',
          actionLabel: 'Browse Apps'
        };
      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-gray-400" />,
          title: 'No items found',
          description: 'Add your first item to get started',
          actionLabel: 'Add Item'
        };
    }
  };

  const renderTableCell = (value: string, index: number) => {
    // Check if it's a status field and style accordingly
    if (value === 'Active' || value === 'Completed' || value === 'Paid' || value === 'Installed') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          {value}
        </Badge>
      );
    }
    if (value === 'Pending' || value === 'Sent' || value === 'New' || value === 'Available') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
          {value}
        </Badge>
      );
    }
    if (value === 'Contacted') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
          {value}
        </Badge>
      );
    }
    if (value === 'Not started') {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
          {value}
        </Badge>
      );
    }
    if (value === 'Overdue') {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
          {value}
        </Badge>
      );
    }
    return <span>{value}</span>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Value Proposition Banner - Show when showBanner is true (for both sample-data and no-sample-data modes) */}
        {showBanner && !dismissedBanners[page] && valueProps.valueProps.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-sm w-fit mb-3">
                      {valueProps.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{valueProps.title}</h3>
                    <p className="text-sm text-gray-600">{valueProps.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {valueProps.valueProps.map((prop, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{prop}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-start mt-4">
                    {valueProps.primaryAction && (
                      <Button
                        onClick={valueProps.primaryAction.onClick}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {valueProps.primaryAction.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    {valueProps.secondaryAction && (
                      <Button
                        onClick={valueProps.secondaryAction.onClick}
                        variant="outline"
                        size="lg"
                        className="px-6 py-4 text-sm border-2 hover:bg-gray-50"
                      >
                        {valueProps.secondaryAction.label}
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDismissedBanners(prev => ({ ...prev, [page]: true }))}
                  className="ml-4 h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">{config.title}</CardTitle>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {config.addButtonLabel}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {config.headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {showSampleData && sampleData.length > 0 ? (
                  sampleData.map((row, rowIndex) => (
                    <TableRow 
                      key={rowIndex} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => setSelectedItem(row)}
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {renderTableCell(value, cellIndex)}
                        </TableCell>
                      ))}
                      {config.headers.includes('Actions') && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(row);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={config.headers.length} className="p-0">
                      {(() => {
                        const emptyState = getEmptyStateConfig();
                        return (
                          <div className="text-center py-12 px-6">
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
                              {emptyState.actionLabel}
                            </Button>
                          </div>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

