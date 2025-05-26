/**
 * MIRAINA Homepage specific functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Additional page-specific initializations
    
    // Animate service cards on scroll
    initServiceCardAnimations();
    
    // Handle smooth scrolling for navigation links
    initSmoothScrolling();
  });
  
  /**
   * Initialize animations for service cards
   */
  function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length === 0) return;
    
    // Create intersection observer to trigger animations when elements come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      threshold: 0.2 // Trigger when 20% of the element is visible
    });
    
    // Observe each service card
    serviceCards.forEach(card => {
      // Add base class for animations
      card.classList.add('fade-in-element');
      observer.observe(card);
    });
  }
  
  /**
   * Initialize smooth scrolling for navigation links
   */
  function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('header nav a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Check if the link is pointing to an in-page section
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
          e.preventDefault();
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
  
  /**
   * Add animation class to elements when they're scrolled into view
   */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  }


  
  /**
 * MIRAINA Homepage specific functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Additional page-specific initializations
  
  // Animate service cards on scroll
  initServiceCardAnimations();
  
  // Handle smooth scrolling for navigation links
  initSmoothScrolling();
  
  // Initialize contact section animations
  initContactSectionAnimations();
});

/**
* Initialize animations for service cards
*/
function initServiceCardAnimations() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (serviceCards.length === 0) return;
  
  // Create intersection observer to trigger animations when elements come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.2 // Trigger when 20% of the element is visible
  });
  
  // Observe each service card
  serviceCards.forEach(card => {
    // Add base class for animations
    card.classList.add('fade-in-element');
    observer.observe(card);
  });
}

/**
* Initialize smooth scrolling for navigation links
*/
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('header nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Check if the link is pointing to an in-page section
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
* Add animation class to elements when they're scrolled into view
*/
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

/**
* Initialize animations for contact section
*/
function initContactSectionAnimations() {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;
  
  // Observer options
  const observerOptions = {
      threshold: 0.2 // Trigger when 20% of the element is visible
  };
  
  // Create observer for contact section elements
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              // Animate section header with delay
              const sectionHeader = contactSection.querySelector('.section-header');
              if (sectionHeader) {
                  setTimeout(() => {
                      sectionHeader.classList.add('animate');
                  }, 300);
              }
              
              // Animate contact text box with delay
              const contactText = contactSection.querySelector('.contact-text');
              if (contactText) {
                  setTimeout(() => {
                      contactText.classList.add('animate');
                  }, 600);
              }
              
              // Animate contact features list items with staggered delay
              const featureItems = contactSection.querySelectorAll('.contact-features li');
              if (featureItems.length) {
                  featureItems.forEach((item, index) => {
                      setTimeout(() => {
                          item.classList.add('animate');
                      }, 800 + (index * 200));
                  });
              }
              
              // Animate button container with delay
              const buttonContainer = contactSection.querySelector('.contact-button-container');
              if (buttonContainer) {
                  setTimeout(() => {
                      buttonContainer.classList.add('animate');
                  }, 900);
              }
              
              // Unobserve after animation is triggered
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);
  
  // Start observing the contact section
  observer.observe(contactSection);
  
  // Add button hover effects and optional pulse animation
  initContactButtonEffects();
  
  // Add subtle parallax effect to contact section
  initContactParallaxEffect();
}

/**
* Initialize contact button effects
*/
function initContactButtonEffects() {
  const contactButton = document.querySelector('.contact-button');
  if (!contactButton) return;
  
  let pulseTimeout;
  
  // Add pulse keyframes if not already added
  if (!document.getElementById('contact-pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'contact-pulse-keyframes';
      style.textContent = `
          @keyframes pulse {
              0% {
                  box-shadow: 0 0 0 0 rgba(30, 144, 255, 0.7);
              }
              70% {
                  box-shadow: 0 0 0 10px rgba(30, 144, 255, 0);
              }
              100% {
                  box-shadow: 0 0 0 0 rgba(30, 144, 255, 0);
              }
          }
          
          .contact-button.pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
      `;
      document.head.appendChild(style);
  }
  
  // Start pulse animation after delay
  function startPulseAnimation() {
      pulseTimeout = setTimeout(() => {
          contactButton.classList.add('pulse');
          
          // Remove pulse class after animation completes
          setTimeout(() => {
              contactButton.classList.remove('pulse');
              startPulseAnimation();
          }, 2000);
      }, 5000); // Pulse every 5 seconds
  }
  
  startPulseAnimation();
  
  // Clear animation on hover
  contactButton.addEventListener('mouseenter', () => {
      clearTimeout(pulseTimeout);
      contactButton.classList.remove('pulse');
  });
  
  // Restart animation on mouse leave
  contactButton.addEventListener('mouseleave', () => {
      startPulseAnimation();
  });
}

/**
* Initialize subtle parallax effect on contact section
*/
function initContactParallaxEffect() {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;
  
  contactSection.addEventListener('mousemove', (e) => {
      // Only apply parallax if elements are already animated
      if (!contactSection.querySelector('.contact-text.animate')) return;
      
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      
      const elements = contactSection.querySelectorAll('.contact-text, .contact-button-container');
      elements.forEach(elem => {
          // Preserve existing animation by using translateX/Y in addition to any existing transform
          elem.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
  });
  
  // Reset transform on mouse leave
  contactSection.addEventListener('mouseleave', () => {
      const elements = contactSection.querySelectorAll('.contact-text, .contact-button-container');
      elements.forEach(elem => {
          // Remove only the parallax effect, preserving other transforms
          elem.style.transform = '';
      });
  });
}

