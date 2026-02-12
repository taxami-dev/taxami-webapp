'use client';
import { useState } from 'react';

const categories = ['Fatture', 'Certificazioni Uniche', 'F24', 'Visure', 'Contratti', 'Altro'];

const mockDocs = [
  { name: 'Fattura_001_2026.pdf', cat: 'Fatture', date: '10 Feb 2026', size: '245 KB' },
  { name: 'CU_2025_dipendente.pdf', cat: 'Certificazioni Uniche', date: '8 Feb 2026', size: '189 KB' },
  { name: 'F24_gennaio_2026.pdf', cat: 'F24', date: '5 Feb 2026', size: '120 KB' },
  { name: 'Visura_camerale_2026.pdf', cat: 'Visure', date: '1 Feb 2026', size: '532 KB' },
];

export default function Documenti() {
  const [dragOver, setDragOver] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tutti');

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Documenti</h1>
          <p className="text-slate-600">Carica e organizza tutti i tuoi documenti fiscali in un unico posto.</p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-8 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-300'
          }`}
        >
          <div className="text-4xl mb-3">📁</div>
          <p className="text-slate-700 font-medium mb-1">Trascina i tuoi file qui</p>
          <p className="text-sm text-slate-500 mb-4">oppure</p>
          <button className="px-6 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
            Sfoglia file
          </button>
          <p className="text-xs text-slate-400 mt-3">PDF, JPG, PNG fino a 10MB · I tuoi documenti sono crittografati e protetti</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('Tutti')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'Tutti' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tutti
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <span>Nome file</span>
            <span>Categoria</span>
            <span>Data</span>
            <span>Dimensione</span>
          </div>
          {mockDocs.map((doc, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 px-4 py-3 border-t border-slate-100 hover:bg-slate-50 transition-colors items-center">
              <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <span className="text-red-500">📄</span> {doc.name}
              </span>
              <span className="text-sm text-slate-600">{doc.cat}</span>
              <span className="text-sm text-slate-500">{doc.date}</span>
              <span className="text-sm text-slate-500">{doc.size}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">Documenti demo · Accedi per gestire i tuoi documenti reali</p>
      </div>
    </div>
  );
}
