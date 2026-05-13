function isValidEmail(s) {
  if (typeof s !== 'string') return false;
  if (s.length < 5 || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function flattenScores(scores) {
  if (!scores || typeof scores !== 'object') return '';
  return Object.entries(scores)
    .map(([k, v]) => `${k}:${v}`)
    .join(', ');
}

module.exports = async (req, res) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
  if (!apiKey || !baseId) {
    return res.status(500).json({ error: 'Server missing Airtable configuration' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email, name, intake, scores, archetype, constraint, narrative, consent } = body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!name || typeof name !== 'string' || name.length > 80) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    const fields = {
      Email: email.trim().toLowerCase(),
      Name: name.trim(),
      Stage: intake?.stage || '',
      Domain: intake?.domain || '',
      Faith: intake?.faith || '',
      Family: intake?.family || '',
      FirstGen: intake?.firstgen || '',
      Archetype: archetype?.name || '',
      ArchetypeId: archetype?.id || '',
      Constraint: constraint?.label || '',
      ConstraintId: constraint?.id || '',
      Scores: flattenScores(scores),
      Narrative: typeof narrative === 'string' ? narrative.slice(0, 4000) : '',
      Consent: consent === true,
      SubmittedAt: new Date().toISOString(),
    };

    const url = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Airtable error:', resp.status, errText);
      return res.status(502).json({ error: 'Failed to save lead' });
    }

    const data = await resp.json();
    return res.status(200).json({ ok: true, id: data.records?.[0]?.id });
  } catch (err) {
    console.error('lead error:', err);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
};
