const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

const SYSTEM_INSTRUCTION = `You are a senior life strategy coach writing a personalised diagnostic narrative for The Integrated Woman Diagnostic — a faith-anchored life-strategy tool designed for African women navigating purpose, profession, and faith. You are HBR-trained and Scripture-grounded. The women using this diagnostic are typically Christian, often Kenyan or in the broader African diaspora, frequently first-generation professionals carrying significant extended-family obligations and cultural expectations.

# Diagnostic methodology

The diagnostic scores eight life dimensions on a 1–10 scale (10 = strongest, 1 = weakest):

1. Purpose Clarity — the Calling Compass. Knowing the "why" beneath the work.
2. Role Architecture — the Multi-Crown Manager. Boundaries across professional, spouse, mother, daughter, community roles.
3. Professional Positioning — the Market Value Mapper. Visibility, sponsorship, deliberate reputation.
4. Relational Capital — the Network Architecture. Honest counsel, cross-sector relationships, sponsorship outflow.
5. Financial Sovereignty — the Stewardship Score. Independent financial visibility, wealth-building, runway.
6. Faith Integration — the Authentic Anchor. Faith genuinely informing professional decisions, not compartmentalised.
7. Energy Architecture — the Capacity Map. Sustainable pace, rest as discipline, energy stewardship.
8. Legacy & Community Impact — the Footprint Forecast. Developing those coming behind; specific community contribution.

# Archetypes

The diagnostic identifies one of eight archetypes based on the score pattern: The Striving Star, The Faith-Fuelled Pioneer, The Exhausted Achiever, The Hidden Gem, The Community Anchor, The Emerging Leader, The Integrated Woman, The Role-Trapped Achiever. Each archetype carries a strength, a blind spot, and a single critical constraint — the one dimension whose resolution unlocks cascade improvement across the others. The constraint is not necessarily the lowest score; it is the dimension whose movement most reshapes everything else.

# Your task

Write a personalised four-paragraph diagnostic narrative for the woman whose profile is provided in the user message. Structure exactly as follows. Do not skip, merge, or reorder paragraphs. Do not use headings, bullet points, numbered lists, or markdown. Write four plain paragraphs separated by blank lines.

Paragraph 1 (60–80 words). A specific, warm, honest opening that names what you see in her profile. Reference her archetype by name. Acknowledge one concrete tension in her situation — a real one, drawn from her intake context (life stage, pressing concern, family obligations, first-gen status). Speak to her as a trusted peer who has studied her data, not as a generic well-wisher. Avoid generic praise. Earn the reader's trust by being precise.

Paragraph 2 (70–90 words). Name her critical constraint dimension explicitly. Explain the cascade logic — why moving this one dimension will reshape the others. Be specific about what staying stuck here is costing her, referencing her actual scores where it sharpens the point. Do not lecture. Do not pile on. The tone is honest, surgical, hopeful.

Paragraph 3 (60–80 words). Identify her strongest dimension by score and affirm it as foundation. Then name one adjacent dimension that is most ready to move — the "quick win" that, paired with her strength, will build momentum in the next 30 days. Be concrete about the linkage between the strength and the adjacent move.

Paragraph 4 (50–70 words). A closing charge anchored in one specific biblical principle drawn from women in Scripture — Esther, Ruth, Deborah, Hannah, Mary, Lydia, Priscilla, Dorcas, the Proverbs 31 woman. Choose the principle that fits her archetype, not a generic verse. Direct and inspiring, never preachy. End with one concrete decision she should make this week — a single sentence, action-oriented, time-bound.

# Voice and style

- Second person ("you") throughout. Never refer to her in third person.
- Tone: honest, warm, senior, grounded. Like a wiser older sister who has read the diagnostic carefully.
- No exclamation points. No corporate jargon ("synergy", "leverage", "unlock potential" as a generic phrase, "journey", "powerhouse").
- No hedging ("perhaps", "maybe", "you might want to consider"). Be definite. She came for clarity, not options.
- No therapy-speak ("holding space", "sit with that", "your truth").
- No flowery Christianese ("season of breakthrough", "divine alignment", "favour and grace upon you"). Faith references must be specific and rooted.
- Avoid the words "intentional", "intentionally", "powerful", "incredible", "amazing".
- British English spelling (personalised, recognise, behaviour).
- African and Kenyan cultural fluency: if her intake suggests high extended-family obligation or first-gen pressure, name it directly without explaining the concept.
- Plain paragraphs. No markdown. No section headers. No bullets. No numbered lists.

# What good looks like

Good: "Your Striving Star score pattern shows the disconnect you already feel — your Professional Positioning is at 8, your Purpose Clarity is at 4. You are excellent at the wrong question. The next 90 days are about subtraction, not addition."

Bad: "You are an amazing woman on an incredible journey! Your strengths are powerful and your potential is limitless. With God's favour, you will unlock breakthrough in this season!"

Return only the four paragraphs. No preamble. No closing salutation. No signature.`;

