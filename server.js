const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const CARD_GUIDE = {
  'The Star': { ko: '별', theme: '희망과 회복', messages: ['희망의 빛이 다시 살아나고 있습니다.', '짧은 혼란은 곧 더 밝은 방향으로 이어지고 있습니다.', '당신이 마음을 낮게 두지 않는 한, 가능성은 분명히 열려 있습니다.'], actions: ['오늘은 작은 긍정적인 선택을 한 번 더 해보세요.', '기대보다 천천히라도 앞으로 나아가 보세요.', '불안한 순간에도, 지금의 한 걸음이 큰 힘이 됩니다.'] },
  'The Moon': { ko: '달', theme: '직관과 내면', messages: ['불안은 답을 피하는 것이 아니라, 더 깊은 감정을 보여주는 신호입니다.', '혼란 속에서도 당신은 이미 감정의 흐름을 느끼고 있습니다.', '지금의 어둠은 결론이 아니라, 더 정직한 인식을 만드는 시간입니다.'], actions: ['조용한 시간을 조금 더 확보해 보세요.', '다른 사람의 답보다, 내면의 감정을 먼저 살펴보세요.', '불안이 커질 때는 한 번 더 멈추고 정리해보는 편이 좋습니다.'] },
  'The Sun': { ko: '태양', theme: '명확함과 기쁨', messages: ['분명한 방향이 서서히 드러나고 있습니다.', '당신의 진심은 이미 더 밝은 쪽으로 움직이고 있습니다.', '불확실함이 줄어들수록, 선택의 중심이 선명해집니다.'], actions: ['지금 가장 중요한 결정을 단호하게 내려보세요.', '자신의 장점을 믿고, 빠르게 한 번 행동해 보세요.', '오늘은 자신감 있는 작은 선택을 해보는 편이 좋습니다.'] },
  'The Hermit': { ko: '은둔자', theme: '성찰과 깊은 이해', messages: ['지금은 답을 찾기보다, 조용히 나를 들여다보는 순간입니다.', '무엇을 숨기고 있는지보다, 무엇을 진심으로 원하는지를 다시 확인해야 합니다.', '가장 깊은 깨달음은 시끄러운 말보다 조용한 인식에서 온다는 걸 기억하세요.'], actions: ['혼자만의 시간을 조금만 더 확보해 보세요.', '조급함을 멈추고, 마음의 충돌을 정리해 보세요.', '내가 무엇을 진짜 원하는지 한 문장으로 적어 보세요.'] },
  'The Empress': { ko: '여제', theme: '돌봄과 풍요', messages: ['당신은 잊고 있던 자원을 다시 받아들이는 중입니다.', '풍요는 무리하게 지키는 것이 아니라, 스스로를 충분히 돌보는 데서 시작됩니다.', '지치고 있을수록, 당신에게 필요한 배려는 더 커집니다.'], actions: ['오늘은 나를 먼저 돌보는 선택을 해 보세요.', '작은 휴식과 안정감부터 우선으로 두세요.', '창조적인 생각을 허용하고, 자신을 버리지 않는 방식으로 움직여 보세요.'] },
  'The Chariot': { ko: '전차', theme: '결단과 추진력', messages: ['이제는 막히는 흐름보다 움직이는 힘이 더 중요합니다.', '한 번의 결단이 지금의 정체를 끊어낼 수 있습니다.', '완벽함보다 방향을 정하고 나아가는 속도가 더 중요합니다.'], actions: ['지금 당장 가장 작은 행동 하나를 실행해 보세요.', '미루기보다 결정을 내리는 쪽이 낫습니다.', '바로 시작할 수 있는 한 가지 계획을 정리해 보세요.'] },
  'The Lovers': { ko: '연인', theme: '선택과 연결', messages: ['이 문제는 감정의 정렬을 묻고 있습니다.', '당신이 진짜로 원하는 연결과, 불편한 수용 사이의 균형이 중요합니다.', '결정은 정답을 찾는 것이 아니라, 당신의 가치에 맞는 선택을 고르는 과정입니다.'], actions: ['가치관이 맞는 선택을 우선해 보세요.', '감정만이 아니라 미래의 느낌까지 함께 보세요.', '연결을 선택할 때는 현실과 마음을 함께 살피세요.'] },
  'The Magician': { ko: '마법사', theme: '가능성과 실행', messages: ['이미 당신 손에 시작할 수 있는 도구가 있습니다.', '계획을 늘리는 것보다, 가진 자원을 활용해 실험하는 단계입니다.', '작은 행동이 큰 변화를 만들기 시작합니다.'], actions: ['오늘 바로 쓸 수 있는 자원부터 확인해 보세요.', '완벽한 순간을 기다리기보다 지금 가능한 일을 해 보세요.', '작은 실험을 통해 가능성을 확인해 보세요.'] },
  'Justice': { ko: '정의', theme: '균형과 진실', messages: ['문제는 감정이 아니라, 사실과 기준을 어떻게 정리하느냐입니다.', '진실을 외면하지 않을 때 선택의 중심이 선명해집니다.', '균형은 감정의 과잉을 줄이는 데서 시작됩니다.'], actions: ['감정과 사실을 분리해서 생각해 보세요.', '결정의 기준을 한 가지 더 명확히 정리해 보세요.', '타인의 의견보다 당신의 기준을 먼저 들여다보세요.'] },
  'Strength': { ko: '힘', theme: '온유한 용기', messages: ['강한 결단은 폭력이 아니라 자신을 지키는 방식입니다.', '지금은 거침없이 밀기보다 차분하게 버티는 것이 필요한 순간입니다.', '당신의 여유가 결국 가장 강한 힘으로 작용할 수 있습니다.'], actions: ['강하게 밀기보다 차분하게 진행해 보세요.', '기억보다 여유를 우선으로 두세요.', '자신을 너무 흔들지 않는 방식으로 나아가 보세요.'] },
  'The World': { ko: '세계', theme: '완성과 확장', messages: ['지금까지의 과정이 어느새 완성의 기운을 만들고 있습니다.', '당신은 한 단계 마무리되면서 다음을 준비하는 시점에 서 있습니다.', '끝이 보이는 순간에는 감사하는 마음이 더 큰 힘이 됩니다.'], actions: ['지금까지 해온 일을 인정하고, 다음 단계로 나아가 보세요.', '완성된 부분을 돌려보고 마음을 정리해 보세요.', '마지막 정리를 통해 더 큰 흐름을 열어 보세요.'] },
  'Death': { ko: '죽음', theme: '전환과 정리', messages: ['지금은 어떤 것을 끝내고 어떤 것을 새로 시작할지 정리하는 시간입니다.', '불필요한 것들이 자연스럽게 내려앉고 있습니다.', '이전의 마감은 새로운 장의 시작을 위한 정리입니다.'], actions: ['지금 불필요한 것을 정리해 보세요.', '무리하게 붙들지 말고 내려놓을 부분을 분명히 보세요.', '새로운 시작을 위해 오늘은 정리부터 해 보세요.'] },
  'The Tower': { ko: '탑', theme: '깨달음과 해방', messages: ['갑작스러운 변화는 불편하지만 오래된 틀을 깨는 기회가 될 수 있습니다.', '현재의 충격은 더 정직한 삶의 방향을 보여주는 계기입니다.', '무너진 구조 속에서 당신이 진짜 필요한 것이 드러나고 있습니다.'], actions: ['불편함을 피하지 말고, 그 속에서 필요한 것을 찾으세요.', '갑작스러운 변화에도 한 번 더 현실을 보세요.', '이전의 고정관념을 내려놓고 지금 필요한 방향을 정리해 보세요.'] },
  'The High Priestess': { ko: '여사제', theme: '직관과 침묵', messages: ['지금은 조용히 듣는 것이 가장 현명한 행동입니다.', '외부의 소음보다 마음의 속삭임에 더 귀를 기울여야 합니다.', '답은 이미 당신 안에 있지만 조용한 순간에서 더 선명해집니다.'], actions: ['이른 판단을 멈추고 조용히 내면을 들여다보세요.', '침묵의 순간을 가치 있게 여기는 것이 좋습니다.', '생각을 정리할 시간을 오늘에 꼭 확보해 보세요.'] },
  'The Emperor': { ko: '황제', theme: '질서와 안정', messages: ['기준을 세우는 것이 지금 가장 필요한 일입니다.', '혼란이 크다면 구조를 만들고 우선순위를 다시 정리해 보세요.', '안정은 감정의 과잉이 아니라 현실에 맞는 기준에서 생깁니다.'], actions: ['오늘은 우선순위를 정리해 보세요.', '기준을 세우고 가장 중요한 것부터 처리해 보세요.', '불필요한 부담을 줄이고 구조를 만드는 것이 좋습니다.'] },
  'The Fool': { ko: '바보', theme: '모험과 시작', messages: ['완벽한 준비보다 지금 가능한 첫 걸음이 더 중요합니다.', '새로운 시작은 불안할 수 있지만, 그것이 성장의 문턱입니다.', '당신은 이제 더 자유롭게 시작할 준비가 되어 있습니다.'], actions: ['완벽함을 미루지 말고 작은 시작부터 해 보세요.', '생각을 행동으로 옮기는 데 집중해 보세요.', '한 번의 도전이 오늘의 변화가 될 수 있습니다.'] },
  'Wheel of Fortune': { ko: '운명의 수레바퀴', theme: '흐름과 타이밍', messages: ['시기는 아직 흐르고 있고 변화는 이미 움직이고 있습니다.', '지금 당장 모든 것이 정리되지는 않아도 흐름은 당신을 밀어주고 있습니다.', '당신의 방향을 바꾸는 것은 대단한 변화가 아니라 자연스러운 전환입니다.'], actions: ['지금의 흐름을 과하게 저항하지 말고 받아들이세요.', '결정의 타이밍을 너무 서두르지 말아 보세요.', '준비된 순간이 오면 한 번 더 행동해 보세요.'] },
  'Temperance': { ko: '절제', theme: '조화와 균형', messages: ['서두르기보다 조율을 맞추는 것이 더 중요합니다.', '당신은 지금 균형을 만들 수 있는 능력을 이미 가지고 있습니다.', '과한 의미 부여를 줄이고 조용히 정리하는 것이 좋습니다.'], actions: ['오늘은 마음을 균형 있게 정리해 보세요.', '서두르지 않고 흐름에 맞춰 조절해 보세요.', '중요한 것은 너무 많이 넣는 것이 아니라 적절한 비율입니다.'] },
  'The Devil': { ko: '악마', theme: '집착과 현실 인식', messages: ['문제는 감정이 아니라 어떤 반복을 붙잡고 있는가에 달려 있습니다.', '당신이 놓치고 있는 건 현실을 인정하는 용기입니다.', '집착은 혼란을 키우고, 인식은 해방의 시작입니다.'], actions: ['지금의 반복을 한 번 정확히 인식해 보세요.', '얻고 싶은 것과 실제로 필요한 것을 분리해 보세요.', '삶의 부담을 줄이는 쪽으로 선택해 보세요.'] },
  'Judgement': { ko: '심판', theme: '회고와 정리', messages: ['지금은 과거의 선택을 정리하고 새로운 기준을 세우는 시간입니다.', '당신은 이전의 경험을 통해 더 나은 기준을 얻고 있습니다.', '과거를 덮는 것이 아니라 의미를 정리하는 단계입니다.'], actions: ['이전의 선택을 정리해 보고 지금의 기준을 다시 세워 보세요.', '결정을 위해 필요한 기준을 하나씩 정리해 보세요.', '이전의 경험을 무시하지 말고 가치를 다시 정의해 보세요.'] }
};

