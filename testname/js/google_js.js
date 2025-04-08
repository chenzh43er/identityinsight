
    (function () {
    var page_link = window.location.href;

    function sendAdViewEvent(iframe) {
    if (iframe.getAttribute('data-ad-viewed')) return;
    iframe.setAttribute('data-ad-viewed', 'true');

    var adSrc = iframe.getAttribute('src') || '';
    var queryId = iframe.getAttribute('data-google-query-id') || 'unknown';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
    event: 'adsense_ad_view',
    ad_link: adSrc,
    ad_location: page_link,
    google_query_id: queryId
});
}

    function trackIframe(iframe, observer) {
    if (iframe.getAttribute('data-ad-tracked')) return;
    iframe.setAttribute('data-ad-tracked', 'true');
    observer.observe(iframe);
}

    function initObservers() {
    var intersectionObserver = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
    sendAdViewEvent(entries[i].target);
}
}
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
});

    var iframes = document.querySelectorAll('iframe[src*="googleads.g.doubleclick.net"], iframe[src$="/html/container.html"]');
    for (var i = 0; i < iframes.length; i++) {
    trackIframe(iframes[i], intersectionObserver);
}

    var mutationObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
    var addedNodes = mutations[i].addedNodes;
    for (var j = 0; j < addedNodes.length; j++) {
    var node = addedNodes[j];

    if (node.tagName === 'IFRAME') {
    var src = node.getAttribute('src') || '';
    if (src.indexOf('googleads.g.doubleclick.net') !== -1 || src.endsWith('/html/container.html')) {
    trackIframe(node, intersectionObserver);
}
}

    if (node.querySelectorAll) {
    var newIframes = node.querySelectorAll('iframe[src*="googleads.g.doubleclick.net"], iframe[src$="/html/container.html"]');
    for (var k = 0; k < newIframes.length; k++) {
    trackIframe(newIframes[k], intersectionObserver);
}
}
}
}
});

    // ✅ 这时候 document.body 是可用的
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

    // ✅ 等待 DOM 完全加载再初始化
    if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObservers);
} else {
    initObservers();
}
})();
