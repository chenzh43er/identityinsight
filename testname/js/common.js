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

