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

  // ---- Location-based currency ----
  function detectCurrency() {
    try {
      var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
      var ukZones = ['Europe/London', 'Europe/Belfast', 'Europe/Guernsey', 'Europe/Jersey', 'Europe/Isle_of_Man'];
      if (ukZones.indexOf(tz) !== -1) return { code: 'GBP', symbol: '£' };
      if (tz.indexOf('Europe/') === 0) return { code: 'EUR', symbol: '€' };
      if (tz === 'Atlantic/Canary' || tz === 'Atlantic/Madeira') return { code: 'EUR', symbol: '€' };
    } catch (e) {}
    // Fallback to browser locale region
    var loc = (navigator.language || '').toLowerCase();
    if (loc === 'en-gb' || loc.indexOf('-gb') !== -1) return { code: 'GBP', symbol: '£' };
    var euRegions = ['-de', '-fr', '-es', '-it', '-nl', '-ie', '-pt', '-at', '-be', '-fi', '-gr', '-ee', '-lv', '-lt', '-sk', '-si', '-mt', '-cy', '-lu', '-hr'];
    for (var i = 0; i < euRegions.length; i++) {
      if (loc.indexOf(euRegions[i]) !== -1) return { code: 'EUR', symbol: '€' };
    }
    return { code: 'USD', symbol: '$' };
  }

  var CURRENCY = detectCurrency();

  // Apply the detected currency symbol to all static price amounts
  document.querySelectorAll('.price-amount').forEach(function(el) {
    var amt = el.getAttribute('data-amount');
    if (amt !== null) el.textContent = CURRENCY.symbol + amt;
  });

  // Apply currency symbol to the flash-sale dynamic price
  document.querySelectorAll('.flash-symbol').forEach(function(el) {
    el.textContent = CURRENCY.symbol;
  });

  // ---- Flash sale countdown timer ----
  var flashTimer = document.getElementById('flashTimer');
  if (flashTimer) {
    var STORAGE_KEY = 'flashSaleEndsAt';
    var WINDOW_MS = 12 * 60 * 60 * 1000; // rolling 12-hour offer
    var endsAt = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!endsAt || isNaN(endsAt) || endsAt < Date.now()) {
      endsAt = Date.now() + WINDOW_MS;
      try { localStorage.setItem(STORAGE_KEY, String(endsAt)); } catch (e) {}
    }
    var hEl = flashTimer.querySelector('[data-unit="hours"]');
    var mEl = flashTimer.querySelector('[data-unit="minutes"]');
    var sEl = flashTimer.querySelector('[data-unit="seconds"]');
    var pad = function(n) { return n < 10 ? '0' + n : '' + n; };
    var updateTimer = function() {
      var diff = Math.max(0, endsAt - Date.now());
      var total = Math.floor(diff / 1000);
      if (hEl) hEl.textContent = pad(Math.floor(total / 3600));
      if (mEl) mEl.textContent = pad(Math.floor((total % 3600) / 60));
      if (sEl) sEl.textContent = pad(total % 60);
    };
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ---- Animated price drop (29.99 -> 9.99) on scroll into view ----
  var flashNum = document.querySelector('.flash-num');
  if (flashNum) {
    var fromVal = parseFloat(flashNum.getAttribute('data-from'));
    var toVal = parseFloat(flashNum.getAttribute('data-to'));
    flashNum.textContent = fromVal.toFixed(2);
    var played = false;
    var animateDrop = function() {
      if (played) return;
      played = true;
      var duration = 1600;
      var startTs = null;
      var frame = function(ts) {
        if (!startTs) startTs = ts;
        var p = Math.min((ts - startTs) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        flashNum.textContent = (fromVal + (toVal - fromVal) * eased).toFixed(2);
        if (p < 1) requestAnimationFrame(frame);
        else flashNum.textContent = toVal.toFixed(2);
      };
      requestAnimationFrame(frame);
    };
    if ('IntersectionObserver' in window) {
      var dropObs = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { animateDrop(); obs.disconnect(); }
        });
      }, { threshold: 0.5 });
      dropObs.observe(flashNum);
    } else {
      animateDrop();
    }
  }
});
