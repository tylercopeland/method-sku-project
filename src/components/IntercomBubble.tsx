import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function IntercomBubble() {
  const handleClick = () => {
    // In a real app, this would open Intercom chat
    console.log('Open Intercom chat');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center p-0"
      aria-label="Open Intercom chat"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}

