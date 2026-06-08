import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageCircle, Calendar, Phone, Mail, HelpCircle } from 'lucide-react';

export function SupportCTA() {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <HelpCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Need help getting set up?</h3>
              <p className="text-muted-foreground">
                Our team is here to help you succeed with Method CRM. Get personalized guidance to maximize your results.
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-orange-200 hover:bg-orange-50">
                  <MessageCircle className="w-4 h-4" />
                  Get Help
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Choose how you'd like to get help:</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start hover:bg-blue-50">
                      <MessageCircle className="w-4 h-4 mr-3 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Chat with support</div>
                        <div className="text-xs text-muted-foreground">Get instant help</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-green-50">
                      <Calendar className="w-4 h-4 mr-3 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium">Book a 15-min call</div>
                        <div className="text-xs text-muted-foreground">Personalized guidance</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-purple-50">
                      <Phone className="w-4 h-4 mr-3 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">Call us now</div>
                        <div className="text-xs text-muted-foreground">Immediate assistance</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
                      <Mail className="w-4 h-4 mr-3 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium">Email support</div>
                        <div className="text-xs text-muted-foreground">Detailed help</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Book Call
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}