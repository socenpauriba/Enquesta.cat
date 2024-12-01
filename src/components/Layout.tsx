import React from 'react';
import { Link } from 'react-router-dom';
import { Vote } from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Vote className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Enquesta.cat</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}