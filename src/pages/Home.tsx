import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [voteCode, setVoteCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { data, error: searchError } = await supabase
      .from('polls')
      .select('id')
      .contains('vote_codes', [voteCode])
      .single();

    if (searchError || !data) {
      setError('Codi no vàlid');
      return;
    }

    window.location.href = `/poll/${data.id}?code=${voteCode}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Vote size={64} className="text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Votacions segures i senzilles
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Crea enquestes personalitzades de forma gratuïta
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Crear una enquesta
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Tens un codi de votació?</h2>
              <form onSubmit={handleJoinPoll} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Introdueix el teu codi
                  </label>
                  <input
                    type="text"
                    value={voteCode}
                    onChange={(e) => setVoteCode(e.target.value)}
                    placeholder="p.ex., ABC123"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Votar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}