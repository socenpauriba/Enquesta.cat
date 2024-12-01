import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy } from 'lucide-react';

interface VoteCodesListProps {
  codes: Set<string>;
  pollId: string;
}

export default function VoteCodesList({ codes, pollId }: VoteCodesListProps) {
  const baseUrl = window.location.origin;
  const codesArray = Array.from(codes);

  const downloadCodes = () => {
    const content = codesArray.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-codes-${pollId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vote Codes</h2>
        <div className="flex gap-4">
          <button
            onClick={downloadCodes}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Download size={20} />
            Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {codesArray.map((code) => (
          <div
            key={code}
            className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm">{code}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-gray-500 hover:text-blue-600"
              >
                <Copy size={16} />
              </button>
            </div>
            <QRCodeSVG
              value={`${baseUrl}/vote/${pollId}/${code}`}
              size={100}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}