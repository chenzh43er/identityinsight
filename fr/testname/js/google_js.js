// Step 0: 初始化 dataLayer
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Step 1: 提前默认 grant（防止 Tag 阻塞）
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

// Step 2: 注入 Cookiebot，使用 defer，阻止其抢先执行
var script = document.createElement('script');
script.id = "Cookiebot";
script.src = "https://consent.cookiebot.com/uc.js";
script.setAttribute('data-cbid', '67393139-bb7b-4210-b00e-4f5925af575c');
script.setAttribute('data-blockingmode', 'none');
script.type = "text/javascript";
script.defer = true;
document.head.appendChild(script);

// Step 3: 强制覆盖 Cookiebot 的状态，并劫持所有路径
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

        console.log('[Consent] 强制 granted 成功 ✅');
    } else {
        console.warn('[Consent] Cookiebot 还未准备好 ❌');
    }
});

// 补丁：防止 Cookiebot 后续重置为 false
Object.defineProperty(document, 'cookie', {
    set: function(cookieString) {
        if (cookieString.indexOf("CookieConsent=") === -1) {
            document.__cookie__ = (document.__cookie__ || '') + "; " + cookieString;
        }
    },
    get: function() {
        return document.__cookie__ || "";
    }
});
