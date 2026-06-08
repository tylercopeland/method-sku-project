import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  UserPlus, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Users,
  Mail,
  Phone,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Target,
  Plus,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const [activeTab, setActiveTab] = useState('manual');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
      }
    }
  };

  const handleImport = () => {
    setImportStatus('processing');
    // Simulate import process
    setTimeout(() => {
      setImportStatus('success');
      setTimeout(() => {
        onClose();
        setImportStatus('idle');
        setUploadedFile(null);
      }, 2000);
    }, 2000);
  };

  const handleManualSubmit = () => {
    // Simulate adding lead
    console.log('Adding lead:', formData);
    onClose();
    // Reset form
    setFormData({
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

  const downloadTemplate = () => {
    const csvContent = `First Name,Last Name,Company,Email,Phone,Address,Estimated Value,Expected Close Date,Lead Source,Notes
John,Smith,Acme Corp,john@acme.com,(555) 123-4567,"123 Main St, City, State",15000,2024-03-15,Website,Interested in our premium package
Sarah,Johnson,Tech Solutions,sarah@techsol.com,(555) 234-5678,"456 Oak Ave, City, State",8500,2024-02-28,Referral,Needs consultation on implementation`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add Your First Lead
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Start tracking potential customers and opportunities
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
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
              <TabsContent value="manual" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@acme.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadSource">Lead Source</Label>
                    <Select value={formData.leadSource} onValueChange={(value) => setFormData(prev => ({ ...prev, leadSource: value }))}>
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
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                      placeholder="$15,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={formData.expectedCloseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional information about this lead..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleManualSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!formData.firstName || !formData.lastName || !formData.email}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              </TabsContent>

              {/* Import CSV Tab */}
              <TabsContent value="import" className="mt-6 space-y-6">
                {/* Template Download */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Download Template</h4>
                      <p className="text-sm text-blue-700">
                        Use our CSV template to ensure your data imports correctly
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={downloadTemplate}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50'
                      : uploadedFile
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">File Ready to Import</h3>
                        <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setUploadedFile(null)}
                          className="text-gray-600"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                        <Button
                          onClick={handleImport}
                          disabled={importStatus === 'processing'}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {importStatus === 'processing' ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Import Leads
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Upload CSV File</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Drag and drop your CSV file here, or click to browse
                        </p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileInput}
                          className="hidden"
                          id="csv-upload"
                        />
                        <label htmlFor="csv-upload">
                          <Button variant="outline" className="cursor-pointer" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Import Status */}
                {importStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Import Successful!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your leads have been imported and are now available in your CRM.
                    </p>
                  </div>
                )}

                {/* CSV Format Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Required columns: First Name, Last Name, Email</p>
                    <p>• Optional columns: Company, Phone, Address, Estimated Value, Expected Close Date, Lead Source, Notes</p>
                    <p>• Use comma-separated values (.csv format)</p>
                    <p>• First row should contain column headers</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <div className="text-sm text-gray-500">
                    Upload a CSV file to import multiple leads at once
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}