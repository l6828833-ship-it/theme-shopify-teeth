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

// Buy a specific variant immediately: clear cart, add it, go straight to checkout
function buyNow(variantId, quantity) {
  if (!variantId) { window.location.href = '/cart'; return; }
  fetch('/cart/clear.js', { method: 'POST' })
    .then(function () {
      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: quantity || 1 }] })
      });
    })
    .then(function () { window.location.href = '/checkout'; })
    .catch(function () { window.location.href = '/cart'; });
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

  // ---- Slide-in notification that docks onto a CTA (hero + product page) ----
  function setupDockNotification(notif, container, cta, tag, priceDrop) {
    if (!notif || !container || !cta) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveal = function () {
      if (tag) tag.classList.add('is-visible');
      if (priceDrop) priceDrop.classList.add('is-visible');
      cta.classList.add('cta-docked');
    };
    if (reduceMotion) { notif.style.display = 'none'; reveal(); return; }
    setTimeout(function () { notif.classList.add('is-visible'); }, 1000);
    setTimeout(function () {
      var cRect = container.getBoundingClientRect();
      var nRect = notif.getBoundingClientRect();
      var bRect = cta.getBoundingClientRect();
      var dx = (bRect.right - cRect.left) - ((nRect.left - cRect.left) + nRect.width / 2);
      var dy = (bRect.top - cRect.top) - ((nRect.top - cRect.top) + nRect.height / 2);
      notif.style.transition = 'transform 1.25s cubic-bezier(0.45, 0.05, 0.2, 1), opacity 0.9s ease 0.35s';
      notif.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(0.18)';
      notif.classList.add('is-docking');
      var docked = false;
      var dock = function () { if (docked) return; docked = true; notif.style.display = 'none'; reveal(); };
      notif.addEventListener('transitionend', function h(e) {
        if (e.propertyName !== 'transform') return;
        notif.removeEventListener('transitionend', h);
        dock();
      });
      setTimeout(dock, 1600);
    }, 1000 + 2600);
  }

  setupDockNotification(
    document.getElementById('heroNotification'),
    document.querySelector('.hero'),
    document.getElementById('heroCta'),
    document.getElementById('ctaTag'),
    document.getElementById('ctaPriceDrop')
  );
  setupDockNotification(
    document.getElementById('pdpNotification'),
    document.querySelector('.pdp-hero'),
    document.getElementById('pdpCta'),
    document.getElementById('pdpTag'),
    null
  );

  // ---- Sticky dismissible flash-sale bar ----
  var flashBar = document.getElementById('flashBar');
  var flashBarClose = document.getElementById('flashBarClose');
  if (flashBar) {
    var barDismissed = false;
    try { barDismissed = sessionStorage.getItem('flashBarDismissed') === '1'; } catch (e) {}
    if (!barDismissed) {
      setTimeout(function () {
        flashBar.classList.add('is-visible');
        document.body.classList.add('has-flash-bar');
      }, 1200);
    }
    if (flashBarClose) {
      flashBarClose.addEventListener('click', function () {
        flashBar.classList.remove('is-visible');
        document.body.classList.remove('has-flash-bar');
        try { sessionStorage.setItem('flashBarDismissed', '1'); } catch (e) {}
      });
    }
  }

  // ---- Mobile nav toggle ----
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // ---- Product add-to-cart goes STRAIGHT to checkout with the chosen package ----
  document.querySelectorAll('form[action*="/cart/add"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var checked = form.querySelector('[name="id"]:checked') || form.querySelector('[name="id"]');
      var qtyField = form.querySelector('[name="quantity"]');
      var qty = qtyField ? (parseInt(qtyField.value, 10) || 1) : 1;
      if (checked && checked.value) { buyNow(checked.value, qty); } else { form.submit(); }
    });
  });
});
