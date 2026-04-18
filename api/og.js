// Vercel Edge Function — OG Image Generator
// seoulskinatelier.com/api/og?archetype=dehydrated_oily&scores=25,78,72

export const config = { runtime: 'edge' };

const ARCHETYPES = {
  dehydrated_oily:        { name: 'The Compensator', hook: "Your shine isn't oiliness. It's your skin screaming for water." },
  balanced_oily:          { name: 'The Overproducer', hook: "Your skin is producing oil correctly — there's just too much of it." },
  dry_sensitive:          { name: 'The Fragile',      hook: "Your barrier is struggling. Every irritation is a signal, not a flaw." },
  dehydrated_sensitive:   { name: 'The Reactor',      hook: "Dehydrated and reactive — your skin is caught in a feedback loop." },
  combination_dehydrated: { name: 'The Juggler',      hook: "Two zones, two needs. Your T-zone and cheeks speak different languages." },
  balanced_normal:        { name: 'The Balanced',     hook: "Your skin is stable. The question is: where do you want to take it?" },
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const archetype = searchParams.get('archetype') || 'balanced_normal';
  const size      = searchParams.get('size') || 'og'; // og | pin
  const hydration = searchParams.get('h') || '—';
  const oil       = searchParams.get('o') || '—';
  const barrier   = searchParams.get('b') || '—';

  const a = ARCHETYPES[archetype] || ARCHETYPES.balanced_normal;
  const isPin = size === 'pin';

  // SVG 기반 이미지 생성 (Vercel OG는 Satori 사용)
  const { default: satori } = await import('https://esm.sh/satori@0.10.13');
  const { Resvg }           = await import('https://esm.sh/@resvg/resvg-js@2.4.1');

  const cormorantFont = await fetch(
    'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff'
  ).then(r => r.arrayBuffer());

  const dmSansFont = await fetch(
    'https://fonts.gstatic.com/s/dmsans/v14/rP2Hp2ywxg089UriCZa4ET-DNl0.woff'
  ).then(r => r.arrayBuffer());

  const w = isPin ? 1000 : 1200;
  const h = isPin ? 1500 : 630;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: w, height: h,
          background: '#2C2416',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isPin ? 'center' : 'space-between',
          alignItems: isPin ? 'center' : 'flex-start',
          padding: isPin ? '80px 60px' : '48px 56px',
          fontFamily: 'DM Sans',
        },
        children: [
          // Brand
          { type: 'div', props: { style: { fontSize: 14, letterSpacing: 6, textTransform: 'uppercase', color: '#8C7355', fontWeight: 600, marginBottom: isPin ? 24 : 0 }, children: 'SEOUL SKIN ATELIER' } },
          // Label
          { type: 'div', props: { style: { fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', color: '#D4C4A8', marginTop: isPin ? 8 : 'auto', marginBottom: 10, textAlign: isPin ? 'center' : 'left' }, children: 'Your Skin Archetype' } },
          // Name
          { type: 'div', props: { style: { fontSize: isPin ? 56 : 52, fontWeight: 300, color: '#F9F5EF', fontFamily: 'Cormorant', fontStyle: 'italic', marginBottom: 12, textAlign: isPin ? 'center' : 'left' }, children: a.name } },
          // Hook
          { type: 'div', props: { style: { fontSize: isPin ? 20 : 18, color: 'rgba(212,196,168,0.85)', fontStyle: 'italic', lineHeight: 1.7, maxWidth: isPin ? 700 : 660, marginBottom: isPin ? 40 : 24, textAlign: isPin ? 'center' : 'left' }, children: `"${a.hook}"` } },
          // Metrics (if provided)
          ...(hydration !== '—' ? [{
            type: 'div',
            props: {
              style: { display: 'flex', gap: 40, flexDirection: isPin ? 'column' : 'row', alignItems: isPin ? 'center' : 'flex-start', marginBottom: 'auto' },
              children: [
                { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: isPin ? 'center' : 'flex-start' }, children: [
                  { type: 'div', props: { style: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#8C7355', marginBottom: 4 }, children: 'Hydration' } },
                  { type: 'div', props: { style: { fontSize: isPin ? 40 : 28, fontWeight: 700, color: Number(hydration) < 40 ? '#C4826A' : '#6DB8F0' }, children: hydration } },
                ]}},
                { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: isPin ? 'center' : 'flex-start' }, children: [
                  { type: 'div', props: { style: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#8C7355', marginBottom: 4 }, children: 'Oil Balance' } },
                  { type: 'div', props: { style: { fontSize: isPin ? 40 : 28, fontWeight: 700, color: Number(oil) > 60 ? '#C4826A' : '#6DB8F0' }, children: oil } },
                ]}},
                { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: isPin ? 'center' : 'flex-start' }, children: [
                  { type: 'div', props: { style: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#8C7355', marginBottom: 4 }, children: 'Barrier' } },
                  { type: 'div', props: { style: { fontSize: isPin ? 40 : 28, fontWeight: 700, color: Number(barrier) < 40 ? '#C4826A' : '#6DB8F0' }, children: barrier } },
                ]}},
              ]
            }
          }] : []),
          // CTA
          { type: 'div', props: { style: { fontSize: 15, color: '#B8864E', letterSpacing: 1, marginTop: isPin ? 40 : 'auto', textAlign: isPin ? 'center' : 'left' }, children: '→ What\'s your skin archetype?  seoulskinatelier.com' } },
        ]
      }
    },
    {
      width: w, height: h,
      fonts: [
        { name: 'DM Sans',    data: dmSansFont,    weight: 400, style: 'normal' },
        { name: 'DM Sans',    data: dmSansFont,    weight: 600, style: 'normal' },
        { name: 'Cormorant',  data: cormorantFont, weight: 300, style: 'italic' },
      ],
    }
  );

  const resvg  = new Resvg(svg, { fitTo: { mode: 'width', value: w } });
  const pngData = resvg.render();
  const pngBuf  = pngData.asPng();

  return new Response(pngBuf, {
    headers: {
      'Content-Type':  'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
