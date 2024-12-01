import React from 'react';
import { getThemeFromUrl } from '../utils/colors';

interface PollOptionProps {
  id: string;
  text: string;
  votes: number;
  totalVotes: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export default function PollOption({
  id,
  text,
  votes,
  totalVotes,
  selected,
  disabled,
  onSelect,
}: PollOptionProps) {
  const theme = getThemeFromUrl();
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

  return (
    <div
      className={`relative border rounded-lg p-4 transition-colors ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      } ${
        selected
          ? 'border-current'
          : 'border-gray-200 hover:border-current'
      }`}
      onClick={() => !disabled && onSelect(id)}
      style={{
        borderColor: selected ? theme.primary : undefined,
        backgroundColor: selected ? theme.primaryLight : undefined
      }}
    >
      <div className="flex justify-between items-center relative z-10">
        <span className="font-medium">{text}</span>
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
}