
import React from 'react';
import { FeedbackEntry } from '../types/feedback';

interface KeyTakeawaysProps {
  data: FeedbackEntry[];
}

interface WordFrequency {
  word: string;
  count: number;
  color: string;
}

const KeyTakeaways: React.FC<KeyTakeawaysProps> = ({ data }) => {
  const wordCloud = React.useMemo(() => {
    const takeaways = data.filter(entry => entry.type === 'takeaway' && entry.comment);
    const allText = takeaways.map(entry => entry.comment || '').join(' ');
    
    // Simple word extraction and counting
    const words = allText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'they', 'were', 'been', 'have', 'will', 'your', 'what', 'when', 'where', 'about'].includes(word));
    
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const colors = ['#f97316', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    
    return Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [data]);

  const maxCount = Math.max(...(wordCloud.map(w => w.count) || [1]));

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center font-brockmann">
          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
          Key Takeaways
        </h2>
        <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-inter font-medium">
          {data.filter(entry => entry.type === 'takeaway').length} takeaways
        </span>
      </div>

      {wordCloud.length > 0 ? (
        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px]">
          {wordCloud.map((wordData, index) => {
            const fontSize = Math.max(12, (wordData.count / maxCount) * 32);
            const opacity = Math.max(0.6, wordData.count / maxCount);
            
            return (
              <span
                key={`${wordData.word}-${index}`}
                className="inline-block transition-all duration-300 hover:scale-110 cursor-pointer font-medium animate-fade-in-word font-inter"
                style={{
                  fontSize: `${fontSize}px`,
                  color: wordData.color,
                  opacity: opacity,
                  animationDelay: `${index * 0.1}s`
                }}
                title={`Mentioned ${wordData.count} time${wordData.count > 1 ? 's' : ''}`}
              >
                {wordData.word}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-sm font-inter font-medium">Waiting for takeaway feedback...</p>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in-word {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-fade-in-word {
            animation: fade-in-word 0.6s ease-out both;
          }
        `}
      </style>
    </div>
  );
};

export default KeyTakeaways;
