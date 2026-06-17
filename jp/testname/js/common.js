function getLangFromPath() {
    const LANG_CODES = ['fr', 'es', 'pt', 'en', 'de', 'ar', 'jp', 'no', 'sv', 'nl'];
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    for (const segment of pathSegments) {
        if (LANG_CODES.includes(segment)) {
            return segment;
        }
    }
    return pathSegments[1] || pathSegments[0] || 'sv';
}

// window.onscroll = null;

document.addEventListener('DOMContentLoaded', () => {
    // 判断元素是否可见（宽高不为 0）
    const isVisible = el => el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

    const observer = new MutationObserver(() => {
        const el = document.querySelector('.fc-consent-root');

        // 第一次检测到打开（可见）
        if (el && !observer.hasOpened && isVisible(el)) {
            observer.hasOpened = true;
            console.log('⚡  fc-consent-root');

            // 启动关闭检测
            const closeTimer = setInterval(() => {
                // 若元素被移除或隐藏
                if (!document.querySelector('.fc-consent-root') || !isVisible(el)) {
                    console.log('❌  fc-consent-root');
                    clearInterval(closeTimer);
                    observer.disconnect();

                    // 等待 0.5 秒后滚动到顶部
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        console.log('⬆️ sc');
                    }, 500);
                }
            }, 300);
        }
    });

    // 开始监听整个页面 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });
});
