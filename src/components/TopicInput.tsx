import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentType } from '@/services/geminiService';

interface TopicInputProps {
  onGenerate: (topic: string, contentType: ContentType) => void;
  isLoading: boolean;
}

export const TopicInput = ({ onGenerate, isLoading }: TopicInputProps) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('eBook');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && contentType) {
      onGenerate(topic.trim(), contentType);
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