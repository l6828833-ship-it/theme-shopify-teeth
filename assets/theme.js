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

  // ---- Location-based currency: Europe -> EUR, UK -> GBP, rest -> USD ----
  function detectCurrency() {
    var tz = '';
    try { tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch (e) {}

    // United Kingdom (and GBP-pegged territories)
    var ukZones = ['Europe/London', 'Europe/Belfast', 'Europe/Guernsey', 'Europe/Jersey', 'Europe/Isle_of_Man', 'Europe/Gibraltar'];
    if (ukZones.indexOf(tz) !== -1) return { code: 'GBP', symbol: '£' };

    // Europe -> EUR (all Europe/* plus a few island/Cyprus zones)
    var euExtra = ['Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Faroe', 'Atlantic/Reykjavik', 'Atlantic/Azores', 'Asia/Nicosia', 'Asia/Famagusta'];
    if (tz.indexOf('Europe/') === 0 || euExtra.indexOf(tz) !== -1) return { code: 'EUR', symbol: '€' };

    // Fallback to browser locale
    var loc = (navigator.language || '').toLowerCase();
    if (loc === 'en-gb' || loc.indexOf('-gb') !== -1) return { code: 'GBP', symbol: '£' };

    // Region code suffixes that map to Europe
    var euRegions = ['-de','-fr','-es','-it','-nl','-ie','-pt','-at','-be','-fi','-gr','-ee','-lv','-lt','-sk','-si','-mt','-cy','-lu','-hr','-pl','-cz','-hu','-ro','-bg','-dk','-se','-no','-ch','-is','-li','-mc','-ad','-sm'];
    for (var i = 0; i < euRegions.length; i++) {
      if (loc.indexOf(euRegions[i]) !== -1) return { code: 'EUR', symbol: '€' };
    }

    // European language codes (no region) as a last hint
    var euLangs = ['de','fr','es','it','nl','pt','el','fi','sv','da','pl','cs','hu','ro','bg','hr','sk','sl','et','lv','lt','is','no'];
    var primary = loc.split('-')[0];
    if (euLangs.indexOf(primary) !== -1) return { code: 'EUR', symbol: '€' };

    return { code: 'USD', symbol: '$' };
  }

  var CURRENCY = detectCurrency();
  window.CURRENCY_SYMBOL = CURRENCY.symbol;

  // Apply the detected currency symbol to all static price amounts
  document.querySelectorAll('.price-amount').forEach(function(el) {
    var amt = el.getAttribute('data-amount');
    if (amt !== null) el.textContent = CURRENCY.symbol + amt;
  });

  // Apply currency symbol to the flash-sale dynamic price
  document.querySelectorAll('.flash-symbol').forEach(function(el) {
    el.textContent = CURRENCY.symbol;
  });

  // Apply currency symbol to the hero notification
  document.querySelectorAll('.notif-symbol').forEach(function(el) {
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

  // ---- Hero flash-sale notification that docks onto the CTA ----
  var notif = document.getElementById('heroNotification');
  var hero = document.querySelector('.hero');
  var heroCta = document.getElementById('heroCta');
  var ctaTag = document.getElementById('ctaTag');
  var ctaPriceDrop = document.getElementById('ctaPriceDrop');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (notif && hero && heroCta) {
    if (reduceMotion) {
      // Skip the motion: just attach the discount tag + price drop
      notif.style.display = 'none';
      if (ctaTag) ctaTag.classList.add('is-visible');
      if (ctaPriceDrop) ctaPriceDrop.classList.add('is-visible');
      heroCta.classList.add('cta-docked');
    } else {
      // 1) Slide the notification in gently after load
      setTimeout(function() {
        notif.classList.add('is-visible');
      }, 1000);

      // 2) After it has been visible for ~2.6s, dock it onto the CTA button
      setTimeout(function() {
        var heroRect = hero.getBoundingClientRect();
        var notifRect = notif.getBoundingClientRect();
        var btnRect = heroCta.getBoundingClientRect();

        // Aim the notification's center at the button's top-right corner
        var targetCenterX = btnRect.right - heroRect.left;
        var targetCenterY = btnRect.top - heroRect.top;
        var curCenterX = (notifRect.left - heroRect.left) + notifRect.width / 2;
        var curCenterY = (notifRect.top - heroRect.top) + notifRect.height / 2;

        var dx = targetCenterX - curCenterX;
        var dy = targetCenterY - curCenterY;

        // Slower, smoother arc as it travels and settles onto the button
        notif.style.transition = 'transform 1.25s cubic-bezier(0.45, 0.05, 0.2, 1), opacity 0.9s ease 0.35s';
        notif.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(0.18)';
        notif.classList.add('is-docking');

        var docked = false;
        var dock = function() {
          if (docked) return;
          docked = true;
          notif.style.display = 'none';
          heroCta.classList.add('cta-docked');
          if (ctaTag) ctaTag.classList.add('is-visible');
          if (ctaPriceDrop) ctaPriceDrop.classList.add('is-visible');
        };
        notif.addEventListener('transitionend', function handler(e) {
          if (e.propertyName !== 'transform') return;
          notif.removeEventListener('transitionend', handler);
          dock();
        });
        // Safety fallback in case transitionend doesn't fire
        setTimeout(dock, 1500);
      }, 1000 + 2600);
    }
  }

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
