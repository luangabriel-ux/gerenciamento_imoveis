import React from 'react';
import { Building } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center gap-2">
        <Building size={32} />
        <h1 className="text-xl sm:text-2xl font-bold">Sistema de Gestão de Aluguéis</h1>
      </div>
    </header>
  );
}