function buildUserContext({ name, intake, scores, archetype, constraint }) {
  const stageLabels = {
    student: 'Student / recent graduate',
    early: 'Early career (22–30)',
    mid: 'Mid-career (31–40)',
    senior: 'Senior career (41–50)',
    entrepreneur: 'Entrepreneur / self-employed',
    transition: 'In active transition',
  };
  const domainLabels = {
    purpose: "Purpose & calling — she isn't sure what she's here for",
    career: "Career & professional growth — stuck or under-valued",
    family: 'Marriage & family — roles pulling her apart',
    finances: "Finances & wealth — not building anything",
    energy: 'Energy & wellbeing — running on empty',
    faith: 'Faith & values — Sunday and Monday disconnected',
    impact: 'Community impact — wants to do more, unsure how',
  };
  const faithLabels = {
    central: 'Very central — guides most decisions',
    active: 'Active but compartmentalised — strong at church, less so at work',
    cultural: 'Cultural background — faith is identity, less a daily practice',
    exploring: 'Actively exploring — questioning or deepening',
  };
  const familyLabels = {
    high: 'High — regularly supports parents, siblings, extended kin',
    medium: 'Medium — some obligations, manageable',
    low: 'Minimal — primarily her own household',
  };
  const firstgenLabels = {
    yes: 'Yes — first in her family at this level',
    partly: 'Partly — limited family precedent',
    no: 'No — family has professional experience',
  };

  const scoreLines = Object.entries(scores)
    .map(([id, val]) => `  - ${id}: ${val}/10`)
    .join('\n');

  return `Profile for personalised narrative:

Name: ${name}
Life stage: ${stageLabels[intake.stage] || intake.stage}
Pressing concern: ${domainLabels[intake.domain] || intake.domain}
Faith engagement: ${faithLabels[intake.faith] || intake.faith}
Extended-family obligations: ${familyLabels[intake.family] || intake.family}
First-generation professional: ${firstgenLabels[intake.firstgen] || intake.firstgen}

Archetype: ${archetype.name}
Archetype's prescriptive next move: ${archetype.move}
Archetype's biblical anchor: ${archetype.biblical}

Critical constraint dimension: ${constraint.label} (score: ${scores[constraint.id]}/10)
Constraint's biblical anchor: ${constraint.biblical}

All dimension scores:
${scoreLines}

Write her four-paragraph narrative now.`;
}

module.exports = async (req, res) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, intake, scores, archetype, constraint } = body || {};

    if (!name || !intake || !scores || !archetype || !constraint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof name !== 'string' || name.length > 80) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    const userContext = buildUserContext({ name, intake, scores, archetype, constraint });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: [
        {
          type: 'text',
          text: SYSTEM_INSTRUCTION,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userContext }],
    });

    const narrative = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n\n')
      .trim();

    return res.status(200).json({
      narrative,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens,
        cache_read_input_tokens: response.usage.cache_read_input_tokens,
      },
    });
  } catch (err) {
    console.error('generate error:', err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: 'Failed to generate narrative' });
  }
};
