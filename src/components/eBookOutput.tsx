import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from './CopyButton';
import { FormattedPage } from './FormattedPage';
import { BookOpen, ChevronLeft, ChevronRight, Image, Home } from 'lucide-react';

interface eBookResult {
  title: string;
  pages: string[];
  imageIdeas: string[];
}

interface eBookOutputProps {
  result: eBookResult;
}

export const EBookOutput = ({ result }: eBookOutputProps) => {
  const { title, pages, imageIdeas } = result;
  const [currentPage, setCurrentPage] = useState(0);

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

  return (
    <div className="space-y-8">
      {/* Book Title */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-soft">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">📚 ই-বুকের শিরোনাম</h3>
          </div>
          
          <div className="bg-background/80 p-6 rounded-xl mb-6 border border-border/50 backdrop-blur-sm shadow-soft">
            <h1 className="text-2xl font-bold text-foreground leading-relaxed">{title}</h1>
          </div>
          
          <CopyButton text={title} />
        </div>
      </Card>

      {/* Book Pages with Navigation */}
      <Card className="p-8 bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-social rounded-xl shadow-soft">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">📖 ই-বুক পৃষ্ঠা</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                পৃষ্ঠা {currentPage + 1} এর {pages.length}
              </span>
            </div>
          </div>

          {/* Page Navigation */}
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
          
          {/* Current Page Content */}
          <div className="bg-background/80 p-8 rounded-xl border border-border/50 backdrop-blur-sm shadow-soft min-h-[600px]">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                পৃষ্ঠা {currentPage + 1}
              </span>
              <CopyButton text={pages[currentPage]} />
            </div>
            <FormattedPage content={pages[currentPage]} />
          </div>

          {/* Navigation Controls */}
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
                text={pages.join('\n\n--- নতুন পৃষ্ঠা ---\n\n')} 
                label="সব পৃষ্ঠা কপি করুন"
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