function hashQuestion(question = '', cardName = 'The Star') {
  const raw = `${cardName}:${String(question || '')}`;
  let total = 0;
  for (let i = 0; i < raw.length; i += 1) total += raw.charCodeAt(i) * (i + 1);
  return total;
}

function hasFinalConsonant(word = '') {
  const lastCharacter = String(word).trim().slice(-1);
  if (!lastCharacter) return false;
  const code = lastCharacter.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

function particle(word, withFinalConsonant, withoutFinalConsonant) {
  return `${word}${hasFinalConsonant(word) ? withFinalConsonant : withoutFinalConsonant}`;
}

function getQuestionTone(question = '') {
  const q = String(question || '').toLowerCase();
  if (/사랑|연애|관계|연인|상대|헤어|이별/.test(q)) return { intro: '사랑의 흐름을 살펴보면', action: '마음을 정직하게 관찰하고, 상대에 대한 기대와 본심을 분리해 보세요.' };
  if (/일|직장|커리어|진로|취업|사업|돈|재물|경제/.test(q)) return { intro: '일과 방향을 살펴보면', action: '지금의 자원과 가능성을 실전적으로 정리해 보세요.' };
  if (/결정|선택|미래|두려움|걱정|불안/.test(q)) return { intro: '결정에 대한 고민을 보자면', action: '불안을 줄이기보다 가장 작은 기준을 먼저 정해 보세요.' };
  if (/성장|자기|내면|마음|상처|정체성/.test(q)) return { intro: '마음의 정리를 보면', action: '내면의 신호를 믿고 오늘의 작은 생각부터 정리해 보세요.' };
  return { intro: '당신의 고민을 살펴보면', action: '한 번의 정직한 질문으로 내면을 정리해 보세요.' };
}

function generateTarotReading(question = '', cardNames = ['The Star']) {
  const selected = Array.isArray(cardNames) && cardNames.length ? cardNames[0] : 'The Star';
  const card = CARD_GUIDE[selected] || CARD_GUIDE['The Star'];
  const tone = getQuestionTone(question);
  const seed = hashQuestion(question, selected);
  const m1 = card.messages[seed % card.messages.length];
  const m2 = card.messages[(seed + 2) % card.messages.length];
  const a1 = card.actions[(seed + 1) % card.actions.length];
  const cardSubject = particle(card.ko, '은', '는');
  const themeObject = particle(card.theme, '을', '를');

  return [
    `현재의 흐름: ${tone.intro} ${card.ko} 카드가 보여주는 신호는, 지금 당신이 답을 찾고 있다는 뜻입니다. ${question ? '질문하신 내용은' : '당신의 현재 마음은'} 혼란이 아니라 방향을 정리하려는 과정에 가깝습니다.`,
    `카드가 전하는 메시지: ${m1} ${m2} ${cardSubject} ${themeObject} 상징합니다.`,
    `오늘의 행동: ${a1} ${tone.action}`
  ].join('\n\n');
}

function buildFallbackReading({ question = '', cards = [] } = {}) {
  return generateTarotReading(question, cards);
}

function extractGeminiText(data = {}) {
  const candidateText = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
  const outputText = Array.isArray(data.outputs)
    ? data.outputs.filter((output) => output?.type === 'text' && typeof output.text === 'string').map((output) => output.text).join('')
    : '';
  return candidateText || outputText || data.output?.text || data.text || '';
}

function normalizeTarotReading(rawReading = '', options = {}) {
  if (typeof rawReading !== 'string') return buildFallbackReading(options);

  let cleaned = rawReading
    .replace(/```/g, '')
    .replace(/\*\*/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(?<=[가-힣])\s+(?=[은는이가을를에의])(?=[가-힣])/g, '')
    .trim();

  if (!cleaned) return buildFallbackReading(options);

  const hasKorean = /[가-힣]/.test(cleaned);
  const hasEnglish = /[A-Za-z]{3,}/.test(cleaned);
  const suspiciousPattern = /(?:Current|Today's|Action|Message|Flow|The Star|The Moon|The Sun|The Hermit|The Empress|The Chariot|The Lovers|The Magician|Justice|Strength|The World|Death|The Tower|The High Priestess|The Emperor|The Fool|Wheel of Fortune|Temperance|The Devil|Judgement)/i.test(cleaned);

  if (!hasKorean) return buildFallbackReading(options);
  if (hasEnglish && suspiciousPattern) return buildFallbackReading(options);
  if (cleaned.length < 35) return buildFallbackReading(options);

  const normalized = cleaned
    .replace(/(?:^|\s)(?:Current|Today's|Action|Message|Flow|Card|Question|Today|The|A|An|of|and|to|for|your|into|from|what|how|why)\b/gi, '')
    .replace(/\s+:/g, ':')
    .replace(/\s+/g, ' ')
    .trim();

  if (!/[가-힣]/.test(normalized)) return buildFallbackReading(options);

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/^\s+|\s+$/g, '').trim())
    .filter((sentence) => sentence.length > 10 && /[가-힣]/.test(sentence));

  if (sentences.length >= 3) {
    return sentences.slice(0, 3).join('\n\n');
  }

  if (normalized.includes('현재의 흐름') || normalized.includes('카드가 전하는 메시지') || normalized.includes('오늘의 행동')) {
    return normalized
      .replace(/\s*(현재의 흐름:|카드가 전하는 메시지:|오늘의 행동:)\s*/g, '\n\n$1 ')
      .trim();
  }

  return buildFallbackReading(options);
}

app.use(express.json({ limit: '12mb' }));
app.use(express.static(__dirname));

app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  });
});

app.post('/api/tarot-reading', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const cards = Array.isArray(req.body?.cards) ? req.body.cards.slice(0, 3).join(', ') : '';
  const spread = typeof req.body?.spread === 'string' ? req.body.spread : 'one-card';
  if (!question) return res.status(400).json({ error: '질문을 입력해주세요.' });
  if (!cards) return res.status(400).json({ error: '카드를 선택해주세요.' });

  const cardList = Array.isArray(req.body?.cards) ? req.body.cards : [];
  const localReading = generateTarotReading(question, cardList);

  if (!apiKey) return res.json({ reading: localReading });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000), body: JSON.stringify({ systemInstruction: { parts: [{ text: '당신은 한국어 타로 리더입니다. 반드시 한국어로만 답하세요. 영어 단어, 제목, 마크다운, 목록 기호, 괄호표시를 사용하지 마세요. 3개의 완전한 문장으로만 작성하세요.' }] }, contents: [{ role: 'user', parts: [{ text: `카드: ${cards}\n질문: ${question}\n반드시 아래 형식으로만 답하세요. 현재의 흐름: ... 카드가 전하는 메시지: ... 오늘의 행동: ...` }] }], generationConfig: { maxOutputTokens: 512, temperature: 0.2, thinkingConfig: { thinkingLevel: 'MINIMAL' } } }) });
    const data = await response.json();
    if (!response.ok) return res.json({ reading: localReading });
    const reading = extractGeminiText(data);
    const finalReading = normalizeTarotReading(reading, { question, cards: cardList });
    return res.json({ reading: finalReading.length > 40 ? finalReading : localReading });
  } catch (error) {
    console.error('Tarot reading failed:', error.message);
    return res.json({ reading: localReading });
  }
});

app.post('/api/generate-image', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  const referenceImage = typeof req.body?.referenceImage === 'string' ? req.body.referenceImage : '';
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' });
  if (!prompt) return res.status(400).json({ error: '그림 설명을 입력해주세요.' });
  const parts = [{ text: `사용자가 제공한 레퍼런스 그림체를 최대한 유지하면서 다음 장면을 새로 그려줘. 인물이나 특정 작가를 복제하지 말고, 선의 속도, 색감, 명암, 여백 같은 시각적 특징만 참고해. 장면: ${prompt}` }];
  if (referenceImage.startsWith('data:image/')) {
    const match = referenceImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (match) parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'] } }) });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: data.error?.message || '이미지 생성에 실패했습니다.' });
    const outputParts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = outputParts.find((part) => part.inlineData?.data);
    if (!imagePart) return res.status(502).json({ error: '이미지 결과를 받지 못했습니다.' });
    return res.json({ image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` });
  } catch (error) {
    console.error('Image generation failed:', error.message);
    return res.status(502).json({ error: '이미지 생성 서버에 연결할 수 없습니다.' });
  }
});

