(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root && root.document) {
        api.installGa4EventTracking(root.document, root);
    }
}(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    function classifyLink(link, baseUrl) {
        const href = typeof link.getAttribute === 'function'
            ? link.getAttribute('href')
            : link.href;
        if (!href) return null;

        let url;
        try {
            url = new URL(href, baseUrl);
        } catch (_error) {
            return null;
        }

        if (url.hostname === 'lin.ee' || url.hostname === 'line.me' || url.hostname === 'www.line.me') {
            return { eventName: 'line_click', destination: 'line' };
        }

        if (/\/contact\.html\/?$/i.test(url.pathname)) {
            return { eventName: 'contact_click', destination: 'contact_form' };
        }

        const className = typeof link.className === 'string' ? link.className : '';
        const explicitEvent = link.dataset && link.dataset.ga4Event;
        if (explicitEvent === 'cta_click' || /(?:^|[\s_-])(?:btn|cta)(?=$|[\s_-])/i.test(className)) {
            const destination = url.origin === new URL(baseUrl).origin ? 'internal_page' : 'external_site';
            return { eventName: 'cta_click', destination };
        }

        return null;
    }

    function installGa4EventTracking(documentObject, windowObject) {
        if (windowObject.__mirainaGa4EventsInstalled) return;
        windowObject.__mirainaGa4EventsInstalled = true;

        documentObject.addEventListener('click', function (event) {
            const link = event.target && typeof event.target.closest === 'function'
                ? event.target.closest('a[href]')
                : null;
            if (!link) return;

            const classification = classifyLink(link, windowObject.location.href);
            if (!classification || typeof windowObject.gtag !== 'function') return;

            windowObject.gtag('event', classification.eventName, {
                event_category: 'engagement',
                event_label: classification.destination,
                page_path: windowObject.location.pathname
            });
        });
    }

    return { classifyLink, installGa4EventTracking };
}));
