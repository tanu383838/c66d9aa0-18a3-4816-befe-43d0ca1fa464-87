import { Bot } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center mb-12">
      <div className="relative">
        {/* Gradient background blur effect */}
        <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl rounded-full scale-150"></div>
        
        <div className="relative flex items-center justify-center gap-4 mb-6">
          <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow hover:shadow-elegant transition-all duration-300 group">
            <Bot className="h-10 w-10 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
              কনটেন্ট জেনারেটর
            </h1>
            <p className="text-base text-muted-foreground font-medium">AI Content Generator</p>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-foreground/80 leading-relaxed mb-4">
            AI দিয়ে তৈরি করুন ই-বুক, ফেসবুক পোস্ট ও ইনস্টাগ্রাম ক্যাপশন বাংলায়
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">✨ AI-Powered</span>
            <span className="flex items-center gap-2">🚀 Bengali Support</span>
            <span className="flex items-center gap-2">📱 Multi-Content</span>
          </div>
        </div>
      </div>
    </header>
  );
};