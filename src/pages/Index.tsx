import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TopicInput } from '@/components/TopicInput';
import { ThreadOutput } from '@/components/ThreadOutput';
import { GeminiService, type ThreadResult } from '@/services/geminiService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Key, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ThreadResult | null>(null);
  const [geminiService] = useState(() => new GeminiService());

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      geminiService.setApiKey(apiKey.trim());
      setIsApiKeySet(true);
      toast.success('API Key সেট হয়েছে!');
    } else {
      toast.error('একটি বৈধ API Key প্রবেশ করান');
    }
  };

  const handleGenerateThread = async (topic: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const threadResult = await geminiService.generateThread(topic);
      setResult(threadResult);
      toast.success('থ্রেড তৈরি হয়েছে!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'কিছু সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-hind relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-social opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-6 py-12 max-w-5xl relative z-10">
        <Header />

        {!isApiKeySet ? (
          <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-subtle opacity-40 pointer-events-none"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-accent rounded-xl shadow-soft">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Gemini API Key সেটআপ</h3>
              </div>
              
              <div className="bg-gradient-accent/10 border border-accent/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">API Key প্রয়োজন</p>
                    <p className="text-foreground/80 leading-relaxed">
                      Gemini API ব্যবহার করতে আপনার API Key প্রয়োজন। 
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover underline font-medium ml-1 transition-colors"
                      >
                        এখানে ক্লিক করে
                      </a> API Key নিন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Input
                  type="password"
                  placeholder="আপনার Gemini API Key এখানে পেস্ট করুন..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 h-12 bg-background/80 border-border focus:ring-primary focus:border-primary transition-all duration-200 text-base backdrop-blur-sm"
                />
                <Button 
                  onClick={handleSetApiKey}
                  disabled={!apiKey.trim()}
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-6 h-12 font-semibold disabled:opacity-50"
                >
                  সেট করুন
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <TopicInput onGenerate={handleGenerateThread} isLoading={isLoading} />
            
            {result && (
              <div className="mt-12 animate-fade-in">
                <ThreadOutput result={result} />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;