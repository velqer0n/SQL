// Cloudflare Worker: shared proxy for the Bugsy AI assistant.
//
// Why this exists: QueryPath is a static site (GitHub Pages), so it can't
// safely hold a secret API key in the browser. This tiny Worker holds the
// key server-side and forwards chat requests to Anthropic, so you and the
// people you share the site with don't each need their own key.
//
// SETUP:
// 1. Go to https://dash.cloudflare.com -> Workers & Pages -> Create Worker.
// 2. Paste this whole file in as the Worker code.
// 3. In the Worker's Settings -> Variables, add a secret:
//      ANTHROPIC_API_KEY = sk-ant-...
// 4. In Settings -> Variables, also add ALLOWED_ORIGIN, e.g.
//      ALLOWED_ORIGIN = https://yourusername.github.io
//    (use "*" while testing locally, tighten it once deployed)
// 5. Deploy. Copy the worker URL (https://xxx.workers.dev) into
//    QueryPath's Profile -> ИИ-ассистент -> "Общий прокси" field.

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('Bad JSON', { status: 400, headers: corsHeaders });
    }

    const { system, messages } = payload;
    if (!Array.isArray(messages)) {
      return new Response('Missing messages', { status: 400, headers: corsHeaders });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: system || '',
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: anthropicRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await anthropicRes.json();
    const reply = (data.content || []).map((b) => b.text || '').join('\n');

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};
