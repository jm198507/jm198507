const assert = require('assert');
const { generateTarotReading, normalizeTarotReading } = require('./server');

const reading = generateTarotReading('새로운 일을 시작해도 괜찮을까요?', ['The Star']);
assert.ok(reading.includes('현재의 흐름') && reading.includes('카드가 전하는 메시지') && reading.includes('오늘의 행동'), `Expected tarot structure, got: ${reading}`);
assert.ok(/[가-힣]/.test(reading), `Expected Korean text, got: ${reading}`);
assert.ok(!/[A-Za-z]{4,}/.test(reading), `Expected no English fragments, got: ${reading}`);
assert.ok(reading.length > 80, `Expected a fuller reading, got: ${reading}`);

const malformed = "Today's Action):* Concrete action to take today (exactly one sentence)";
const cleaned = normalizeTarotReading(malformed, { question: '새로운 일을 시작해도 괜찮을까요?', cards: ['The Star'] });
assert.ok(cleaned.includes('현재의 흐름') || cleaned.includes('카드가 전하는 메시지') || cleaned.includes('오늘의 행동'), `Expected fallback structure, got: ${cleaned}`);
console.log('tarot generation ok:', reading);
