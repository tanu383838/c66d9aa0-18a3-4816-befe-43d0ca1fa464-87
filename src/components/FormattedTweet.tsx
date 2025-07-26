
import React from 'react';

interface FormattedTweetProps {
  content: string;
  className?: string;
}

export const FormattedTweet = ({ content, className = '' }: FormattedTweetProps) => {
  const formatTweetContent = (text: string) => {
    // Split by line breaks and process each line
    const lines = text.split('\n\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return lines.map((line, index) => {
      // Add proper spacing around emojis
      const formattedLine = line.replace(/([^\s])([🔥💡📌✅🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🎊✨💥💯⚡️🌈🎨🎭🎪🎲])/g, '$1 $2');
      
      // Check if line starts with bullet point or emoji
      const isBulletPoint = /^[•✅🔥💡📌🎯🚀💰📈🔴⭐️📱💪🌟🎉🏆🎊✨💥💯⚡️🌈🎨🎭🎪🎲\-\*#]/.test(formattedLine);
      
      // Format bold text and hashtags
      const processedLine = formattedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(#[\w\u0980-\u09FF]+)/g, '<span class="text-primary font-medium">$1</span>');
      
      return (
        <div 
          key={index} 
          className={`${isBulletPoint ? 'ml-3' : ''} ${index > 0 ? 'mt-3' : ''} text-base leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });
  };

  return (
    <div className={`leading-relaxed ${className}`}>
      {formatTweetContent(content)}
    </div>
  );
};
