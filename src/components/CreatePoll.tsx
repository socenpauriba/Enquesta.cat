import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { PlusCircle, MinusCircle, Clock } from 'lucide-react';
import { Poll } from '../types';
import { getThemeFromUrl } from '../utils/colors';

interface CreatePollProps {
  onPollCreate: (poll: Poll) => void;
}

export default function CreatePoll({ onPollCreate }: CreatePollProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(24);
  const [voterCount, setVoterCount] = useState(10);
  const theme = getThemeFromUrl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const voteCodes = new Set(Array.from({ length: voterCount }, () => nanoid(8)));
    
    const poll: Poll = {
      id: nanoid(),
      title,
      description,
      options: options.map(text => ({ id: nanoid(), text, votes: 0 })),
      voteCodes,
      usedCodes: new Set(),
      createdAt: new Date(),
      endsAt: new Date(Date.now() + duration * 60 * 60 * 1000)
    };
    
    onPollCreate(poll);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <label className="block text-lg font-semibold mb-2">Títol de l'enquesta</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-current focus:border-transparent"
          style={{ '--tw-ring-color': theme.primary }}
          required
        />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">Descripció</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-current focus:border-transparent"
          style={{ '--tw-ring-color': theme.primary }}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">Opcions</label>
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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-current focus:border-transparent"
                style={{ '--tw-ring-color': theme.primary }}
                placeholder={`Opció ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => setOptions(options.filter((_, i) => i !== index))}
                  className="p-2 text-red-500 hover:text-red-700"
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
          className="mt-3 flex items-center gap-2 hover:opacity-80 transition-colors"
          style={{ color: theme.primary }}
        >
          <PlusCircle size={20} />
          Afegir opció
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold mb-2">Durada (hores)</label>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-gray-500" />
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              max="168"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-current focus:border-transparent"
              style={{ '--tw-ring-color': theme.primary }}
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Nombre de votants</label>
          <input
            type="number"
            value={voterCount}
            onChange={(e) => setVoterCount(Number(e.target.value))}
            min="2"
            max="1000"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-current focus:border-transparent"
            style={{ '--tw-ring-color': theme.primary }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
        style={{ 
          backgroundColor: theme.primary,
          ':hover': { backgroundColor: theme.primaryHover }
        }}
      >
        Crear enquesta
      </button>
    </form>
  );
}