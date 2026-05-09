let lang = 'es';
let costData = {};
const WORKER_URL = 'https://cold-cake-3008.latinagro.workers.dev'; // 修正拼写：latinagro

// 费用中文映射
const costLabelMap = {
  'Visto Bueno': '核放费',
  'Desconsolidación': '拆箱费',
  'Handling': '操作费',
  'TDI': '数据传输费',
  'MACH': '吊箱费',
  'THC': '码头费',
  'Transporte Interior': '内陆运输',
  'Almacén Temporal': '临时仓储',
  'Aduana': '报关费',
  'B/L': '提单费'
};

async function loadCostData() {
  try {
    const res = await fetch('cost_data.json');
    costData = await res.json();
    renderCompare();
  } catch(e) { console.error(e); }
}

function renderCompare() {
  const container = document.getElementById('cost-compare-container');
  if (!container) return;
  container.innerHTML = '';
  for (let [port, fees] of Object.entries(costData)) {
    let itemsHtml = '';
    for (let [key, value] of Object.entries(fees)) {
      let label = key;
      if (lang === 'zh' && costLabelMap[key]) label = costLabelMap[key];
      itemsHtml += `<div class="cost-item"><span class="cost-label">${label}</span><span class="cost-value">$${value}</span></div>`;
    }
    container.innerHTML += `<div class="card cost-compare-card"><div class="port-title">⚓ ${port}</div>${itemsHtml}</div>`;
  }
}

function submitOffer() {
  alert(lang === 'es' ? 'Oferta enviada (simulada)' : '报价已提交（模拟）');
}

async function aiCheck() {
  const text = document.getElementById('quoteText').value.trim();
  if (!text) {
    alert(lang === 'es' ? 'Por favor pega la cotización primero.' : '请先粘贴报价文字');
    return;
  }
  // 模拟 AI 分析结果（实际应调用 Worker）
  const mockResult = `⚠️ Visto Bueno $340 比参考价（$142）高出 139%
⚠️ Desconsolidación $350 在正常范围内
✅ 其他费用无异常。`;
  document.getElementById('aiResult').innerHTML = mockResult.replace(/\n/g, '<br>');
  
  /* 当您以后 Worker 调试正常后，取消下面注释，并删除上面模拟部分
  const prompt = `你是一个拉美物流成本审计专家...`;
  try {
    const response = await fetch(`${WORKER_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    const resultText = data.choices[0].message.content;
    document.getElementById('aiResult').innerHTML = resultText.replace(/\n/g, '<br>');
  } catch (err) {
    document.getElementById('aiResult').innerHTML = lang === 'es' ? 'Error de conexión con AI.' : 'AI 连接错误。';
  }
  */
}

  const prompt = `你是一个拉美物流成本审计专家。以下是货代提供的费用清单（非结构化文本）：\n${text}\n\n已知各港口基准费用为（仅作参考，不要直接输出）：${JSON.stringify(costData)}\n请分析清单中的费用哪些明显高于市场价（超过20%），用西语和中文分别给出简洁警告（每个警告一行）。格式：⚠️ [西语] / ⚠️ [中文]`;
  try {
    const response = await fetch(`${WORKER_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const resultText = data.choices[0].message.content;
    document.getElementById('aiResult').innerHTML = resultText.replace(/\n/g, '<br>');
  } catch (err) {
    console.error(err);
    document.getElementById('aiResult').innerHTML = lang === 'es' ? 'Error de conexión con AI.' : 'AI 连接错误。';
  }
}

function toggleLang() {
  lang = lang === 'es' ? 'zh' : 'es';
  document.getElementById('lo-es').classList.toggle('on', lang === 'es');
  document.getElementById('lo-zh').classList.toggle('on', lang === 'zh');
  const backSpan = document.getElementById('back-home-text');
  if (backSpan) backSpan.textContent = lang === 'es' ? '← Volver al Inicio' : '← 返回首页';
  const texts = {
    'form-title': lang === 'es' ? '📝 Cargos en Destino (para agentes)' : '📝 目的港费用（货代填写）',
    'compare-title': lang === 'es' ? '⚓ Costos Logísticos por Puerto' : '⚓ 港口物流费用参考',
    'lbl-vb': lang === 'es' ? 'Visto Bueno' : '核放费',
    'lbl-dc': lang === 'es' ? 'Desconsolidación' : '拆箱费',
    'lbl-hd': lang === 'es' ? 'Handling' : '操作费',
    'lbl-tdi': lang === 'es' ? 'TDI' : '数据传输费',
    'lbl-mach': lang === 'es' ? 'MACH' : '吊箱费',
    'lbl-thc': lang === 'es' ? 'THC' : '码头费',
    'lbl-transp': lang === 'es' ? 'Transporte Interior' : '内陆运输',
    'lbl-alm': lang === 'es' ? 'Almacén Temporal' : '临时仓储',
    'lbl-aduana': lang === 'es' ? 'Aduana' : '报关费',
    'lbl-bl': lang === 'es' ? 'B/L' : '提单费',
    'btn-submit': lang === 'es' ? '🔒 Enviar Oferta Bloqueada' : '🔒 提交锁定报价',
    'ai-title': lang === 'es' ? '🤖 AI Alerta de Costos' : '🤖 AI 费用预警',
    'ai-label': lang === 'es' ? 'Pega aquí el texto de la cotización del agente' : '粘贴货代报价文字',
    'ai-btn': lang === 'es' ? '🔍 Analizar con AI' : '🔍 AI 分析'
  };
  for (let [id, val] of Object.entries(texts)) {
    let el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  renderCompare();
}

window.addEventListener('load', () => {
  loadCostData();
  toggleLang();
});