import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from './CopyButton';
import { FormattedPage } from './FormattedPage';
import { FormattedTweet } from './FormattedTweet';
import { BookOpen, ChevronLeft, ChevronRight, Image, Home, MessageSquare, Share2 } from 'lucide-react';
import { ContentResult } from '@/services/geminiService';

interface ContentOutputProps {
  result: ContentResult;
}

export const ContentOutput = ({ result }: ContentOutputProps) => {
  const { type, title, content, imageIdeas } = result;
  const [currentPage, setCurrentPage] = useState(0);

  // For eBooks, split content by chapters
  const pages = type === 'eBook' ? content.split('///').map(page => page.trim()).filter(page => page.length > 0) : [content];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'eBook':
        return <BookOpen className="h-6 w-6 text-primary-foreground" />;
      case 'Facebook Post':
        return <MessageSquare className="h-6 w-6 text-white" />;
      case 'Instagram Post':
        return <Share2 className="h-6 w-6 text-white" />;
      default:
        return <BookOpen className="h-6 w-6 text-primary-foreground" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'eBook':
        return '📚 ই-বুক';
      case 'Facebook Post':
        return '📘 ফেসবুক পোস্ট';
      case 'Instagram Post':
        return '📸 ইনস্টাগ্রাম ক্যাপশন';
      default:
        return '📝 কনটেন্ট';
    }
  };

  return (
    <div className="space-y-8">
      {/* Content Title */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-soft">
              {getTypeIcon()}
            </div>
            <h3 className="text-xl font-bold text-foreground">{getTypeLabel()} শিরোনাম</h3>
          </div>
          
          <div className="bg-background/80 p-6 rounded-xl mb-6 border border-border/50 backdrop-blur-sm shadow-soft">
            <h1 className="text-2xl font-bold text-foreground leading-relaxed">{title}</h1>
          </div>
          
          <CopyButton text={title} />
        </div>
      </Card>

      {/* Content Body */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-social rounded-xl shadow-soft">
                {getTypeIcon()}
              </div>
              <h3 className="text-xl font-bold text-foreground">{getTypeLabel()} কনটেন্ট</h3>
            </div>
            
            {type === 'eBook' && pages.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  পৃষ্ঠা {currentPage + 1} এর {pages.length}
                </span>
              </div>
            )}
          </div>

          {/* Page Navigation for eBooks */}
          {type === 'eBook' && pages.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-background/50 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(0)}
                className="text-xs"
              >
                <Home className="h-3 w-3 mr-1" />
                প্রথম
              </Button>
              {pages.map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(index)}
                  className="text-xs"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
          
          {/* Current Content */}
          <div className="bg-background/80 p-8 rounded-xl border border-border/50 backdrop-blur-sm shadow-soft min-h-[400px]">
            <div className="flex justify-between items-start mb-6">
              {type === 'eBook' && pages.length > 1 ? (
                <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                  অধ্যায় {currentPage + 1}
                </span>
              ) : (
                <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                  {getTypeLabel()}
                </span>
              )}
              <CopyButton text={pages[currentPage]} />
            </div>
            
            <div className="prose prose-lg max-w-none">
              {type === 'eBook' ? (
                <FormattedPage content={pages[currentPage]} />
              ) : (
                <FormattedTweet content={pages[currentPage]} />
              )}
            </div>
          </div>

          {/* Navigation Controls for eBooks */}
          {type === 'eBook' && pages.length > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                পূর্ববর্তী
              </Button>

              <div className="flex gap-2">
                <CopyButton 
                  text={pages.join('\n\n--- নতুন অধ্যায় ---\n\n')} 
                  label="সব অধ্যায় কপি করুন"
                />
              </div>

              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                className="flex items-center gap-2"
              >
                পরবর্তী
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Copy all content for non-eBook types */}
          {type !== 'eBook' && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <CopyButton 
                text={content} 
                label="সম্পূর্ণ কনটেন্ট কপি করুন"
              />
            </div>
          )}
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