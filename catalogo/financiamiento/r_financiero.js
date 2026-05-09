let lang = 'es';
let requests = JSON.parse(localStorage.getItem('financing_requests') || '[]');
function renderList() {
    const container = document.getElementById('financing-list');
    if (!container) return;
    if (!requests.length) { container.innerHTML = '<div class="financing-item" style="text-align:center">No hay solicitudes aún.</div>'; return; }
    container.innerHTML = requests.map((r,i) => `<div class="financing-item"><div class="financing-amount">$${r.amount} USD</div><div>Pagado: ${r.paid}% | Plazo: ${r.term} días</div><div>${r.product}</div><div style="font-size:12px;color:#7A9AB8">ID: #${i+1}</div></div>`).join('');
}
function openModal() { document.getElementById('modal').style.display = 'flex'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function submitFinancing() {
    const product = document.getElementById('fn-product').value.trim();
    const amount = parseFloat(document.getElementById('fn-amount').value);
    const paid = parseFloat(document.getElementById('fn-paid').value);
    const term = parseInt(document.getElementById('fn-term').value);
    const contact = document.getElementById('fn-contact').value.trim();
    if (!product || isNaN(amount) || isNaN(paid) || isNaN(term) || !contact) return alert('Complete todos los campos');
    requests.unshift({ product, amount, paid, term, contact });
    localStorage.setItem('financing_requests', JSON.stringify(requests));
    closeModal();
    renderList();
}
function toggleLang() {
    lang = lang === 'es' ? 'zh' : 'es';
    document.getElementById('lo-es').classList.toggle('on', lang === 'es');
    document.getElementById('lo-zh').classList.toggle('on', lang === 'zh');
    document.getElementById('back-home-text').textContent = lang === 'es' ? '← Volver al Inicio' : '← 返回首页';
    document.getElementById('page-title').textContent = lang === 'es' ? '📢 Financiamiento para Importadores' : '📢 进口商融资需求';
    document.getElementById('open-modal-btn').textContent = lang === 'es' ? '+ Publicar necesidad' : '+ 发布需求';
    document.getElementById('modal-title').textContent = lang === 'es' ? 'Publicar necesidad' : '发布需求';
}
window.addEventListener('load', () => { renderList(); toggleLang(); });