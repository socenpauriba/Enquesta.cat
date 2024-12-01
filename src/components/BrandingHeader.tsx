import React from 'react';
import { Vote } from 'lucide-react';

interface BrandingHeaderProps {
  pollUrl?: string;
}

export default function BrandingHeader({ pollUrl }: BrandingHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Enquesta.cat</span>
          </div>
          {pollUrl && (
            <div className="hidden sm:flex items-center">
              <span className="text-sm text-gray-500 mr-2">URL de votació:</span>
              <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">
                {pollUrl}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}