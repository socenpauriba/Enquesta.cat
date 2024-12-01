import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Share2, Clock, Users, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import EmbedCode from '../components/EmbedCode';

export default function ViewPoll() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [voteCode, setVoteCode] = useState(searchParams.get('code') || '');
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: poll, isLoading } = useQuery({
    queryKey: ['poll', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ optionId, code }: { optionId: string; code?: string }) => {
      const { data: currentPoll, error: fetchError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      let clientIp = '';
      if (currentPoll.is_public) {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;

        if (currentPoll.used_ips?.includes(clientIp)) {
          throw new Error('Ja has votat en aquesta enquesta');
        }
      } else {
        if (!currentPoll.vote_codes.includes(code)) {
          throw new Error('Codi no vàlid');
        }

        if (currentPoll.used_codes.includes(code)) {
          throw new Error('Aquest codi ja ha estat utilitzat');
        }
      }

      const updatedOptions = currentPoll.options.map((opt: any) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );

      const updateData = currentPoll.is_public
        ? {
            options: updatedOptions,
            used_ips: [...(currentPoll.used_ips || []), clientIp],
          }
        : {
            options: updatedOptions,
            used_codes: [...currentPoll.used_codes, code],
          };

      const { error: updateError } = await supabase
        .from('polls')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poll', id] });
      setVoteCode('');
      setSelectedOption(null);
      setError('');
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Si us plau, selecciona una opció');
      return;
    }

    try {
      await voteMutation.mutateAsync({
        optionId: selectedOption,
        code: !poll.is_public ? voteCode : undefined,
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: poll?.title || 'Enquesta',
          text: poll?.description || '',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error compartint:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enquesta no trobada</h1>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const timeLeft = new Date(poll.ends_at).getTime() - Date.now();
  const isExpired = timeLeft <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
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
                <span>{totalVotes} {totalVotes === 1 ? 'vot' : 'vots'}</span>
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
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => !isExpired && setSelectedOption(option.id)}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-100 rounded-lg transition-all"
                    style={{ width: `${percentage}%`, opacity: 0.3 }}
                  />
                </div>
              );
            })}
          </div>

          {!isExpired && (
            <div className="space-y-4">
              {!poll.is_public && (
                <div>
                  <input
                    type="text"
                    placeholder="Introdueix el teu codi"
                    value={voteCode}
                    onChange={(e) => setVoteCode(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleVote}
                disabled={(!poll.is_public && !voteCode) || !selectedOption || voteMutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {voteMutation.isPending ? 'Enviant...' : 'Votar'}
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                {showShareSuccess ? (
                  <>
                    <Check size={20} />
                    Copiat!
                  </>
                ) : (
                  <>
                    <Share2 size={20} />
                    Compartir enquesta
                  </>
                )}
              </button>
              
              <EmbedCode pollId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}