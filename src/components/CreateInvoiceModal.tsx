import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Calculator, 
  Calendar,
  User,
  Building2,
  DollarSign,
  Percent,
  Save,
  Send,
  Eye,
  CreditCard,
  Clock,
  FileText
} from 'lucide-react';
import { useState } from 'react';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceData, setInvoiceData] = useState({
    customer: '',
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    subject: '',
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
    taxRate: 8.5,
    discountType: 'none' as 'none' | 'percentage' | 'fixed',
    discountValue: 0,
    paymentTerms: '30',
    lateFeesEnabled: false,
    lateFeeAmount: 0,
    lateFeeType: 'fixed' as 'fixed' | 'percentage'
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  // Sample customers for dropdown
  const customers = [
    'Acme Corporation',
    'Tech Solutions Inc',
    'Global Industries',
    'StartupXYZ',
    'Local Business Co'
  ];

  const paymentTermsOptions = [
    { value: '0', label: 'Due on Receipt' },
    { value: '15', label: 'Net 15' },
    { value: '30', label: 'Net 30' },
    { value: '45', label: 'Net 45' },
    { value: '60', label: 'Net 60' }
  ];

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (invoiceData.discountType === 'percentage') {
      return subtotal * (invoiceData.discountValue / 100);
    } else if (invoiceData.discountType === 'fixed') {
      return invoiceData.discountValue;
    }
    return 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return (subtotal - discount) * (invoiceData.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const calculateDueDate = () => {
    const issueDate = new Date(invoiceData.issueDate);
    const daysToAdd = parseInt(invoiceData.paymentTerms);
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    setInvoiceData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSave = () => {
    console.log('Saving invoice:', { invoiceData, lineItems });
    // In a real app, this would save to the backend
    onClose();
  };

  const handleSend = () => {
    console.log('Sending invoice:', { invoiceData, lineItems });
    // In a real app, this would send the invoice to the customer
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Create New Invoice
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Generate an invoice for completed work or products delivered
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step <= currentStep ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Details' : step === 2 ? 'Line Items' : 'Review'}
                  </span>
                  {step < 3 && <div className="w-8 h-px bg-gray-300 ml-4" />}
                </div>
              ))}
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <Select value={invoiceData.customer} onValueChange={(value) => setInvoiceData(prev => ({ ...prev, customer: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={invoiceData.issueDate}
                      onChange={(e) => {
                        setInvoiceData(prev => ({ ...prev, issueDate: e.target.value }));
                        setTimeout(calculateDueDate, 100);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select 
                      value={invoiceData.paymentTerms} 
                      onValueChange={(value) => {
                        setInvoiceData(prev => ({ ...prev, paymentTerms: value }));
                        setTimeout(calculateDueDate, 100);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTermsOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of the work completed"
                    value={invoiceData.subject}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional information for the customer..."
                    rows={3}
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                {/* Late Fees Section */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <Clock className="w-5 h-5" />
                        Late Fees
                      </CardTitle>
                      <Switch
                        checked={invoiceData.lateFeesEnabled}
                        onCheckedChange={(checked) => setInvoiceData(prev => ({ ...prev, lateFeesEnabled: checked }))}
                      />
                    </div>
                  </CardHeader>
                  {invoiceData.lateFeesEnabled && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Late Fee Type</Label>
                          <Select 
                            value={invoiceData.lateFeeType} 
                            onValueChange={(value: 'fixed' | 'percentage') => setInvoiceData(prev => ({ ...prev, lateFeeType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                              <SelectItem value="percentage">Percentage of Total</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Late Fee Amount</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={invoiceData.lateFeeAmount}
                            onChange={(e) => setInvoiceData(prev => ({ ...prev, lateFeeAmount: parseFloat(e.target.value) || 0 }))}
                            placeholder={invoiceData.lateFeeType === 'percentage' ? '5.00' : '25.00'}
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            )}

            {/* Step 2: Line Items */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                  <Button onClick={addLineItem} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <Card key={item.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-5">
                            <Label className="text-sm font-medium">Description</Label>
                            <Input
                              placeholder="Service or product description"
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-sm font-medium">Quantity</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-sm font-medium">Rate</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-sm font-medium">Amount</Label>
                            <div className="text-lg font-semibold text-gray-900 py-2">
                              {formatCurrency(item.amount)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(item.id)}
                              disabled={lineItems.length === 1}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Totals Section */}
                <Card className="bg-gray-50 border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Discount Type</Label>
                          <Select value={invoiceData.discountType} onValueChange={(value: 'none' | 'percentage' | 'fixed') => setInvoiceData(prev => ({ ...prev, discountType: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Discount</SelectItem>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {invoiceData.discountType !== 'none' && (
                          <div className="space-y-2">
                            <Label>Discount Value</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={invoiceData.discountValue}
                              onChange={(e) => setInvoiceData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label>Tax Rate (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={invoiceData.taxRate}
                            onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        {invoiceData.discountType !== 'none' && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-{formatCurrency(calculateDiscount())}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Tax ({invoiceData.taxRate}%):</span>
                          <span>{formatCurrency(calculateTax())}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Invoice</h3>
                
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Invoice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Customer:</span>
                        <p className="text-gray-600">{invoiceData.customer}</p>
                      </div>
                      <div>
                        <span className="font-medium">Invoice #:</span>
                        <p className="text-gray-600">{invoiceData.invoiceNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium">Issue Date:</span>
                        <p className="text-gray-600">{invoiceData.issueDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p className="text-gray-600">{invoiceData.dueDate}</p>
                      </div>
                    </div>
                    {invoiceData.subject && (
                      <div>
                        <span className="font-medium text-sm">Subject:</span>
                        <p className="text-gray-600 text-sm">{invoiceData.subject}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Invoice Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lineItems.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.description}</p>
                            <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.rate)}</p>
                          </div>
                          <div className="font-semibold">{formatCurrency(item.amount)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      {invoiceData.discountType !== 'none' && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(calculateDiscount())}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(calculateTax())}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Options Preview */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CreditCard className="w-5 h-5" />
                      Payment Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700 mb-3">
                      Your customer will be able to pay this invoice using:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-white text-green-700 border-green-200">
                        Credit Card
                      </Badge>
                      <Badge variant="secondary" className="bg-white text-green-700 border-green-200">
                        Bank Transfer
                      </Badge>
                      <Badge variant="secondary" className="bg-white text-green-700 border-green-200">
                        Check
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                {currentStep < 3 ? (
                  <Button 
                    onClick={nextStep}
                    disabled={currentStep === 1 && !invoiceData.customer}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button>
                    <Button 
                      onClick={handleSend}
                      className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Invoice
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}