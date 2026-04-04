/* ══════════════════════════════════════════════════════════════
   Seoul Skin Atelier — Vercel API Route (Node.js runtime)
   파일 위치: /api/generate-report.js/generate-report.js
══════════════════════════════════════════════════════════════ */

const ALLOWED_ORIGINS = [
  'https://seoulskinatelier.com',
  'https://www.seoulskinatelier.com',
];

function getCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function saveToSupabase(table, data) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return Array.isArray(result) ? result[0] : result;
}

const SYSTEM_PROMPT = `You are a senior K-beauty skin consultant at Seoul Skin Atelier writing personalized skin analysis reports for American millennial women (ages 25–38) discovering K-beauty.

Your voice: warm, authoritative, empathetic, direct. Never generic — every sentence must reference the specific profile data provided. Elevated but accessible prose. No filler, no hedging.

Return ONLY valid JSON. No markdown, no backticks, no explanation outside the JSON.`;

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

function buildPaidPrompt(profile) {
  const T = profile.templates;
  const R = profile.routine;
  const S = profile.scores;
  const F = profile.flags;

  const amStepsText = R.am.map((s, i) => `Step ${i + 1}: ${s.title} — ${s.desc}`).join('\n');
  const pmStepsText = R.pm.map((s, i) => `Step ${i + 1}: ${s.title} — ${s.desc}`).join('\n');
  const preMakeupText = R.pre_makeup
    ? R.pre_makeup.map((s, i) => `Step ${i + 1}: ${s.step} — ${s.why}`).join('\n')
    : 'Not applicable (no makeup)';
  const spf = R.spf_strategy;
  const spfText = `Purpose: ${spf.purpose}\nSPF grade: ${spf.spf_grade}\nFilter type: ${spf.filter_type} / ${spf.filter_note}\nFormula: ${spf.formula_type}\nStrategy: ${spf.extra_strategy}\nOptional: ${spf.optional}`;
  const modifiersText = R.condition_modifiers.map(m => m.extra_note || m.note || m.adjust_all || '').filter(Boolean).join(' | ');

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

=== ROUTINE TEMPLATE ===
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

=== PRODUCTS ===
${T.products.map(p => `${p.tierLabel}: ${p.name} — ${p.why} (Key: ${p.key})`).join('\n')}

=== OUTPUT: Return this exact JSON structure ===
{
  "section5_routine": {
    "am": [{"name": "step name", "why": "specific reason"}, "..."],
    "pm": [{"name": "step name", "why": "specific reason"}, "..."],
    "pre_makeup": [{"name": "step name", "why": "specific reason"}, "..."],
    "spf_strategy": {
      "headline": "One sentence summary",
      "spf_grade": "${spf.spf_grade}",
      "filter_recommendation": "mineral vs chemical explanation",
      "formula_guidance": "texture/formula guidance",
      "reapplication_note": "reapplication guidance"
    }
  },
  "section6_ingredients": {
    "good": [{"name": "ingredient", "why": "reason"}, "..."],
    "bad": [{"name": "ingredient", "why": "reason"}, "..."]
  },
  "section7_products": [
    {"tier": "budget", "tierLabel": "Budget Pick", "name": "${T.products[0]?.name || ''}", "why": "explanation", "key": "${T.products[0]?.key || ''}"},
    {"tier": "best", "tierLabel": "Best Seller", "name": "${T.products[1]?.name || ''}", "why": "explanation", "key": "${T.products[1]?.key || ''}"},
    {"tier": "premium", "tierLabel": "Premium", "name": "${T.products[2]?.name || ''}", "why": "explanation", "key": "${T.products[2]?.key || ''}"}
  ],
  "section8_timeline": [
    {"week": 1, "desc": "specific description"},
    {"week": 2, "desc": "specific description"},
    {"week": 4, "desc": "specific description"},
    {"week": 8, "desc": "specific description"}
  ]
}`;
}

async function callClaude(prompt, maxTokens = 2000) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set.');

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

async function verifyPayment(sessionId) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return false;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/payments?session_id=eq.${sessionId}&status=eq.completed&select=id`,
    { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const origin = req.headers['origin'] || '';
  const corsHeaders = getCorsHeaders(origin);

  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readBody(req);
    const { profile, mode, session_id } = body;

    if (!profile || !profile.archetype || !profile.scores) {
      res.status(400).json({ error: 'Invalid profile data' });
      return;
    }

    if (mode === 'paid') {
      const isPaid = await verifyPayment(session_id);
      if (!isPaid) {
        res.status(403).json({ error: 'Payment not verified' });
        return;
      }

      const paidData = await callClaude(buildPaidPrompt(profile), 3000);

      if (body.response_id) {
        await saveToSupabase('reports', {
          response_id: body.response_id,
          report_content: JSON.stringify(paidData),
          is_paid: true,
        });
      }

      res.status(200).json({ success: true, data: paidData, mode: 'paid' });

    } else {
      const freeData = await callClaude(buildFreePrompt(profile), 1500);

      const savedResponse = await saveToSupabase('survey_responses', {
        email: body.email || null,
        archetype: profile.archetype,
        answers: profile.raw,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        is_paid: false,
      });

      const responseId = savedResponse?.id || null;

      if (responseId) {
        await saveToSupabase('reports', {
          response_id: responseId,
          report_content: JSON.stringify(freeData),
          is_paid: false,
        });
      }

      res.status(200).json({
        success: true,
        data: freeData,
        mode: 'free',
        response_id: responseId,
      });
    }

  } catch (err) {
    console.error('API Route error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
