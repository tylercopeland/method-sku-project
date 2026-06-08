import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
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
  Eye
} from 'lucide-react';
import { useState } from 'react';

interface CreateEstimateModalProps {
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

export function CreateEstimateModal({ isOpen, onClose }: CreateEstimateModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [estimateData, setEstimateData] = useState({
    customer: '',
    estimateNumber: `EST-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    subject: '',
    notes: '',
    terms: 'Payment due within 30 days of acceptance.',
    taxRate: 8.5,
    discountType: 'none' as 'none' | 'percentage' | 'fixed',
    discountValue: 0
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
    if (estimateData.discountType === 'percentage') {
      return subtotal * (estimateData.discountValue / 100);
    } else if (estimateData.discountType === 'fixed') {
      return estimateData.discountValue;
    }
    return 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return (subtotal - discount) * (estimateData.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSave = () => {
    console.log('Saving estimate:', { estimateData, lineItems });
    // In a real app, this would save to the backend
    onClose();
  };

  const handleSend = () => {
    console.log('Sending estimate:', { estimateData, lineItems });
    // In a real app, this would send the estimate to the customer
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
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Create New Estimate
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Build a professional estimate for your customer
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step <= currentStep ? 'text-green-600' : 'text-gray-500'
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
                    <Select value={estimateData.customer} onValueChange={(value) => setEstimateData(prev => ({ ...prev, customer: value }))}>
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
                    <Label htmlFor="estimateNumber">Estimate Number</Label>
                    <Input
                      id="estimateNumber"
                      value={estimateData.estimateNumber}
                      onChange={(e) => setEstimateData(prev => ({ ...prev, estimateNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={estimateData.issueDate}
                      onChange={(e) => setEstimateData(prev => ({ ...prev, issueDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={estimateData.expiryDate}
                      onChange={(e) => setEstimateData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of the work"
                    value={estimateData.subject}
                    onChange={(e) => setEstimateData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional information for the customer..."
                    rows={3}
                    value={estimateData.notes}
                    onChange={(e) => setEstimateData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Line Items */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                  <Button onClick={addLineItem} className="bg-green-600 hover:bg-green-700 text-white">
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
                          <Select value={estimateData.discountType} onValueChange={(value: 'none' | 'percentage' | 'fixed') => setEstimateData(prev => ({ ...prev, discountType: value }))}>
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
                        
                        {estimateData.discountType !== 'none' && (
                          <div className="space-y-2">
                            <Label>Discount Value</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={estimateData.discountValue}
                              onChange={(e) => setEstimateData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
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
                            value={estimateData.taxRate}
                            onChange={(e) => setEstimateData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        {estimateData.discountType !== 'none' && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-{formatCurrency(calculateDiscount())}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Tax ({estimateData.taxRate}%):</span>
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
                <h3 className="text-lg font-semibold text-gray-900">Review Estimate</h3>
                
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Estimate Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Customer:</span>
                        <p className="text-gray-600">{estimateData.customer}</p>
                      </div>
                      <div>
                        <span className="font-medium">Estimate #:</span>
                        <p className="text-gray-600">{estimateData.estimateNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium">Issue Date:</span>
                        <p className="text-gray-600">{estimateData.issueDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Expiry Date:</span>
                        <p className="text-gray-600">{estimateData.expiryDate}</p>
                      </div>
                    </div>
                    {estimateData.subject && (
                      <div>
                        <span className="font-medium text-sm">Subject:</span>
                        <p className="text-gray-600 text-sm">{estimateData.subject}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Line Items</CardTitle>
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
                      {estimateData.discountType !== 'none' && (
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
                    disabled={currentStep === 1 && !estimateData.customer}
                    className="bg-green-600 hover:bg-green-700 text-white"
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
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Estimate
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