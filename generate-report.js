/* ══════════════════════════════════════════════════════════════
   Seoul Skin Atelier — Vercel API Route
   파일 위치: /api/generate-report.js
   
   역할:
   - 브라우저에서 Profile JSON 수신
   - Claude API 키를 서버 환경변수에서 안전하게 사용
   - 무료/유료 섹션 분리해서 Claude 호출
   - 응답 JSON 브라우저에 반환
   
   환경변수 (Vercel Dashboard에서 설정):
   - ANTHROPIC_API_KEY=sk-ant-...
══════════════════════════════════════════════════════════════ */

export const config = {
  runtime: 'nodejs', // Vercel Edge Function — 빠른 응답, 전세계 분산
};

/* ──────────────────────────────────────────────────────────────
   CORS 설정 — seoulskinatelier.com에서만 허용
────────────────────────────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  'https://seoulskinatelier.com',
  'https://www.seoulskinatelier.com',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

/* ──────────────────────────────────────────────────────────────
   SYSTEM PROMPT — Claude API에 넘기는 페르소나 설정
────────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are a senior K-beauty skin consultant at Seoul Skin Atelier writing personalized skin analysis reports for American millennial women (ages 25–38) discovering K-beauty.

Your voice: warm, authoritative, empathetic, direct. Never generic — every sentence must reference the specific profile data provided. Elevated but accessible prose. No filler, no hedging.

Return ONLY valid JSON. No markdown, no backticks, no explanation outside the JSON.`;

/* ──────────────────────────────────────────────────────────────
   FREE SECTIONS PROMPT (S1~S4 + S9)
   결제 없이 생성 — 원가 ~$0.003
────────────────────────────────────────────────────────────── */
function buildFreePrompt(profile) {
  const T = profile.templates;
  const S = profile.scores;
  const F = profile.flags;

  return `Generate the FREE sections of a personalized skin analysis report.

=== SKIN PROFILE ===
Archetype: ${profile.archetype}
Final title: ${profile.final_title}
Barrier status: ${T.barrier_modifier.mode} (${T.barrier_modifier.label || 'healthy'})
Sensitivity level: ${T.sensitivity_modifier.level}
Acne level: ${profile.acne_level}
SPF needed: ${profile.spf}
Tags: ${profile.tags.slice(0, 10).join(', ')}
Scores: hydration ${S.hydration}, oil ${S.oil}, sensitivity ${S.sensitivity}, barrier_damage ${S.barrier_damage}, acne ${S.acne}
Flags: barrier_mode=${F.barrier_mode}, full_makeup=${F.full_makeup}, outdoor_heavy=${F.high_uv}, sudden_worsening=${F.sudden_worsening}

=== TEMPLATE CONTENT (elevate and personalize) ===
profile_base.description: "${T.profile_base.description}"
barrier_modifier.text: "${T.barrier_modifier.text}"
sensitivity_modifier.text: "${T.sensitivity_modifier.text}"
critical_insight: "${T.critical_insight}"

=== RAW ANSWERS ===
Top concerns: ${profile.raw.top_concerns.join(', ')}
Post-cleanse feel: ${profile.raw.post_cleanse}
Midday change: ${profile.raw.midday}
Recent skin change: ${profile.raw.recent_change}
Product reactions: ${profile.raw.reactions.join(', ')}

=== OUTPUT: Return this exact JSON structure ===
{
  "section1_intro": "2-3 sentences. Rewrite profile_base.description with personality. Reference their specific midday behavior and post-cleanse feel. End with a sentence that makes them want to read on.",

  "section2_patterns": [
    "pattern 1 — specific to their answers",
    "pattern 2",
    "pattern 3",
    "pattern 4"
  ],

  "section3_critical": "2-3 sentences. Elevate the critical_insight. Be direct and expert. If barrier_mode=true, open with the barrier warning. Reference their specific reactions and recent skin change.",

  "section4_wrongs": [
    "wrong behavior 1 — specific to their profile",
    "wrong behavior 2",
    "wrong behavior 3",
    "wrong behavior 4"
  ],

  "section9_final": "2-3 sentences. Motivating, honest, direct. Reference their archetype by name. End with one clear action directive that naturally leads to the paid report."
}`;
}

