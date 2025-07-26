import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentType, ContentOptions } from '@/services/geminiService';

interface TopicInputProps {
  onGenerate: (topic: string, contentType: ContentType, options: ContentOptions) => void;
  isLoading: boolean;
}

export const TopicInput = ({ onGenerate, isLoading }: TopicInputProps) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('eBook');
  const [wordCount, setWordCount] = useState(500);
  const [pageCount, setPageCount] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && contentType) {
      const options: ContentOptions = {
        wordCount: contentType !== 'eBook' ? wordCount : undefined,
        pageCount: contentType === 'eBook' ? pageCount : undefined,
      };
      onGenerate(topic.trim(), contentType, options);
    }
  };

  const exampleTopics = [
    "ডিজিটাল মার্কেটিং গাইড",
    "ওয়েব ডেভেলপমেন্ট শিখুন",
    "ব্যবসায়ের কৌশল",
    "AI এর ভবিষ্যৎ",
    "অনলাইন আয়ের উপায়",
    "স্বাস্থ্য ও ফিটনেস"
  ];

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'eBook':
        return '📚';
      case 'Facebook Post':
        return '📘';
      case 'Instagram Post':
        return '📸';
      default:
        return '📝';
    }
  };

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
              কনটেন্ট তৈরি করুন
            </label>
          </div>

          {/* Content Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">কনটেন্ট টাইপ নির্বাচন করুন</label>
            <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
              <SelectTrigger className="h-12 bg-background/70 border-border focus:ring-primary focus:border-primary transition-all duration-200 text-base backdrop-blur-sm">
                <SelectValue placeholder="কনটেন্ট টাইপ নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eBook">
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>ই-বুক</span>
                  </div>
                </SelectItem>
                <SelectItem value="Facebook Post">
                  <div className="flex items-center gap-2">
                    <span>📘</span>
                    <span>ফেসবুক পোস্ট</span>
                  </div>
                </SelectItem>
                <SelectItem value="Instagram Post">
                  <div className="flex items-center gap-2">
                    <span>📸</span>
                    <span>ইনস্টাগ্রাম ক্যাপশন</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">টপিক লিখুন</label>
            <div className="flex gap-3">
              <Input
                id="topic"
                type="text"
                placeholder="যেমন: ডিজিটাল মার্কেটিং গাইড..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 h-12 bg-background/70 border-border focus:ring-primary focus:border-primary transition-all duration-200 text-base backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!topic.trim() || !contentType || isLoading}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-6 h-12 font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {getContentTypeIcon(contentType)} তৈরি করুন
                </span>
              </Button>
            </div>
          </div>

          {/* Content Options */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <label className="text-base font-medium text-foreground/80">কনটেন্ট সেটিংস</label>
            </div>
            
            {contentType === 'eBook' ? (
              <div className="space-y-2">
                <Label htmlFor="pageCount" className="text-sm font-medium text-foreground/80">
                  পৃষ্ঠা সংখ্যা
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="pageCount"
                    type="number"
                    min="5"
                    max="50"
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(5, Math.min(50, parseInt(e.target.value) || 10)))}
                    className="w-24 h-10 bg-background/70 border-border focus:ring-primary focus:border-primary transition-all duration-200 text-center"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-muted-foreground">
                    (৫-৫০ পৃষ্ঠা)
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="wordCount" className="text-sm font-medium text-foreground/80">
                  শব্দ সংখ্যা
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="wordCount"
                    type="number"
                    min="100"
                    max="2000"
                    value={wordCount}
                    onChange={(e) => setWordCount(Math.max(100, Math.min(2000, parseInt(e.target.value) || 500)))}
                    className="w-24 h-10 bg-background/70 border-border focus:ring-primary focus:border-primary transition-all duration-200 text-center"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-muted-foreground">
                    (১০০-২০০০ শব্দ)
                  </span>
                </div>
              </div>
            )}
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