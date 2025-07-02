
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { FeedbackEntry } from '../types/feedback';

interface SessionRatingsProps {
  data: FeedbackEntry[];
}

const SessionRatings: React.FC<SessionRatingsProps> = ({ data }) => {
  // Process ratings data
  const ratingsData = React.useMemo(() => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    data.forEach(entry => {
      if (entry.type === 'rating' && entry.score) {
        ratingCounts[entry.score as keyof typeof ratingCounts]++;
      }
    });
    
    return [
      { rating: '1', count: ratingCounts[1], color: '#ef4444' },
      { rating: '2', count: ratingCounts[2], color: '#f97316' },
      { rating: '3', count: ratingCounts[3], color: '#f59e0b' },
      { rating: '4', count: ratingCounts[4], color: '#22c55e' },
      { rating: '5', count: ratingCounts[5], color: '#10b981' }
    ];
  }, [data]);

  const totalRatings = ratingsData.reduce((sum, item) => sum + item.count, 0);
  const averageRating = totalRatings > 0 
    ? ratingsData.reduce((sum, item, index) => sum + (index + 1) * item.count, 0) / totalRatings 
    : 0;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center font-brockmann">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
          Session Ratings
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600 font-brockmann">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 font-inter">Average</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2 font-inter">
          <span>Distribution</span>
          <span>{totalRatings} total ratings</span>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="rating" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {ratingsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rating breakdown */}
      <div className="space-y-2">
        {ratingsData.map((item, index) => (
          <div key={item.rating} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      i < parseInt(item.rating) ? 'bg-orange-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700 font-inter">{item.rating} star</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: item.color,
                  width: `${totalRatings > 0 ? (item.count / Math.max(...ratingsData.map(d => d.count)) * 40) : 0}px`
                }}
              />
              <span className="text-sm text-gray-600 w-6 text-right font-inter">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionRatings;
