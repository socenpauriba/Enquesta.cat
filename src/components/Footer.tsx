import React from 'react';
import { Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Fet amb</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>a Catalunya per</span>
            <a
              href="https://nuvol.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Nuvol.cat
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>·</span>
            <span>Desenvolupat amb</span>
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Bolt.new
            </a>
            <a
              href="https://github.com/socenpauriba/enquesta.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-gray-600 hover:text-gray-800"
              aria-label="GitHub repository"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}