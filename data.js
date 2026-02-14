export const SLIDES_DATA = [
  {
    id: 1,
    type: 'start',
    title: 'Strategie 2025',
    subtitle: 'Innovation durch minimalistisches Design',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 2,
    type: 'table',
    title: 'Marktanalyse & Kennzahlen',
    headers: ['Kategorie', 'Q1 2024', 'Q2 2024', 'Wachstum'],
    rows: [
      ['Cloud Services', '€ 1.2M', '€ 1.8M', '+50%'],
      ['SaaS Platform', '€ 850K', '€ 920K', '+8.2%'],
      ['Professional Services', '€ 430K', '€ 410K', '-4.6%'],
      ['R&D Investitionen', '€ 310K', '€ 450K', '+45.1%'],
      ['Marketing Budget', '€ 200K', '€ 250K', '+25%']
    ]
  },
  {
    id: 3,
    type: 'code',
    title: 'API Integration',
    language: 'JavaScript',
    code: `// Initialisierung der Presentation Pro API
const api = new PresentationPro({
  apiKey: 'pp_live_7x92kLp0',
  theme: 'minimalist',
  autoPlay: false
});

async function startPresentation() {
  try {
    await api.connect();
    console.log('Verbindung erfolgreich aufgebaut');
    api.slides.next();
  } catch (error) {
    console.error('Initialisierungsfehler:', error);
  }
}`
  },
  {
    id: 4,
    type: 'audio-player',
    title: 'Media Playlist',
    tracks: [
      { title: 'Innovation Focus', artist: 'Corporate Sound', file: '/audio/track1.mp3' },
      { title: 'Deep Work Beats', artist: 'Ambient Master', file: '/audio/track2.mp3' },
      { title: 'Strategic Planning', artist: 'Future Beats', file: '/audio/track3.mp3' }
    ]
  },
  {
    id: 5,
    type: 'list',
    title: 'Vorteile der App',
    list: [
      { label: 'Geschwindigkeit', detail: 'Durch den Verzicht auf schwere Frameworks erreichen wir Ladezeiten unter 100ms.' },
      { label: 'Interaktivität', detail: 'Aufklappbare Unterpunkte ermöglichen eine gezielte Informationssteuerung während des Vortrags.' },
      { label: 'Visualisierung', detail: 'Integrierte Lightbox für hochauflösende Bildbetrachtung ohne Kontextverlust.' }
    ]
  },
  {
    id: 6,
    type: 'text-image',
    title: 'Fokus auf Details',
    content: 'Wir glauben, dass wahre Qualität in den kleinsten Details steckt. Unsere Benutzeroberfläche ist darauf optimiert, Ablenkungen zu minimieren und den Fokus auf das Wesentliche zu lenken.',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 7,
    type: 'image-text',
    title: 'Globale Reichweite',
    content: 'Egal wo Sie sich befinden, unsere Cloud-Infrastruktur stellt sicher, dass Ihre Präsentationen weltweit mit maximaler Performance ausgeliefert werden.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 8,
    type: 'gallery',
    title: 'Unsere Architektur',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', caption: 'Modernes Dashboard Interface' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', caption: 'Server-Infrastruktur Analyse' },
      { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', caption: 'Clean Code Standards' },
      { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80', caption: 'Agile Team-Kollaboration' },
      { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', caption: 'UX Research Sessions' },
      { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', caption: 'Strategische Planung' }
    ]
  },
  {
    id: 9,
    type: 'video-grid',
    title: 'Video Ressourcen',
    videos: [
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=500&q=80', description: 'Einführung in das System' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80', description: 'Tutorial: Erste Schritte' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80', description: 'Best Practices 2024' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=500&q=80', description: 'Advanced Features' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80', description: 'Entwickler-Dokumentation' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80', description: 'Sicherheits-Protokolle' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80', description: 'Skalierung & Performance' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80', description: 'Zukunftsaussichten' },
      { videoId: 'dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80', description: 'Abschlusspräsentation' }
    ]
  },
  {
    id: 10,
    type: 'end',
    title: 'Fragen?',
    subtitle: 'Vielen Dank für Ihre Aufmerksamkeit.'
  }
];