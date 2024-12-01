import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface EmbedCodeProps {
  pollId: string;
}

export default function EmbedCode({ pollId }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const embedCode = `<iframe src="${window.location.origin}/embed/${pollId}?color=${encodeURIComponent(color.substring(1))}" style="width:432px;height:350px"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Codi per incrustar</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="embedColor" className="text-sm text-gray-600">Color:</label>
            <input
              type="color"
              id="embedColor"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copiat!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copiar codi</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-3 bg-white border rounded-md text-sm overflow-x-auto">
        <code>{embedCode}</code>
      </pre>
    </div>
  );
}