'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const ATECO_CATEGORIES = [
  { label: 'Commercio (47.xx)', value: 'commercio', coeff: 0.40 },
  { label: 'Alloggio e ristorazione (55-56)', value: 'alloggio', coeff: 0.40 },
  { label: 'Intermediari del commercio (46.1x)', value: 'intermediari', coeff: 0.62 },
  { label: 'Servizi professionali/tecnici (62-74)', value: 'servizi', coeff: 0.78 },
  { label: 'Costruzioni (41-43)', value: 'costruzioni', coeff: 0.86 },
  { label: 'Commercio ambulante alimentari', value: 'ambulante_food', coeff: 0.40 },
  { label: 'Commercio ambulante non alimentari', value: 'ambulante_nonfood', coeff: 0.54 },
  { label: 'Attività professionali (con cassa)', value: 'professionisti_cassa', coeff: 0.78 },
  { label: 'Altre attività economiche', value: 'altre', coeff: 0.67 },
];

type InpsType = 'separata' | 'artigiani';

function calcIrpef(imponibile: number): number {
  if (imponibile <= 0) return 0;
  let tax = 0;
  if (imponibile > 50000) {
    tax += (imponibile - 50000) * 0.43;
    imponibile = 50000;
  }
  if (imponibile > 28000) {
    tax += (imponibile - 28000) * 0.35;
    imponibile = 28000;
  }
  tax += imponibile * 0.23;
  return tax;
}

function calcInps(imponibile: number, type: InpsType): number {
  if (type === 'separata') return imponibile * 0.2607;
  return Math.max(4200, imponibile * 0.24);
}

function calcForfetario(fatturato: number, coeff: number, aliquota: number, inpsType: InpsType) {
  const imponibile = fatturato * coeff;
  const contributiInps = calcInps(imponibile, inpsType);
  const imponibileFiscale = Math.max(0, imponibile - contributiInps);
  const imposta = imponibileFiscale * aliquota;
  const totaleTasse = imposta + contributiInps;
  return { imponibile, imponibileFiscale, imposta, contributiInps, totaleTasse, netto: fatturato - totaleTasse };
}

function calcOrdinario(fatturato: number, costiDeducibili: number, inpsType: InpsType) {
  const imponibileLordo = Math.max(0, fatturato - costiDeducibili);
  const contributiInps = calcInps(imponibileLordo, inpsType);
  const imponibileFiscale = Math.max(0, imponibileLordo - contributiInps);
  const imposta = calcIrpef(imponibileFiscale);
  const totaleTasse = imposta + contributiInps;
  return { imponibile: imponibileLordo, imponibileFiscale, imposta, contributiInps, totaleTasse, netto: fatturato - totaleTasse };
}