app.post('/api/analyze-style', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
  if (!description) return res.status(400).json({ error: '스타일 설명이 필요합니다.' });
  if (!apiKey) return res.json({ analysis: '레퍼런스의 선, 여백, 색 온도를 중심으로 스타일을 분석했습니다.' });
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `다음 그림체 설명을 한국어 2문장으로 분석해줘. 선의 성격, 색감, 여백을 구체적으로 언급해. 설명: ${description}` }] }], generationConfig: { maxOutputTokens: 512, temperature: 0.5, thinkingConfig: { thinkingLevel: 'MINIMAL' } } }) });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: data.error?.message || '스타일 분석에 실패했습니다.' });
    return res.json({ analysis: data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || '스타일을 분석했습니다.' });
  } catch (error) {
    console.error('Style analysis failed:', error.message);
    return res.status(502).json({ error: '스타일 분석 서버에 연결할 수 없습니다.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const conversation = Array.isArray(req.body?.conversation) ? req.body.conversation : [];
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' });
  if (!conversation.length) return res.status(400).json({ error: '대화 내용이 필요합니다.' });
  const contents = conversation.filter((message) => message && typeof message.content === 'string' && message.content.trim()).slice(-12).map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.content.trim() }] }));
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: '당신은 친절하고 공감적인 상담 AI입니다. 사용자의 안전을 우선하고, 자해나 위험한 행동의 구체적인 방법은 제공하지 않습니다.' }] }, contents, generationConfig: { maxOutputTokens: 768, temperature: 0.7, thinkingConfig: { thinkingLevel: 'MINIMAL' } } }) });
    const data = await response.json();
    if (!response.ok) return res.status(response.status >= 500 ? 502 : response.status).json({ error: data.error?.message || 'Gemini API 요청에 실패했습니다.' });
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('');
    return res.json({ reply: reply || '응답을 생성하지 못했습니다.' });
  } catch (error) {
    console.error('Gemini request failed:', error.message);
    return res.status(502).json({ error: 'Gemini API에 연결할 수 없습니다.' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

if (require.main === module) {
  app.listen(port, () => console.log(`서버 실행 중: http://localhost:${port}`));
}

module.exports = {
  app,
  normalizeTarotReading,
  buildFallbackReading,
  generateTarotReading
};