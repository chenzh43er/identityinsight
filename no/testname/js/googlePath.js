// Step 1: 设置默认同意状态
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

gtag('consent', 'default', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted'
});

gtag('set', {
    ads_data_redaction: false,
    url_passthrough: true,
    'developer_id.dMWZhNz': true
});

// Step 2: 动态加载 Cookiebot 脚本（非自动拦截模式）
(function() {
    var script = document.createElement('script');
    script.id = 'Cookiebot';
    script.src = 'https://consent.cookiebot.com/uc.js';
    script.type = 'text/javascript';
    script.setAttribute('data-cbid', '9b32241f-dd52-4e1f-bce5-39e2c80b7a53');
    script.setAttribute('data-blockingmode', 'none');
    document.head.appendChild(script);
})();

// Step 3: 劫持 Cookiebot 状态（强制同意）
window.addEventListener('CookiebotOnConsentReady', function () {
    if (window.Cookiebot && window.Cookiebot.consent) {
        Cookiebot.consent.preferences = true;
        Cookiebot.consent.statistics = true;
        Cookiebot.consent.marketing = true;
        Cookiebot.consent.given = true;
        Cookiebot.hasConsented = true;

        gtag('consent', 'update', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted',
            security_storage: 'granted'
        });
    }
});