function fmt(n: number): string {
  return n.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function Bar({ items, total }: { items: { label: string; value: number; color: string }[]; total: number }) {
  if (total <= 0) return null;
  return (
    <div className="mt-3">
      <div className="flex h-8 rounded-lg overflow-hidden">
        {items.map((item, i) => {
          const pct = (item.value / total) * 100;
          if (pct < 1) return null;
          return (
            <div key={i} className={`${item.color} relative group`} style={{ width: `${pct}%` }}>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white truncate px-1">
                {pct > 8 ? `${Math.round(pct)}%` : ''}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-600">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className={`inline-block w-3 h-3 rounded ${item.color}`} />
            {item.label}: €{fmt(item.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ title, data, fatturato, accent }: {
  title: string;
  data: ReturnType<typeof calcForfetario>;
  fatturato: number;
  accent: string;
}) {
  const barItems = [
    { label: 'Netto', value: Math.max(0, data.netto), color: 'bg-emerald-500' },
    { label: 'Imposta', value: data.imposta, color: 'bg-blue-500' },
    { label: 'INPS', value: data.contributiInps, color: 'bg-amber-500' },
  ];

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 sm:p-6 ${accent}`}>
      <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
      <div className="space-y-2 text-sm">
        <Row label="Reddito imponibile" value={data.imponibile} />
        <Row label="Base imponibile fiscale" value={data.imponibileFiscale} />
        <Row label="Imposta" value={data.imposta} className="text-blue-600" />
        <Row label="Contributi INPS" value={data.contributiInps} className="text-amber-600" />
        <div className="border-t border-slate-200 pt-2 mt-2">
          <Row label="Totale tasse e contributi" value={data.totaleTasse} className="font-bold text-red-600" />
        </div>
        <div className="border-t border-slate-200 pt-2">
          <Row label="Netto stimato" value={data.netto} className="font-bold text-emerald-600 text-base" />
        </div>
        {fatturato > 0 && (
          <p className="text-xs text-slate-400 pt-1">
            Pressione fiscale effettiva: {((data.totaleTasse / fatturato) * 100).toFixed(1)}%
          </p>
        )}
      </div>
      <Bar items={barItems} total={fatturato} />
    </div>
  );
}

function Row({ label, value, className = '' }: { label: string; value: number; className?: string }) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span className="text-slate-600">{label}</span>
      <span>€{fmt(value)}</span>
    </div>
  );
}

export default function SimulatorePage() {
  const [regime, setRegime] = useState<'forfetario' | 'ordinario'>('forfetario');
  const [fatturato, setFatturato] = useState('');
  const [atecoIdx, setAtecoIdx] = useState(3); // default servizi
  const [costiDeducibili, setCostiDeducibili] = useState('');
  const [aliquotaForf, setAliquotaForf] = useState<5 | 15>(15);
  const [inpsType, setInpsType] = useState<InpsType>('separata');
  const [showResults, setShowResults] = useState(false);

  const fat = parseFloat(fatturato) || 0;
  const costi = parseFloat(costiDeducibili) || 0;
  const ateco = ATECO_CATEGORIES[atecoIdx];

  const results = useMemo(() => {
    if (!showResults || fat <= 0) return null;
    const forf = calcForfetario(fat, ateco.coeff, aliquotaForf / 100, inpsType);
    const ord = calcOrdinario(fat, costi, inpsType);
    return { forf, ord };
  }, [showResults, fat, ateco.coeff, aliquotaForf, inpsType, costi]);

  const conviene = results
    ? results.forf.netto > results.ord.netto ? 'forfetario' : 'ordinario'
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Simulatore Tasse 2026
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Calcola imposte, contributi INPS e netto stimato. Confronta Forfetario vs Ordinario.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 mb-8 space-y-6">
          {/* Regime */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Regime fiscale</label>
            <div className="flex gap-2">
              {(['forfetario', 'ordinario'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRegime(r); setShowResults(false); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    regime === r
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === 'forfetario' ? '🏷️ Forfetario' : '🏢 Ordinario'}
                </button>
              ))}
            </div>
          </div>

          {/* Fatturato */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Fatturato annuo lordo (€)</label>
            <input
              type="number"
              value={fatturato}
              onChange={(e) => { setFatturato(e.target.value); setShowResults(false); }}
              placeholder="es. 50000"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* ATECO */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Categoria ATECO
              <span className="font-normal text-slate-400 ml-1">(coeff. redditività: {Math.round(ateco.coeff * 100)}%)</span>
            </label>
            <select
              value={atecoIdx}
              onChange={(e) => { setAtecoIdx(Number(e.target.value)); setShowResults(false); }}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {ATECO_CATEGORIES.map((cat, i) => (
                <option key={cat.value} value={i}>
                  {cat.label} — {Math.round(cat.coeff * 100)}%
                </option>
              ))}
            </select>
          </div>

          {/* Forfetario: aliquota */}
          {regime === 'forfetario' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Aliquota sostitutiva</label>
              <div className="flex gap-2">
                {([5, 15] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAliquotaForf(a); setShowResults(false); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      aliquotaForf === a
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {a}% {a === 5 ? '(primi 5 anni)' : '(standard)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ordinario: costi */}
          {regime === 'ordinario' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Costi deducibili (€)</label>
              <input
                type="number"
                value={costiDeducibili}
                onChange={(e) => { setCostiDeducibili(e.target.value); setShowResults(false); }}
                placeholder="es. 15000"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          )}

          {/* INPS */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Gestione INPS</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setInpsType('separata'); setShowResults(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  inpsType === 'separata'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Gestione Separata (26,07%)
              </button>
              <button
                onClick={() => { setInpsType('artigiani'); setShowResults(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  inpsType === 'artigiani'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Artigiani/Commercianti (~24%)
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowResults(true)}
            disabled={fat <= 0}
            className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold text-base hover:bg-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            📊 Calcola
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-in">
            {/* Conviene badge */}
            <div className="text-center">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full">
                💡 Con i tuoi dati conviene il regime <span className="uppercase">{conviene}</span> — risparmi €{fmt(Math.abs(results.forf.netto - results.ord.netto))}/anno
              </span>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <ResultCard
                title="🏷️ Forfetario"
                data={results.forf}
                fatturato={fat}
                accent={conviene === 'forfetario' ? 'ring-2 ring-emerald-400' : ''}
              />
              <ResultCard
                title="🏢 Ordinario"
                data={results.ord}
                fatturato={fat}
                accent={conviene === 'ordinario' ? 'ring-2 ring-emerald-400' : ''}
              />
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 text-center">
              ⚠️ Simulazione indicativa. Non tiene conto di detrazioni, addizionali regionali/comunali, contributi minimi già versati e altri fattori. Consulta un commercialista per dati precisi.
            </p>

            {/* CTA */}
            <div className="text-center pt-4 pb-8">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-800 transition-all shadow-lg text-base"
              >
                Vuoi una consulenza personalizzata? Chiedi a Taxami AI →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
