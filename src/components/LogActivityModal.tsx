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
  Activity, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  MapPin,
  Video,
  Coffee,
  Handshake,
  Save,
  Plus,
  User,
  Building2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogActivityModal({ isOpen, onClose }: LogActivityModalProps) {
  const [activityData, setActivityData] = useState({
    type: '',
    customer: '',
    subject: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    duration: '',
    location: '',
    outcome: '',
    priority: 'medium',
    completed: false,
    followUpRequired: false,
    followUpDate: '',
    followUpNotes: '',
    participants: [] as string[],
    attachments: [] as string[]
  });

  const [newParticipant, setNewParticipant] = useState('');

  // Sample customers for dropdown
  const customers = [
    'Acme Corporation',
    'Tech Solutions Inc',
    'Global Industries',
    'StartupXYZ',
    'Local Business Co'
  ];

  const activityTypes = [
    { value: 'call', label: 'Phone Call', icon: <Phone className="w-4 h-4" />, color: 'text-blue-600' },
    { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, color: 'text-green-600' },
    { value: 'meeting', label: 'Meeting', icon: <Users className="w-4 h-4" />, color: 'text-purple-600' },
    { value: 'video-call', label: 'Video Call', icon: <Video className="w-4 h-4" />, color: 'text-indigo-600' },
    { value: 'site-visit', label: 'Site Visit', icon: <MapPin className="w-4 h-4" />, color: 'text-orange-600' },
    { value: 'lunch', label: 'Lunch/Coffee', icon: <Coffee className="w-4 h-4" />, color: 'text-amber-600' },
    { value: 'proposal', label: 'Proposal Sent', icon: <FileText className="w-4 h-4" />, color: 'text-teal-600' },
    { value: 'follow-up', label: 'Follow-up', icon: <Clock className="w-4 h-4" />, color: 'text-gray-600' },
    { value: 'contract', label: 'Contract Signed', icon: <Handshake className="w-4 h-4" />, color: 'text-emerald-600' }
  ];

  const outcomes = [
    'Successful',
    'Needs Follow-up',
    'No Answer',
    'Voicemail Left',
    'Meeting Scheduled',
    'Proposal Requested',
    'Not Interested',
    'Postponed',
    'Completed'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const addParticipant = () => {
    if (newParticipant.trim() && !activityData.participants.includes(newParticipant.trim())) {
      setActivityData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const removeParticipant = (participantToRemove: string) => {
    setActivityData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participantToRemove)
    }));
  };

  const handleSave = () => {
    console.log('Saving activity:', activityData);
    // In a real app, this would save to the backend
    onClose();
    // Reset form
    setActivityData({
      type: '',
      customer: '',
      subject: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      duration: '',
      location: '',
      outcome: '',
      priority: 'medium',
      completed: false,
      followUpRequired: false,
      followUpDate: '',
      followUpNotes: '',
      participants: [],
      attachments: []
    });
  };

  const getSelectedActivityType = () => {
    return activityTypes.find(type => type.value === activityData.type);
  };

  const isFormValid = () => {
    return activityData.type && activityData.customer && activityData.subject;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Log Customer Activity
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Record interactions and communications with your customers
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Activity Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {activityTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={activityData.type === type.value ? 'default' : 'outline'}
                      onClick={() => setActivityData(prev => ({ ...prev, type: type.value }))}
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${
                        activityData.type === type.value ? '' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={type.color}>
                        {type.icon}
                      </div>
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select value={activityData.customer} onValueChange={(value) => setActivityData(prev => ({ ...prev, customer: value }))}>
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
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={activityData.subject}
                  onChange={(e) => setActivityData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of the activity"
                />
              </div>
            </div>

            {/* Date, Time, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={activityData.date}
                  onChange={(e) => setActivityData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={activityData.time}
                  onChange={(e) => setActivityData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={activityData.duration}
                  onChange={(e) => setActivityData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>

            {/* Location and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={activityData.location}
                  onChange={(e) => setActivityData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Office, Customer site, Phone, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={activityData.priority} onValueChange={(value) => setActivityData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={priority.color}>
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={activityData.description}
                onChange={(e) => setActivityData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed notes about the activity..."
                rows={4}
              />
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <Label>Participants</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder="Add participant name..."
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                />
                <Button onClick={addParticipant} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {activityData.participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activityData.participants.map((participant) => (
                    <Badge key={participant} variant="secondary" className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {participant}
                      <button
                        onClick={() => removeParticipant(participant)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Outcome and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Select value={activityData.outcome} onValueChange={(value) => setActivityData(prev => ({ ...prev, outcome: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    {outcomes.map((outcome) => (
                      <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="completed"
                    checked={activityData.completed}
                    onCheckedChange={(checked) => setActivityData(prev => ({ ...prev, completed: checked }))}
                  />
                  <Label htmlFor="completed" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark as completed
                  </Label>
                </div>
              </div>
            </div>

            {/* Follow-up Section */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Clock className="w-5 h-5" />
                    Follow-up Required
                  </CardTitle>
                  <Switch
                    checked={activityData.followUpRequired}
                    onCheckedChange={(checked) => setActivityData(prev => ({ ...prev, followUpRequired: checked }))}
                  />
                </div>
              </CardHeader>
              {activityData.followUpRequired && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={activityData.followUpDate}
                      onChange={(e) => setActivityData(prev => ({ ...prev, followUpDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followUpNotes">Follow-up Notes</Label>
                    <Textarea
                      id="followUpNotes"
                      value={activityData.followUpNotes}
                      onChange={(e) => setActivityData(prev => ({ ...prev, followUpNotes: e.target.value }))}
                      placeholder="What needs to be followed up on?"
                      rows={2}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!isFormValid()}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Activity
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}