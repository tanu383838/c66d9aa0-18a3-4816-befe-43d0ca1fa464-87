
import { Card } from '@/components/ui/card';
import { CopyButton } from './CopyButton';
import { FormattedTweet } from './FormattedTweet';
import { Twitter, MessageSquare, Image } from 'lucide-react';

interface ThreadResult {
  mainTweet: string;
  threadBody: string[];
  imageIdeas: string[];
}

interface ThreadOutputProps {
  result: ThreadResult;
}

export const ThreadOutput = ({ result }: ThreadOutputProps) => {
  const { mainTweet, threadBody, imageIdeas } = result;

  return (
    <div className="space-y-8">
      {/* Main Tweet */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-soft">
              <Twitter className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">📌 মূল টুইট</h3>
          </div>
          
          <div className="bg-background/80 p-6 rounded-xl mb-6 border border-border/50 backdrop-blur-sm shadow-soft">
            <FormattedTweet content={mainTweet} />
          </div>
          
          <CopyButton text={mainTweet} />
        </div>
      </Card>

      {/* Thread Body */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-social rounded-xl shadow-soft">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">📚 থ্রেড টুইটস</h3>
          </div>
          
          <div className="space-y-5">
            {threadBody.map((tweet, index) => (
              <div key={index} className="bg-background/80 p-6 rounded-xl border border-border/50 backdrop-blur-sm shadow-soft hover:shadow-elegant transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    টুইট {index + 2}
                  </span>
                  <CopyButton text={tweet} />
                </div>
                <FormattedTweet content={tweet} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/50">
            <CopyButton 
              text={threadBody.join('\n\n')} 
              label="সব টুইট কপি করুন"
            />
          </div>
        </div>
      </Card>

      {/* Image Ideas */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-accent rounded-xl shadow-soft">
              <Image className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">🖼️ ইমেজ আইডিয়া</h3>
          </div>
          
          <div className="bg-background/80 p-6 rounded-xl mb-6 border border-border/50 backdrop-blur-sm shadow-soft">
            <div className="space-y-4">
              {imageIdeas.map((idea, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-background/50 transition-colors duration-200">
                  <div className="p-1.5 bg-gradient-primary rounded-full mt-1">
                    <span className="block w-2 h-2 bg-primary-foreground rounded-full"></span>
                  </div>
                  <span className="text-base leading-relaxed text-foreground/90">{idea}</span>
                </div>
              ))}
            </div>
          </div>
          
          <CopyButton text={imageIdeas.join('\n')} label="সব আইডিয়া কপি করুন" />
        </div>
      </Card>
    </div>
  );
};
