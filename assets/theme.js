// Toggle FAQ accordion
function toggleFaq(button) {
  const answer = button.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.faq-answer').forEach(ans => {
    ans.classList.remove('open');
  });
  
  // Toggle current FAQ
  if (!isOpen) {
    button.classList.add('active');
    answer.classList.add('open');
  }
}

// Add to cart functionality
function addToCart(quantity) {
  // This will be connected to your Shopify product
  // Replace PRODUCT_ID with your actual product ID
  const productId = 'PRODUCT_ID'; // Update this with your product ID
  
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          id: productId,
          quantity: quantity
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => {
    // Redirect to cart
    window.location.href = '/cart';
  })
  .catch(error => console.error('Error:', error));
}

// Smooth scroll for CTA buttons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(button => {
    if (!button.hasAttribute('onclick')) {
      button.addEventListener('click', function() {
        window.location.href = '/cart';
      });
    }
  });

  // Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = function() {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Modern scroll-reveal with staggered entrances
  // Auto-tag grid children so cards animate in sequence
  const staggerGroups = document.querySelectorAll(
    '.benefits-grid, .steps-grid, .testimonials-grid, .pricing-grid'
  );
  staggerGroups.forEach(group => {
    Array.from(group.children).forEach((child, index) => {
      child.classList.add('reveal');
      child.style.transitionDelay = (index * 0.1) + 's';
    });
  });

  // Tag standalone elements for reveal
  document.querySelectorAll(
    '.section-header, .comparison-image, .guarantee-content, .faq-item'
  ).forEach(el => el.classList.add('reveal'));

  document.querySelectorAll('.faq-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  // Observe everything tagged for reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function(entries, obs) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything if IntersectionObserver is unsupported
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Animate stat bars: fill to their data-value when scrolled into view
  const statBars = document.querySelectorAll('.stat-bar-fill');

  if ('IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver(function(entries, obs) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const value = entry.target.getAttribute('data-value') || '0';
          entry.target.style.width = value + '%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statBars.forEach(bar => barObserver.observe(bar));
  } else {
    statBars.forEach(bar => {
      bar.style.width = (bar.getAttribute('data-value') || '0') + '%';
    });
  }
});
