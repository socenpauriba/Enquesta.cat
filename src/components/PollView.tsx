import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Poll } from '../types';
import { Share2, Clock, Users } from 'lucide-react';
import { getThemeFromUrl } from '../utils/colors';

interface PollViewProps {
  poll: Poll;
  onVote: (optionId: string, voteCode: string) => void;
}

export default function PollView({ poll, onVote }: PollViewProps) {
  const [voteCode, setVoteCode] = useState('');
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const theme = getThemeFromUrl();

  const handleVote = () => {
    if (!poll.voteCodes.has(voteCode)) {
      setError('Codi no vàlid');
      return;
    }
    if (poll.usedCodes.has(voteCode)) {
      setError('Aquest codi ja ha estat utilitzat');
      return;
    }
    if (!selectedOption) {
      setError('Si us plau, selecciona una opció');
      return;
    }

    onVote(selectedOption, voteCode);
    setVoteCode('');
    setSelectedOption(null);
    setError('');
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const timeLeft = new Date(poll.endsAt).getTime() - Date.now();
  const isExpired = timeLeft <= 0;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{poll.title}</h1>
        <p className="text-gray-600 mb-4">{poll.description}</p>
        
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {isExpired ? (
              <span className="text-red-500">Finalitzada</span>
            ) : (
              <span>{Math.floor(timeLeft / (1000 * 60 * 60))}h restants</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{totalVotes} vots</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <div
              key={option.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedOption === option.id
                  ? 'border-current'
                  : 'border-gray-200 hover:border-current'
              }`}
              onClick={() => !isExpired && setSelectedOption(option.id)}
              style={{
                borderColor: selectedOption === option.id ? theme.primary : undefined,
                backgroundColor: selectedOption === option.id ? theme.primaryLight : undefined
              }}
            >
              <div className="flex justify-between items-center relative z-10">
                <span className="font-medium">{option.text}</span>
                <span className="text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
              <div
                className="absolute left-0 top-0 h-full rounded-lg transition-all"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: theme.primaryLight,
                  opacity: 0.3 
                }}
              />
            </div>
          );
        })}
      </div>

      {!isExpired && (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Introdueix el teu codi"
              value={voteCode}
              onChange={(e) => setVoteCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-current focus:border-transparent"
              style={{ '--tw-ring-color': theme.primary }}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            onClick={handleVote}
            disabled={!voteCode || !selectedOption}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:bg-gray-400"
            style={{ 
              backgroundColor: (!voteCode || !selectedOption) ? undefined : theme.primary,
              ':hover': { backgroundColor: theme.primaryHover }
            }}
          >
            Votar
          </button>
        </div>
      )}

      <div className="mt-8 pt-8 border-t">
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-colors"
          style={{ color: theme.primary }}
        >
          <Share2 size={20} />
          Compartir enquesta
        </button>
      </div>
    </div>
  );
}