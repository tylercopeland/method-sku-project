import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, ChevronRight } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoId: string;
  nextVideoTitle?: string;
  nextVideoId?: string;
  onNextVideo?: (title: string, videoId: string) => void;
}

export function VideoModal({ isOpen, onClose, title, videoId, nextVideoTitle, nextVideoId, onNextVideo }: VideoModalProps) {
  const handleNextVideo = () => {
    if (onNextVideo && nextVideoTitle && nextVideoId) {
      onNextVideo(nextVideoTitle, nextVideoId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-6 overflow-hidden">
        <div className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{title}</DialogTitle>
          </DialogHeader>
          
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {/* Placeholder video player */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 leading-relaxed">
                Get started with Method CRM and learn the essential features to manage customers, 
                create estimates, and streamline your workflow.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Duration: 3:45</span>
              <span>•</span>
              <span>Getting Started</span>
              <span>•</span>
              <span>Video ID: {videoId}</span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Duration: 3:45</span>
                  <span>•</span>
                  <span>Getting Started</span>
                  <span>•</span>
                  <span>Video ID: {videoId}</span>
                </div>
                
                <Button 
                  onClick={handleNextVideo} 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <span>Play Next Video</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}