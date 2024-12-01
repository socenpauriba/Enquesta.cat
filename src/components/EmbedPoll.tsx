import React, { useState } from 'react';
import { Vote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { DbPoll } from '../lib/supabase';
import { getThemeFromUrl, type ThemeColor } from '../utils/colors';

interface EmbedPollProps {
  poll: DbPoll;
  onVote: (optionId: string) => void;
}

export default function EmbedPoll({ poll, onVote }: EmbedPollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const theme: ThemeColor = getThemeFromUrl();

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const timeLeft = new Date(poll.ends_at).getTime() - Date.now();
  const isExpired = timeLeft <= 0;

  const handleVote = async () => {
    if (!selectedOption || hasVoted || isExpired) return;
    
    await onVote(selectedOption);
    setHasVoted(true);
  };

  return (
    <div className="font-sans">
      <div className="bg-white rounded-lg shadow p-4 max-w-md mx-auto mb-6">
        <h2 className="text-lg font-bold mb-2">{poll.title}</h2>
        {poll.description && (
          <p className="text-sm text-gray-600 mb-4">{poll.description}</p>
        )}

        <div className="space-y-2">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <button
                key={option.id}
                onClick={() => !hasVoted && !isExpired && setSelectedOption(option.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedOption === option.id
                    ? 'border-current'
                    : 'border-gray-200 hover:border-current'
                } ${hasVoted || isExpired ? 'cursor-default' : 'cursor-pointer'}`}
                style={{
                  borderColor: selectedOption === option.id ? theme.primary : undefined,
                  backgroundColor: selectedOption === option.id ? theme.primaryLight : undefined
                }}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.text}</span>
                    {(hasVoted || isExpired) && (
                      <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                    )}
                  </div>
                  {(hasVoted || isExpired) && (
                    <div
                      className="absolute left-0 top-0 h-full rounded-lg transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: theme.primaryLight,
                        opacity: 0.3 
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {!isExpired && !hasVoted && (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="w-full mt-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 text-white"
            style={{ 
              backgroundColor: !selectedOption ? undefined : theme.primary,
              ':hover': { backgroundColor: theme.primaryHover }
            }}
          >
            Votar
          </button>
        )}

        {isExpired && (
          <p className="text-sm text-red-500 mt-4 text-center">Aquesta enquesta ha finalitzat</p>
        )}

        {hasVoted && (
          <p className="text-sm mt-4 text-center" style={{ color: theme.primary }}>Gràcies pel teu vot!</p>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-1.5" style={{ color: theme.primary }}>
          <Vote className="h-4 w-4" />
          <a 
            href="https://enquesta.cat" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-medium hover:opacity-80"
            style={{ color: theme.primary }}
          >
            Enquesta.cat
          </a>
        </div>
        <span style={{ color: theme.primary }}>by</span>
        <a 
          href="https://nuvol.cat" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium hover:opacity-80"
          style={{ color: theme.primary }}
        >
          Nuvol.cat
        </a>
      </div>
    </div>
  );
}