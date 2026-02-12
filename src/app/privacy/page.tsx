export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Ultimo aggiornamento: Gennaio 2024</p>

      {[
        {
          title: '1. Titolare del Trattamento',
          content: 'Il titolare del trattamento dei dati personali è Taxami S.r.l., con sede legale in Milano (MI), Italia. Email: privacy@taxami.it',
        },
        {
          title: '2. Dati Raccolti',
          content: 'Raccogliamo i seguenti dati: dati identificativi (nome, email), dati di utilizzo del servizio (domande poste, documenti caricati), dati tecnici (indirizzo IP, tipo di browser). Non raccogliamo dati sensibili se non strettamente necessario al servizio richiesto.',
        },
        {
          title: '3. Finalità del Trattamento',
          content: 'I dati sono trattati per: erogazione del servizio di consulenza fiscale AI, miglioramento del servizio, comunicazioni relative al servizio, adempimenti di legge.',
        },
        {
          title: '4. Base Giuridica',
          content: 'Il trattamento è basato sul consenso dell\'utente e sull\'esecuzione del contratto di servizio. Per gli adempimenti di legge, la base giuridica è l\'obbligo legale.',
        },
        {
          title: '5. Conservazione dei Dati',
          content: 'I dati personali sono conservati per il tempo necessario alle finalità per cui sono stati raccolti. I documenti fiscali caricati sono conservati per 10 anni come previsto dalla normativa fiscale italiana.',
        },
        {
          title: '6. Diritti dell\'Interessato',
          content: 'L\'utente ha diritto di: accedere ai propri dati, rettificarli, cancellarli, limitarne il trattamento, opporsi al trattamento, ricevere i dati in formato strutturato (portabilità). Per esercitare i propri diritti: privacy@taxami.it',
        },
        {
          title: '7. Cookie',
          content: 'Utilizziamo cookie tecnici necessari al funzionamento del sito e cookie analitici (previo consenso) per migliorare l\'esperienza utente.',
        },
        {
          title: '8. Sicurezza',
          content: 'Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali, inclusa la crittografia dei dati in transito e a riposo.',
        },
      ].map(section => (
        <div key={section.title} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
        </div>
      ))}

      <div className="mt-10 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          Per qualsiasi domanda relativa alla privacy, contattaci a <strong>privacy@taxami.it</strong>
        </p>
      </div>
    </div>
  );
}
