import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { PlusCircle, MinusCircle, Clock, Lock, Globe, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CreatePoll() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(24);
  const [voterCount, setVoterCount] = useState(10);
  const [isPublic, setIsPublic] = useState(true); // Set default to true for public polls
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pollId = nanoid();
      const voteCodes = isPublic ? [] : Array.from({ length: voterCount }, () => nanoid(8));
      
      const { error } = await supabase.from('polls').insert({
        id: pollId,
        title,
        description,
        options: options.map(text => ({ id: nanoid(), text, votes: 0 })),
        vote_codes: voteCodes,
        used_codes: [],
        is_public: isPublic,
        used_ips: [],
        ends_at: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString()
      });

      if (error) throw error;
      
      if (isPublic) {
        navigate(`/poll/${pollId}`);
      } else {
        navigate(`/poll/${pollId}/codes`, { state: { voteCodes } });
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Hi ha hagut un error. Si us plau, torna-ho a provar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label className="block text-lg font-semibold mb-2">
            Títol de l'enquesta
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Introdueix el títol"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Descripció
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Introdueix la descripció"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Tipus d'enquesta
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsPublic(true)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                isPublic
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Globe size={20} />
              Pública (IP)
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                !isPublic
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Lock size={20} />
              Segura (amb codis)
            </button>
          </div>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-start gap-2">
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <p>
              {isPublic 
                ? "Enquesta oberta on cada persona pot votar una vegada des de la mateixa IP. Ideal per votacions informals o sondejos ràpids."
                : "Enquesta segura amb codis únics de votació. Cada participant necessita un codi per votar. Recomanat per votacions oficials o quan es necessita control d'accés."}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Opcions
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Opció ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Eliminar opció"
                  >
                    <MinusCircle size={24} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOptions([...options, ''])}
            className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={20} />
            Afegir opció
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-2">
              Durada (hores)
            </label>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-500" />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                max="168"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {!isPublic && (
            <div>
              <label className="block text-lg font-semibold mb-2">
                Nombre de votants
              </label>
              <input
                type="number"
                value={voterCount}
                onChange={(e) => setVoterCount(Number(e.target.value))}
                min="2"
                max="1000"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Creant enquesta...' : 'Crear enquesta'}
        </button>
      </form>
    </div>
  );
}