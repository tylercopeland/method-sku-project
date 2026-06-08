import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

interface TrialBannerProps {
  homeExperience: string;
}

export function TrialBanner({ homeExperience }: TrialBannerProps) {
  // Don't show banner for Admin Recommendations experience
  if (homeExperience === 'stranger-admin-recommendations') {
    return null;
  }

  // Calculate date 14 days from now
  const getTrialEndDate = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    return endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full text-white px-6 py-2 flex items-center justify-between" style={{ backgroundColor: '#E02A51' }}>
      <div className="flex-1 text-center space-y-0.5">
        <div className="text-sm">
          <span className="font-bold">Trial Status: 14 days left</span> • Your trial ends on {getTrialEndDate()}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white text-gray-900 border-white hover:bg-gray-100 font-medium"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}