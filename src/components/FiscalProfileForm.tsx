'use client';
import { useState, useEffect } from 'react';

const regimi = [
  { value: '', label: 'Seleziona regime...' },
  { value: 'forfetario', label: 'Regime Forfetario' },
  { value: 'ordinario', label: 'Regime Ordinario' },
  { value: 'semplificato', label: 'Contabilità Semplificata' },
];

const settori = [
  { value: '', label: 'Seleziona settore...' },
  { value: 'commercio', label: 'Commercio (47.xx)' },
  { value: 'ristorazione', label: 'Alloggio e Ristorazione (55-56)' },
  { value: 'intermediari', label: 'Intermediari del Commercio (46.1x)' },
  { value: 'servizi-professionali', label: 'Servizi Professionali/Tecnici (62-74)' },
  { value: 'costruzioni', label: 'Costruzioni (41-43)' },
  { value: 'professioni', label: 'Attività Professionali (con cassa)' },
  { value: 'manifattura', label: 'Industria e Manifattura' },
  { value: 'trasporti', label: 'Trasporti e Logistica' },
  { value: 'altro', label: 'Altre attività' },
];

export default function FiscalProfileForm() {
  const [profile, setProfile] = useState({
    regimeFiscale: '', codiceAteco: '', settoreAttivita: '', annoApertura: '', partitaIva: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/user/fiscal-profile').then(r => r.json()).then(data => {
      setProfile({
        regimeFiscale: data.regimeFiscale || '',
        codiceAteco: data.codiceAteco || '',
        settoreAttivita: data.settoreAttivita || '',
        annoApertura: data.annoApertura?.toString() || '',
        partitaIva: data.partitaIva || '',
      });
    }).catch(() => {});
  }, []);

  const save = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await fetch('/api/user/fiscal-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Regime Fiscale</label>
        <select value={profile.regimeFiscale} onChange={e => setProfile({ ...profile, regimeFiscale: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {regimi.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Settore Attività</label>
        <select value={profile.settoreAttivita} onChange={e => setProfile({ ...profile, settoreAttivita: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {settori.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Codice ATECO</label>
        <input type="text" value={profile.codiceAteco} onChange={e => setProfile({ ...profile, codiceAteco: e.target.value })}
          placeholder="Es. 62.01.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Anno Apertura P.IVA</label>
        <input type="number" value={profile.annoApertura} onChange={e => setProfile({ ...profile, annoApertura: e.target.value })}
          placeholder="Es. 2024" min="1990" max="2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button onClick={save} disabled={loading}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50">
          {loading ? 'Salvo...' : 'Salva Profilo'}
        </button>
        {saved && <span className="text-sm text-green-600">✅ Profilo salvato!</span>}
      </div>
    </div>
  );
}
