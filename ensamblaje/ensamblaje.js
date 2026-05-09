let lang = 'es';
function toggleLang() {
    lang = lang === 'es' ? 'zh' : 'es';
    document.getElementById('lo-es').classList.toggle('on', lang === 'es');
    document.getElementById('lo-zh').classList.toggle('on', lang === 'zh');
    document.getElementById('back-text').textContent = lang === 'es' ? 'Volver al Inicio' : '返回首页';
    document.getElementById('msg1').textContent = lang === 'es' ? 'Próximamente' : '即将推出';
    document.getElementById('msg2').textContent = lang === 'es' ? 'Ofrecemos kits de ensamblaje y soporte' : '提供中国工厂散件、组装线设计支持';
    document.getElementById('notify').textContent = lang === 'es' ? '📧 Avisarme' : '📧 通知我';
}
window.addEventListener('load', toggleLang);