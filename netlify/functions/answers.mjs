import { getStore } from '@netlify/blobs';

const store = getStore('riddle-data');
const key = 'answers';
const normalize = value => String(value).trim().replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/\s+/g, ' ');
const json = (status, body) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
const getEntries = async () => (await store.get(key, { type: 'json' })) || [];

export default async request => {
  const method = request.method;
  if (method === 'GET') return json(200, await getEntries());
  if (method === 'DELETE') { await store.setJSON(key, []); return json(200, { ok: true }); }
  if (method !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const payload = await request.json();
    const name = String(payload.name || '').trim().slice(0, 80);
    const department = String(payload.department || '').trim().slice(0, 80);
    const answer = String(payload.answer || '').trim().slice(0, 150);
    if (!name || !department || !answer) return json(422, { error: 'الحقول كلها مطلوبة' });
    const answers = await getEntries();
    answers.unshift({ id: crypto.randomUUID(), name, department, answer, correct: normalize(answer) === normalize('حبل الكذب قصير'), submittedAt: new Date().toISOString() });
    await store.setJSON(key, answers);
    return json(201, { ok: true });
  } catch { return json(400, { error: 'تعذر معالجة الطلب' }); }
};
