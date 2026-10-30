// Microsoft Clarity: only the HTTPS production origin may collect data.
(function installClarity(window, document) {
    'use strict';

    if (window.location.origin !== 'https://miraina-ai.com') return;
    // Also respect an existing installation, including one added through a tag manager.
    if (window.clarity || document.querySelector('script[src^="https://www.clarity.ms/tag/"]')) return;

    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vvfcumvff2");
}(window, document));
