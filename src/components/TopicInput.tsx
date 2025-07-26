import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface TopicInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

export const TopicInput = ({ onGenerate, isLoading }: TopicInputProps) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic.trim());
    }
  };

  const exampleTopics = [
    "Notion AI দিয়ে আয়",
    "CapCut Reels হ্যাক",
    "ফ্রিল্যান্সিং টিপস",
    "AI টুলস ২০২৪"
  ];

  return (
    <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50 pointer-events-none"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <span className="text-lg">📝</span>
            </div>
            <label htmlFor="topic" className="text-lg font-semibold text-foreground">
              একটি টপিক লিখুন
            </label>
          </div>
          
          <div className="flex gap-3">
            <Input
              id="topic"
              type="text"
              placeholder="যেমন: Notion AI দিয়ে আয়..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 h-12 bg-background/70 border-border focus:ring-primary focus:border-primary transition-all duration-200 text-base backdrop-blur-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!topic.trim() || isLoading}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-6 h-12 font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="ml-2">তৈরি করুন</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👉</span>
            <p className="text-base font-medium text-muted-foreground">উদাহরণ টপিক</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {exampleTopics.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setTopic(example)}
                className="px-4 py-2 text-sm font-medium bg-secondary/80 hover:bg-accent/80 text-secondary-foreground rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-soft backdrop-blur-sm"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Card>
  );
};