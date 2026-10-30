const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/clarity.js'), 'utf8');
const analyticsSource = fs.readFileSync(path.join(root, 'js/ga4-events.js'), 'utf8');

function browser(origin = 'https://miraina-ai.com') {
    const scripts = [];
    const listeners = [];
    const document = {
        createElement: () => ({}),
        head: { appendChild: script => scripts.push(script) },
        getElementsByTagName: () => [{ parentNode: { insertBefore: script => scripts.push(script) } }],
        querySelector: selector => scripts.find(script => selector.includes('clarity.ms')
            ? script.src?.startsWith('https://www.clarity.ms/tag/')
            : script.src === '/js/clarity.js'),
        addEventListener: (...args) => listeners.push(args),
    };
    const window = { document, location: { origin } };
    return { scripts, listeners, window, context: vm.createContext({ window, document, URL }) };
}

test('production loads the supplied project asynchronously once, even on repeated execution', () => {
    const b = browser();
    vm.runInContext(source, b.context);
    vm.runInContext(source, b.context);
    assert.equal(b.scripts.length, 1);
    assert.equal(b.scripts[0].src, 'https://www.clarity.ms/tag/vvfcumvff2');
    assert.equal(b.scripts[0].async, 1);
    assert.equal(typeof b.window.clarity, 'function');
    b.window.clarity('event', 'test');
    assert.equal(b.window.clarity.q.length, 1);
});

test('development, previews, HTTP, nonstandard ports and lookalike hosts never initialize Clarity', () => {
    for (const origin of [
        'http://localhost:3000', 'http://127.0.0.1:8765', 'https://preview.pages.dev',
        'https://preview.vercel.app', 'http://miraina-ai.com', 'https://miraina-ai.com:8443',
        'https://miraina-ai.com.example.org', 'https://ai-safety-kentei.miraina-ai.com',
    ]) {
        const b = browser(origin);
        vm.runInContext(source, b.context);
        vm.runInContext(analyticsSource, b.context);
        assert.equal(b.scripts.length, 0, origin);
        assert.equal(b.window.clarity, undefined, origin);
    }
});

test('an existing Clarity installation is preserved, including a tag-manager installation', () => {
    const b = browser();
    const existing = () => {};
    b.window.clarity = existing;
    vm.runInContext(source, b.context);
    assert.equal(b.window.clarity, existing);
    assert.equal(b.scripts.length, 0);

    const withTag = browser();
    withTag.scripts.push({ src: 'https://www.clarity.ms/tag/existing-project' });
    vm.runInContext(source, withTag.context);
    assert.equal(withTag.scripts.length, 1);
    assert.equal(withTag.window.clarity, undefined);
});

test('the shared analytics entry loads Clarity once and retains one GA4 click listener', () => {
    const b = browser();
    vm.runInContext(analyticsSource, b.context);
    vm.runInContext(analyticsSource, b.context);
    assert.equal(b.scripts.length, 1);
    assert.equal(b.scripts[0].src, '/js/clarity.js');
    assert.equal(b.listeners.length, 1);
});

test('every tracked content document has a path to Clarity; verification and redirects are excluded', () => {
    const files = execFileSync('git', ['ls-files', '-z', '*.html'], { cwd: root })
        .toString().split('\0').filter(Boolean);
    const failures = files.filter(file => {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        if (!/<!doctype html|<html[\s>]/i.test(html)) return false;
        if (/http-equiv=["']refresh|window.location.replace/i.test(html)) return false;
        return !/<script\b[^>]*src=["'][^"']*(?:common\.js|\/js\/ga4-events\.js|\/js\/clarity\.js)["']/i.test(html);
    });
    assert.deepEqual(failures, []);
    assert.ok(!source.includes('ai.literacy.1010@gmail.com'));
    assert.ok(!analyticsSource.includes('ai.literacy.1010@gmail.com'));
});
