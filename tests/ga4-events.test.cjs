const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const analyticsPath = path.join(root, 'js', 'ga4-events.js');

function trackedHtmlDocuments() {
    const output = execFileSync(
        'git',
        ['-c', 'core.quotePath=false', 'ls-files', '-z', '*.html'],
        { cwd: root }
    );

    return output
        .toString()
        .split('\0')
        .filter(Boolean)
        .map(relativePath => ({
            relativePath,
            html: fs.readFileSync(path.join(root, relativePath), 'utf8')
        }))
        .filter(({ html }) => /<!doctype html|<html[\s>]/i.test(html));
}

test('all tracked HTML documents load and configure the MIRAINA GA4 property once', () => {
    const failures = trackedHtmlDocuments().flatMap(({ relativePath, html }) => {
        const loaderCount = (html.match(/googletagmanager\.com\/gtag\/js\?id=G-W9BLFVJ8E4/g) || []).length;
        const configCount = (html.match(/gtag\(\s*['"]config['"]\s*,\s*['"]G-W9BLFVJ8E4['"]\s*\)/g) || []).length;
        return loaderCount === 1 && configCount === 1
            ? []
            : [`${relativePath}: loader=${loaderCount}, config=${configCount}`];
    });

    assert.deepEqual(failures, []);
});

test('every document with a conversion link loads the shared GA4 event tracker', () => {
    const failures = trackedHtmlDocuments().flatMap(({ relativePath, html }) => {
        const hasConversionLink = /<a\b[^>]*(?:href=['"][^'"]*contact\.html|href=['"]https?:\/\/(?:lin\.ee|(?:www\.)?line\.me)|class=['"][^'"]*(?:btn|cta))/i.test(html);
        if (!hasConversionLink) return [];

        const loadsCommon = /<script\b[^>]*src=['"][^'"]*common\.js['"]/i.test(html);
        const loadsTracker = /<script\b[^>]*src=['"]\/js\/ga4-events\.js['"]/i.test(html);
        return loadsCommon || loadsTracker ? [] : [relativePath];
    });

    assert.deepEqual(failures, []);
});

test('both site-wide common scripts load the GA4 event tracker exactly once', () => {
    for (const relativePath of ['js/common.js', 'beauty-dx/js/common.js']) {
        const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
        const loadCount = (source.match(/\/js\/ga4-events\.js/g) || []).length;
        assert.equal(loadCount, 1, relativePath);
    }
});

test('classifies contact, LINE, and generic CTA links without double classification', () => {
    const { classifyLink } = require(analyticsPath);

    assert.deepEqual(
        classifyLink({ href: '/contact.html', className: 'btn btn-contact' }, 'https://miraina-ai.com/blogs/a.html'),
        { eventName: 'contact_click', destination: 'contact_form' }
    );
    assert.deepEqual(
        classifyLink({ href: 'https://lin.ee/example', className: 'btn cta' }, 'https://miraina-ai.com/'),
        { eventName: 'line_click', destination: 'line' }
    );
    assert.deepEqual(
        classifyLink({ href: '/services.html', className: 'cta-button' }, 'https://miraina-ai.com/'),
        { eventName: 'cta_click', destination: 'internal_page' }
    );
    assert.equal(
        classifyLink({ href: '/about.html', className: 'nav-link' }, 'https://miraina-ai.com/'),
        null
    );
});

test('handles explicit, external, empty, and malformed link edge cases safely', () => {
    const { classifyLink } = require(analyticsPath);
    const baseUrl = 'https://miraina-ai.com/';

    assert.deepEqual(
        classifyLink({ href: 'https://www.line.me/R/example', className: '' }, baseUrl),
        { eventName: 'line_click', destination: 'line' }
    );
    assert.deepEqual(
        classifyLink({ href: 'https://example.com/offer', className: '', dataset: { ga4Event: 'cta_click' } }, baseUrl),
        { eventName: 'cta_click', destination: 'external_site' }
    );
    assert.equal(classifyLink({ href: '', className: '' }, baseUrl), null);
    assert.equal(classifyLink({ href: 'http://[', className: '' }, baseUrl), null);
    assert.equal(classifyLink({ href: '/about.html', className: null }, baseUrl), null);
});

test('emits one privacy-safe event per click and installs only once', () => {
    const { installGa4EventTracking } = require(analyticsPath);
    const handlers = [];
    const calls = [];
    const document = {
        addEventListener(type, handler) {
            if (type === 'click') handlers.push(handler);
        }
    };
    const window = {
        location: new URL('https://miraina-ai.com/blogs/example.html?email=secret@example.com'),
        gtag(...args) {
            calls.push(args);
        }
    };
    const anchor = {
        href: 'https://miraina-ai.com/contact.html?email=secret@example.com',
        className: 'btn cta-button',
        closest(selector) {
            return selector === 'a[href]' ? this : null;
        },
        getAttribute(name) {
            return name === 'href' ? '/contact.html?email=secret@example.com' : null;
        }
    };

    installGa4EventTracking(document, window);
    installGa4EventTracking(document, window);
    assert.equal(handlers.length, 1);

    handlers[0]({ target: anchor });
    assert.deepEqual(calls, [[
        'event',
        'contact_click',
        {
            event_category: 'engagement',
            event_label: 'contact_form',
            page_path: '/blogs/example.html'
        }
    ]]);
    assert.equal(JSON.stringify(calls).includes('secret@example.com'), false);
});

test('ignores clicks that have no trackable anchor or no available gtag function', () => {
    const { installGa4EventTracking } = require(analyticsPath);
    const handlers = [];
    const document = {
        addEventListener(_type, handler) {
            handlers.push(handler);
        }
    };
    const window = { location: new URL('https://miraina-ai.com/') };

    installGa4EventTracking(document, window);
    handlers[0]({ target: {} });
    handlers[0]({
        target: {
            closest() {
                return {
                    className: 'nav-link',
                    getAttribute() {
                        return '/about.html';
                    }
                };
            }
        }
    });
    handlers[0]({
        target: {
            closest() {
                return {
                    className: 'btn',
                    getAttribute() {
                        return '/contact.html';
                    }
                };
            }
        }
    });
});
