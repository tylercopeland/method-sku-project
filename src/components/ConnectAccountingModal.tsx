import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, CheckCircle, Users, FileText, Receipt, FolderSync as Sync, ArrowRight, Clock, Shield, Zap } from 'lucide-react';

interface ConnectAccountingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectAccountingModal({ isOpen, onClose }: ConnectAccountingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Connect QuickBooks
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Sync your accounting data with Method CRM
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Benefits Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">What gets synced automatically:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Customers</div>
                    <div className="text-xs text-gray-600">Contact info & history</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Estimates</div>
                    <div className="text-xs text-gray-600">Quotes & proposals</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Receipt className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Invoices</div>
                    <div className="text-xs text-gray-600">Billing & payments</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Items</div>
                    <div className="text-xs text-gray-600">Products & services</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Why connect QuickBooks?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Sync className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Real-time sync</div>
                    <div className="text-xs text-gray-600">Changes in QuickBooks appear instantly in Method</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Save time</div>
                    <div className="text-xs text-gray-600">No more double data entry between systems</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Secure connection</div>
                    <div className="text-xs text-gray-600">Bank-level encryption protects your data</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Setup Time */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-900">Quick Setup</span>
              </div>
              <p className="text-sm text-blue-800">
                Connection takes less than 5 minutes. We'll guide you through each step.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Watch Demo
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  Connect Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}