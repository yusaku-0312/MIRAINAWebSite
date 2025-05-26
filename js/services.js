/**
 * services.js
 * サービスページの機能を実装するスクリプトファイル
 */

document.addEventListener('DOMContentLoaded', function() {
    // FAQ開閉機能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 現在開いているFAQを閉じる
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            // クリックされたFAQの開閉状態を切り替え
            item.classList.toggle('active');
        });
        
        // キーボード操作にも対応
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // スムーススクロール
    const smoothScroll = (target, duration) => {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeOutQuad(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        // イージング関数
        const easeOutQuad = (t) => t * (2 - t);
        
        requestAnimationFrame(animation);
    };
    
    // アンカーリンククリック時のスムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                const target = this.getAttribute('href');
                smoothScroll(target, 800);
            }
        });
    });
    
    // ページ内リンクの自動ハイライト
    const highlightNavOnScroll = () => {
        const sections = document.querySelectorAll('.service-details');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 150 && 
                window.pageYOffset < sectionTop + sectionHeight - 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentSection)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    
    // スクロール時のナビゲーションハイライト
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // 初期ロード時にもナビゲーションをハイライト
    highlightNavOnScroll();
    
    // サービスカテゴリーのアニメーション
    const categoryItems = document.querySelectorAll('.category-item');
    
    const animateOnScroll = () => {
        categoryItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight - 100) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    };
    
    // カテゴリーアイテムの初期スタイル
    categoryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s, transform 0.6s';
    });
    
    // スクロール時にアニメーション
    window.addEventListener('scroll', animateOnScroll);
    
    // 初期ロード時にもアニメーション
    animateOnScroll();
});