// 提交询价 (mailto, 增加邮箱字段)
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