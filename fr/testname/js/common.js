function getLangFromPath() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[1]; // 假设语言代码总是在第一个路径段
}

// window.onscroll = null;

document.addEventListener('DOMContentLoaded', () => {
    const targetNode = document.body;

    const observer = new MutationObserver(() => {
        const consentDiv = document.querySelector('.fc-consent-root');
        if (consentDiv) {
            console.log('⚡ fc-consent-root 已打开');
        } else {
            console.log('❌ fc-consent-root 已关闭');
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
});