/* ──────────────────────────────────────────────────────────────
   PAID SECTIONS PROMPT (S5~S8 + Pre-Makeup + SPF)
   결제 후 생성 — 원가 ~$0.01
────────────────────────────────────────────────────────────── */
function buildPaidPrompt(profile) {
  const T = profile.templates;
  const R = profile.routine; // buildRoutineProfile() 결과
  const S = profile.scores;
  const F = profile.flags;

  const amStepsText = R.am.map((s, i) =>
    `Step ${i + 1}: ${s.title} — ${s.desc}`
  ).join('\n');

  const pmStepsText = R.pm.map((s, i) =>
    `Step ${i + 1}: ${s.title} — ${s.desc}`
  ).join('\n');

  const preMakeupText = R.pre_makeup
    ? R.pre_makeup.map((s, i) => `Step ${i + 1}: ${s.step} — ${s.why}`).join('\n')
    : 'Not applicable (no makeup)';

  const spf = R.spf_strategy;
  const spfText = `Purpose: ${spf.purpose}
SPF grade: ${spf.spf_grade}
Filter type: ${spf.filter_type} / ${spf.filter_note}
Formula: ${spf.formula_type}
Strategy: ${spf.extra_strategy}
Optional: ${spf.optional}`;

  const modifiersText = R.condition_modifiers
    .map(m => m.extra_note || m.note || m.adjust_all || '')
    .filter(Boolean)
    .join(' | ');

  return `Generate the PAID sections of a personalized skin analysis report.

=== SKIN PROFILE ===
Archetype: ${profile.archetype}
Final title: ${profile.final_title}
Barrier mode: ${F.barrier_mode}
Sensitivity: ${T.sensitivity_modifier.level}
Acne level: ${profile.acne_level}
Full makeup user: ${F.full_makeup}
High UV exposure: ${F.high_uv}
Tags: ${profile.tags.slice(0, 10).join(', ')}
Scores: hydration ${S.hydration}, oil ${S.oil}, sensitivity ${S.sensitivity}, barrier_damage ${S.barrier_damage}, acne ${S.acne}

=== ROUTINE TEMPLATE (already selected by scoring engine) ===
--- AM STEPS ---
${amStepsText}

--- PM STEPS ---
${pmStepsText}

--- PRE-MAKEUP ROUTINE ---
${preMakeupText}

--- SUNSCREEN STRATEGY ---
${spfText}

--- CONDITION MODIFIERS ---
${modifiersText || 'None'}

=== PRODUCTS (already matched) ===
${T.products.map(p => `${p.tierLabel}: ${p.name} — ${p.why} (Key: ${p.key})`).join('\n')}

=== OUTPUT: Return this exact JSON structure ===
{
  "section5_routine": {
    "am": [
      {"name": "step name", "why": "elevated, specific reason referencing their skin profile"},
      ...
    ],
    "pm": [
      {"name": "step name", "why": "specific reason"},
      ...
    ],
    "pre_makeup": [
      {"name": "step name", "why": "specific reason — only if makeup_load >= 1"},
      ...
    ],
    "spf_strategy": {
      "headline": "One sentence summary of their SPF strategy",
      "spf_grade": "${spf.spf_grade}",
      "filter_recommendation": "Natural language explanation of mineral vs chemical choice for their skin",
      "formula_guidance": "What texture/formula to look for and why",
      "reapplication_note": "How and when to reapply based on their lifestyle"
    }
  },

  "section6_ingredients": {
    "good": [
      {"name": "ingredient", "why": "why it specifically helps this archetype"},
      {"name": "ingredient", "why": "..."},
      {"name": "ingredient", "why": "..."},
      {"name": "ingredient", "why": "..."}
    ],
    "bad": [
      {"name": "ingredient", "why": "why to avoid given their barrier/sensitivity status"},
      {"name": "ingredient", "why": "..."},
      {"name": "ingredient", "why": "..."},
      {"name": "ingredient", "why": "..."}
    ]
  },

  "section7_products": [
    {
      "tier": "budget",
      "tierLabel": "Budget Pick",
      "name": "${T.products[0]?.name || ''}",
      "why": "Elevated explanation of why this matches their specific skin profile — not just generic product benefits",
      "key": "${T.products[0]?.key || ''}"
    },
    {
      "tier": "best",
      "tierLabel": "Best Seller",
      "name": "${T.products[1]?.name || ''}",
      "why": "...",
      "key": "${T.products[1]?.key || ''}"
    },
    {
      "tier": "premium",
      "tierLabel": "Premium",
      "name": "${T.products[2]?.name || ''}",
      "why": "...",
      "key": "${T.products[2]?.key || ''}"
    }
  ],

  "section8_timeline": [
    {"week": 1, "desc": "Specific to their journey — barrier recovery, acne clearing, or maintenance"},
    {"week": 2, "desc": "..."},
    {"week": 4, "desc": "..."},
    {"week": 8, "desc": "..."}
  ]
}`;
}

