/**
 * MIRAINA Works Page JavaScript
 * 
 * このファイルでは、実績ページの動的な機能を実装しています。
 * - ロゴのスクロールアニメーション
 * - お客様の声カルーセル
 * - 各種インタラクティブ要素の実装
 */

document.addEventListener('DOMContentLoaded', function() {
    // クライアントロゴの自動スクロール（必要に応じてJSで実装、すでにCSSでアニメーション済み）
    // 必要に応じてロゴを複製して無限ループを作成
    const clientLogos = document.getElementById('client-logos');
    if (clientLogos) {
        const logos = clientLogos.querySelectorAll('.client-logo');
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            clientLogos.appendChild(clone);
        });
    }

    // お客様の声カルーセル
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-nav.prev');
    const nextBtn = document.querySelector('.testimonial-nav.next');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // カルーセルが存在する場合のみ実行
    if (testimonialsTrack && testimonialCards.length > 0) {
        // 初期状態設定
        updateCarousel();

        // 前へボタン
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            updateCarousel();updateCarousel();
        });

        // 次へボタン
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            updateCarousel();
        });

        // スワイプ機能の実装（モバイル向け）
        testimonialsTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        testimonialsTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        // スワイプを処理する関数
        function handleSwipe() {
            const threshold = 50; // スワイプを検出する最小距離
            if (touchEndX < touchStartX - threshold) {
                // 左スワイプ（次へ）
                currentIndex = (currentIndex + 1) % testimonialCards.length;
                updateCarousel();
            } else if (touchEndX > touchStartX + threshold) {
                // 右スワイプ（前へ）
                currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
                updateCarousel();
            }
        }

        // カルーセルの表示を更新する関数
        function updateCarousel() {
            const offset = -currentIndex * 100;
            testimonialsTrack.style.transform = `translateX(${offset}%)`;
        }

        // 自動再生（オプション）
        let autoplayInterval;
        
        function startAutoplay() {
            autoplayInterval = setInterval(function() {
                currentIndex = (currentIndex + 1) % testimonialCards.length;
                updateCarousel();
            }, 5000); // 5秒ごとに切り替え
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // マウスオーバーで自動再生を一時停止
        testimonialsTrack.addEventListener('mouseenter', stopAutoplay);
        testimonialsTrack.addEventListener('mouseleave', startAutoplay);
        
        // タッチイベントでも自動再生を一時停止
        testimonialsTrack.addEventListener('touchstart', stopAutoplay);
        testimonialsTrack.addEventListener('touchend', function() {
            // タッチ終了から少し遅延して自動再生を再開
            setTimeout(startAutoplay, 2000);
        });
        
        // 自動再生を開始
        startAutoplay();
    }

    // 画像の遅延読み込み
    if ('loading' in HTMLImageElement.prototype) {
        // ブラウザがネイティブの遅延読み込みをサポートしている場合
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.getAttribute('src');
        });
    } else {
        // 遅延読み込みをサポートしていない古いブラウザ向けのフォールバック
        // 必要に応じて遅延読み込みのJSライブラリを実装
        // この例では単純化のため省略
    }

    // インタラクションの追加
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    caseStudyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });

    // パフォーマンスモニタリング（オプション - 開発用）
    const perfEntries = performance.getEntriesByType('navigation');
    if (perfEntries.length > 0 && perfEntries[0].loadEventEnd > 0) {
        const loadTime = Math.round(perfEntries[0].loadEventEnd);
        console.log(`Page loaded in ${loadTime}ms`);
    }

    // 構造化データの動的追加（例：JSON-LDの追加処理が必要な場合）
    function addCaseStudyStructuredData() {
        const caseStudies = document.querySelectorAll('.case-study-card');
        if (caseStudies.length === 0) return;

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'itemListElement': []
        };

        caseStudies.forEach((card, index) => {
            const title = card.querySelector('.case-title').textContent;
            const description = card.querySelector('.case-description').textContent;
            
            structuredData.itemListElement.push({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                    '@type': 'Article',
                    'name': title,
                    'description': description,
                    'provider': {
                        '@type': 'Organization',
                        'name': 'MIRAINA'
                    }
                }
            });
        });

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // ページロード完了後に構造化データを追加
    window.addEventListener('load', addCaseStudyStructuredData);
});