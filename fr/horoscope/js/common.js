function getLangFromPath() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[1]; // 假设语言代码总是在第一个路径段
}

window.onscroll = null;

const keysToKeep = ['token','source','campaign','content','country','keyword','lang','medium'];
const params = new URLSearchParams(window.location.search);

const keepParams = new URLSearchParams();
keysToKeep.forEach(key => {
    if (params.has(key)) keepParams.set(key, params.get(key));
});

function appendParams(url) {
    try {
        const u = new URL(url, window.location.origin);
        keysToKeep.forEach(key => {
            if (keepParams.has(key) && !u.searchParams.has(key)) {
                u.searchParams.set(key, keepParams.get(key));
            }
        });
        return u.toString();
    } catch {
        return url;
    }
}