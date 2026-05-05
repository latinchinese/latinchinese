let currentLang = 'es';
let allProducts = [];

// 分类数据（西文和中文）
const categories = [
    { cat: 'all', es: 'Todos', zh: '全部' },
    { cat: 'agricultura', es: '🚜 Agricultura', zh: '🚜 农业' },
    { cat: 'agua', es: '💧 Tratamiento agua', zh: '💧 水处理' },
    { cat: 'motor', es: '⚙️ Motores', zh: '⚙️ 发动机' },
    { cat: 'energia', es: '☀️ Energía solar', zh: '☀️ 太阳能' },
    { cat: 'herramientas', es: '🔧 Herramientas', zh: '🔧 工具' },
    { cat: 'industrial', es: '🏭 Equipos industriales', zh: '🏭 工业设备' }
];

function renderCategoryButtons() {
    const container = document.getElementById('categoryGrid');
    if (!container) return;
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        if (cat.cat === 'all') btn.classList.add('active');
        btn.setAttribute('data-cat', cat.cat);
        btn.textContent = currentLang === 'es' ? cat.es : cat.zh;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
        container.appendChild(btn);
    });
}

async function loadProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '<div class="loading">Cargando productos...</div>';
    try {
        const res = await fetch('productos.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allProducts = await res.json();
        if (!allProducts.length) throw new Error('No hay productos');
        renderProducts(allProducts);
    } catch (err) {
        console.error(err);
        grid.innerHTML = `<div class="loading">❌ Error cargando productos. ${err.message}<br>Intenta recargar o contacta al administrador.</div>`;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!products.length) {
        grid.innerHTML = '<div class="loading">No se encontraron productos / 没有找到产品</div>';
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-img">${p.image ? `<img src="${p.image}" alt="${p.name_es}">` : '📦'}</div>
            <div class="product-info">
                <div class="product-name">${currentLang === 'es' ? p.name_es : p.name_zh}</div>
                <div class="product-price">$${p.price} USD</div>
                <div class="product-origin">📍 ${p.origin}</div>
                <button class="btn-inquiry" data-id="${p.id}">📩 ${currentLang === 'es' ? 'Consultar' : '询价'}</button>
            </div>
        </div>
    `).join('');
    attachInquiryEvents();
}

function attachInquiryEvents() {
    document.querySelectorAll('.btn-inquiry').forEach(btn => {
        btn.removeEventListener('click', handleInquiry);
        btn.addEventListener('click', handleInquiry);
    });
}

function handleInquiry(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const product = allProducts.find(p => p.id === id);
    if (product) openInquiryModal(product);
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeCat = document.querySelector('.cat-btn.active')?.getAttribute('data-cat') || 'all';
    let filtered = [...allProducts];
    if (activeCat !== 'all') filtered = filtered.filter(p => p.category === activeCat);
    if (searchTerm) filtered = filtered.filter(p => p.name_es.toLowerCase().includes(searchTerm) || p.name_zh.includes(searchTerm));
    renderProducts(filtered);
}

let currentProduct = null;
function openInquiryModal(product) {
    currentProduct = product;
    document.getElementById('productName').value = currentLang === 'es' ? product.name_es : product.name_zh;
    document.getElementById('inquiryModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('inquiryModal').style.display = 'none';
    document.getElementById('inquiryForm').reset();
}

// 提交询价 (增加邮箱字段)
document.getElementById('inquiryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const whatsapp = document.getElementById('userWhatsapp').value.trim();
    const msg = document.getElementById('userMsg').value.trim();
    const productName = document.getElementById('productName').value;

    if (!name || !email || !whatsapp) {
        alert(currentLang === 'es' ? 'Por favor completa nombre, email y WhatsApp.' : '请填写姓名、邮箱和WhatsApp');
        return;
    }

    const subject = `Consulta sobre ${productName}`;
    const body = `Nombre: ${name}%0AEmail: ${email}%0AWhatsApp: ${whatsapp}%0AProducto: ${productName}%0AMensaje: ${msg}`;
    window.location.href = `mailto:latinavance.latinavance@gmail.com?subject=${subject}&body=${body}`;
    closeModal();
    alert(currentLang === 'es' ? '✅ Se abrió tu correo. Solo envía el mensaje.' : '✅ 已打开邮件客户端，请发送即可。');
});

function toggleLang() {
    currentLang = currentLang === 'es' ? 'zh' : 'es';
    // 更新语言切换按钮样式
    document.getElementById('lo-es').classList.toggle('on', currentLang === 'es');
    document.getElementById('lo-zh').classList.toggle('on', currentLang === 'zh');
    // 重新生成分类按钮（更新文字）
    renderCategoryButtons();
    // 更新返回按钮文字
    const backBtnText = document.getElementById('back-home-text');
    if (backBtnText) {
        backBtnText.textContent = currentLang === 'es' ? '← Volver al Inicio' : '← 返回首页';
    }
    // 更新页脚文字
    const footerText = document.getElementById('footer-text');
    if (footerText) {
        footerText.innerHTML = currentLang === 'es' 
            ? '¿Eres fabricante? <a href="upload_guide.html" id="upload-link">Sube tus productos aquí</a>'
            : '您是工厂吗？<a href="upload_guide.html" id="upload-link">免费上传您的产品</a>';
    }
    // 更新模态框标题
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = currentLang === 'es' ? 'Solicitar cotización' : '询价';
    }
    // 重新筛选并渲染产品
    filterProducts();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategoryButtons();
    loadProducts();
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.querySelector('.close').addEventListener('click', closeModal);
    window.onclick = function(event) {
        if (event.target === document.getElementById('inquiryModal')) closeModal();
    };
});