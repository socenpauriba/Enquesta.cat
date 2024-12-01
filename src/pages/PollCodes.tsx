import React, { useState, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, ArrowRight, Check, FileText } from 'lucide-react';
import { generateVoteCodesPDF } from '../utils/pdfGenerator';

export default function PollCodes() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const voteCodes = location.state?.voteCodes || [];
  const baseUrl = window.location.origin;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const qrRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const downloadTxt = () => {
    const content = voteCodes.map(code => 
      `${code}\n`
    ).join('');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codis-votacio-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!id) return;
    await generateVoteCodesPDF(voteCodes, id, qrRefs.current);
  };

  const handleCopyCode = async (code: string) => {
    try {
      const pollUrl = `${baseUrl}/poll/${id}?code=${code}`;
      await navigator.clipboard.writeText(pollUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  if (!voteCodes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accés denegat
          </h1>
          <p className="text-gray-600 mb-4">
            No pots accedir a aquesta pàgina directament.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            Tornar a l'inici
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Codis de votació generats</h1>
              <p className="text-gray-600">Comparteix aquests codis amb els teus votants. Cada codi només es pot utilitzar una vegada.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadTxt}
                className="flex items-center gap-2 btn btn-secondary"
                title="Descarregar TXT"
              >
                <FileText size={20} />
                TXT
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 btn btn-primary"
                title="Descarregar PDF"
              >
                <Download size={20} />
                PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {voteCodes.map((code: string) => (
              <div
                key={code}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm">{code}</span>
                  <button
                    onClick={() => handleCopyCode(code)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Copiar enllaç"
                  >
                    {copiedCode === code ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <div ref={el => qrRefs.current[code] = el}>
                  <QRCodeSVG
                    value={`${baseUrl}/poll/${id}?code=${code}`}
                    size={120}
                    level="H"
                    includeMargin
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Escaneja per votar
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t">
            <Link
              to={`/poll/${id}`}
              className="inline-flex items-center gap-2 btn btn-primary"
            >
              Veure enquesta
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}