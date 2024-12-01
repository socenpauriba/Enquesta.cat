import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import EmbedPoll from '../components/EmbedPoll';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EmbedPollPage() {
  const { id } = useParams<{ id: string }>();
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
    mutationFn: async (optionId: string) => {
      const { data: currentPoll, error: fetchError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const updatedOptions = currentPoll.options.map((opt: any) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );

      const { error: updateError } = await supabase
        .from('polls')
        .update({ options: updatedOptions })
        .eq('id', id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poll', id] });
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!poll) {
    return (
      <div className="p-4 text-center text-red-500">
        Enquesta no trobada
      </div>
    );
  }

  return (
    <div className="p-4">
      <EmbedPoll
        poll={poll}
        onVote={(optionId) => voteMutation.mutateAsync(optionId)}
      />
    </div>
  );
}