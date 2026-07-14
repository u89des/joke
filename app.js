document.getElementById('answerForm').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.target, message = document.getElementById('message'), button = form.querySelector('button');
  button.disabled = true; button.textContent = 'جارٍ الإرسال…';
  try {
    const response = await fetch('/.netlify/functions/answers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: document.getElementById('name').value.trim(), department: document.getElementById('department').value.trim(), answer: document.getElementById('answer').value.trim() }) });
    if (!response.ok) throw new Error(); message.textContent = 'تم تسجيل إجابتك بنجاح. شكرًا لمشاركتك!'; message.className = 'message show'; form.reset();
  } catch { message.textContent = 'تعذر حفظ الإجابة. يرجى المحاولة لاحقًا.'; message.className = 'message show error'; }
  button.disabled = false; button.innerHTML = 'إرسال الإجابة <span>←</span>';
});
