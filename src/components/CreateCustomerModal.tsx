import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  DollarSign,
  FileText,
  Save,
  User,
  CreditCard,
  Tag
} from 'lucide-react';
import { useState } from 'react';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCustomerModal({ isOpen, onClose }: CreateCustomerModalProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [customerData, setCustomerData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    
    // Contact Information
    email: '',
    phone: '',
    mobile: '',
    website: '',
    
    // Address Information
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Business Information
    customerType: 'individual',
    industry: '',
    referralSource: '',
    
    // Financial Information
    creditLimit: '',
    paymentTerms: '30',
    taxExempt: false,
    
    // Additional Information
    notes: '',
    tags: [] as string[],
    preferredContact: 'email'
  });

  const [newTag, setNewTag] = useState('');

  const industries = [
    'Construction',
    'Technology',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Professional Services',
    'Real Estate',
    'Education',
    'Finance',
    'Other'
  ];

  const referralSources = [
    'Website',
    'Referral',
    'Social Media',
    'Cold Call',
    'Trade Show',
    'Advertisement',
    'Google Search',
    'Other'
  ];

  const paymentTermsOptions = [
    { value: '0', label: 'Due on Receipt' },
    { value: '15', label: 'Net 15' },
    { value: '30', label: 'Net 30' },
    { value: '45', label: 'Net 45' },
    { value: '60', label: 'Net 60' }
  ];

  const addTag = () => {
    if (newTag.trim() && !customerData.tags.includes(newTag.trim())) {
      setCustomerData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCustomerData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    console.log('Saving customer:', customerData);
    // In a real app, this would save to the backend
    onClose();
    // Reset form
    setCustomerData({
      firstName: '',
      lastName: '',
      company: '',
      jobTitle: '',
      email: '',
      phone: '',
      mobile: '',
      website: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      customerType: 'individual',
      industry: '',
      referralSource: '',
      creditLimit: '',
      paymentTerms: '30',
      taxExempt: false,
      notes: '',
      tags: [],
      preferredContact: 'email'
    });
    setActiveTab('basic');
  };

  const isFormValid = () => {
    if (customerData.customerType === 'business') {
      return customerData.company && customerData.email;
    }
    return customerData.firstName && customerData.lastName && customerData.email;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add New Customer
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Create a new customer record in your CRM
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Additional
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={customerData.customerType === 'individual' ? 'default' : 'outline'}
                        onClick={() => setCustomerData(prev => ({ ...prev, customerType: 'individual' }))}
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <User className="w-6 h-6" />
                        <span>Individual</span>
                      </Button>
                      <Button
                        variant={customerData.customerType === 'business' ? 'default' : 'outline'}
                        onClick={() => setCustomerData(prev => ({ ...prev, customerType: 'business' }))}
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <Building2 className="w-6 h-6" />
                        <span>Business</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {customerData.customerType === 'individual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerData.firstName}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerData.lastName}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={customerData.company}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={customerData.jobTitle}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="CEO"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={customerData.company}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Contact First Name</Label>
                      <Input
                        id="firstName"
                        value={customerData.firstName}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Contact Last Name</Label>
                      <Input
                        id="lastName"
                        value={customerData.lastName}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="jobTitle">Contact Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={customerData.jobTitle}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="CEO"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@acme.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={customerData.mobile}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, mobile: e.target.value }))}
                      placeholder="(555) 987-6543"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={customerData.website}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.acme.com"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={customerData.street}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={customerData.city}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={customerData.state}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="NY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={customerData.zipCode}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="10001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={customerData.country} onValueChange={(value) => setCustomerData(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Business Information Tab */}
              <TabsContent value="business" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={customerData.industry} onValueChange={(value) => setCustomerData(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralSource">How did they find you?</Label>
                    <Select value={customerData.referralSource} onValueChange={(value) => setCustomerData(prev => ({ ...prev, referralSource: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {referralSources.map((source) => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                    <Select value={customerData.preferredContact} onValueChange={(value) => setCustomerData(prev => ({ ...prev, preferredContact: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="mail">Mail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Financial Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        value={customerData.creditLimit}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, creditLimit: e.target.value }))}
                        placeholder="10000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select value={customerData.paymentTerms} onValueChange={(value) => setCustomerData(prev => ({ ...prev, paymentTerms: value }))}>
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
                  </div>
                </div>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={customerData.notes}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional information about this customer..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      <Tag className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {customerData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customerData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!isFormValid()}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Customer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}