/* ──────────────────────────────────────────────────────────────
   Claude API 호출 공통 함수
────────────────────────────────────────────────────────────── */
async function callClaude(prompt, maxTokens = 2000) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.content.map(i => i.text || '').join('');
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    throw new Error(`JSON parse failed: ${clean.slice(0, 200)}`);
  }
}

/* ──────────────────────────────────────────────────────────────
   Supabase products 테이블에서 아키타입 맞는 제품 조회
   suitable_for 배열에 archetype 포함된 제품 중
   price_tier별 1개씩 (budget / mid / premium) 반환
────────────────────────────────────────────────────────────── */
async function fetchProducts(archetype, scores) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // 환경변수 없으면 빈 배열 (하드코딩 폴백은 skin-survey.html의 products_db)
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    // suitable_for 배열에 archetype 포함 + is_active = true
    // oil/sensitivity 스코어 상한 체크
    const oilScore = scores.oil || 50;
    const sensitivityScore = scores.sensitivity || 50;

    const url = new URL(`${supabaseUrl}/rest/v1/products`);
    url.searchParams.set('select', 'id,name,brand,asin,affiliate_url,category,texture,price_tier,key_ingredients,why,use_when');
    url.searchParams.set('is_active', 'eq.true');
    url.searchParams.set('suitable_for', `cs.{"${archetype}"}`);
    url.searchParams.set('oil_score_max', `gte.${oilScore}`);
    url.searchParams.set('sensitivity_max', `gte.${sensitivityScore}`);
    url.searchParams.set('order', 'rating_avg.desc,feedback_count.desc');

    const res = await fetch(url.toString(), {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) return null;
    const products = await res.json();

    // price_tier별 1개씩 선택
    const tiers = { budget: null, mid: null, premium: null };
    const tierLabels = { budget: 'Best under $25', mid: 'Best mid-range', premium: 'Premium pick' };

    for (const p of products) {
      const tier = p.price_tier;
      if (tiers[tier] === null) {
        tiers[tier] = {
          tier,
          tierLabel: tierLabels[tier] || tier,
          name: p.name,
          brand: p.brand,
          why: p.why,
          key: p.key_ingredients,
          texture: p.texture,
          useWhen: p.use_when,
          affiliateUrl: p.affiliate_url,
        };
      }
      if (tiers.budget && tiers.mid && tiers.premium) break;
    }

    // null 제거 후 반환 (최소 1개 이상 있으면 사용)
    const result = Object.values(tiers).filter(Boolean);
    return result.length > 0 ? result : null;

  } catch (e) {
    console.error('fetchProducts error:', e);
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────
   결제 검증 — Supabase에서 확인
────────────────────────────────────────────────────────────── */
async function verifyPayment(sessionId) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // service role key (서버 전용)

  if (!supabaseUrl || !supabaseKey) return false;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/payments?session_id=eq.${sessionId}&status=eq.completed&select=id`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  const data = await res.json();
  return Array.isArray(data) && data.length > 0;
}

/* ──────────────────────────────────────────────────────────────
   MAIN HANDLER
────────────────────────────────────────────────────────────── */
export default async function handler(req) {
  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { profile, mode, session_id } = body;

    // 기본 검증
    if (!profile || !profile.archetype || !profile.scores) {
      return new Response(JSON.stringify({ error: 'Invalid profile data' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // mode: 'free' | 'paid'
    if (mode === 'paid') {
      // 결제 검증
      const isPaid = await verifyPayment(session_id);
      if (!isPaid) {
        return new Response(JSON.stringify({ error: 'Payment not verified' }), {
          status: 403,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      // Supabase에서 제품 조회 — 있으면 profile에 주입, 없으면 하드코딩 폴백
      const dbProducts = await fetchProducts(profile.archetype, profile.scores);
      if (dbProducts) {
        profile.templates.products = dbProducts;
      }

      // 유료 섹션 생성 (S5~S8)
      const paidData = await callClaude(buildPaidPrompt(profile), 3000);
      // products DB 데이터를 응답에 포함 (리포트 렌더링에 필요)
      paidData.section_products_db = profile.templates.products;
      return new Response(JSON.stringify({ success: true, data: paidData, mode: 'paid' }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });

    } else {
      // 무료 섹션 생성 (S1~S4 + S9)
      const freeData = await callClaude(buildFreePrompt(profile), 1500);
      return new Response(JSON.stringify({ success: true, data: freeData, mode: 'free' }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

  } catch (err) {
    console.error('API Route error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
}
