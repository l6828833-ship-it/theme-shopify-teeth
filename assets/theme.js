/* ============================================================
   LUXURY TEETH WHITENING — Theme JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* -------------------------------------------------- FAQ accordion */
  function initFaq() {
    var questions = document.querySelectorAll('.faq-question');
    questions.forEach(function (button) {
      button.addEventListener('click', function () {
        var answer = button.nextElementSibling;
        var isOpen = answer.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-question').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.faq-answer').forEach(function (a) {
          a.classList.remove('open');
        });

        // Open current (if it was closed)
        if (!isOpen) {
          button.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
          answer.classList.add('open');
        }
      });
    });
  }

  /* -------------------------------------------------- Scroll reveal */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !reveals.length) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Stagger siblings within a grid for a smoother cascade
    reveals.forEach(function (el, i) {
      var delay = (i % 4) * 80;
      el.style.transitionDelay = delay + 'ms';
      observer.observe(el);
    });
  }

  /* -------------------------------------------------- Navbar scroll state */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var onScroll = function () {
      if (window.scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------- Sticky mobile CTA */
  function initStickyCta() {
    var sticky = document.getElementById('stickyCta');
    if (!sticky) return;
    var hero = document.querySelector('.hero');
    var footer = document.querySelector('.footer');
    var onScroll = function () {
      var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 400;
      var pastHero = window.scrollY > heroBottom - 100;
      // Hide once the footer is in view to avoid overlap
      var nearFooter = footer && (footer.getBoundingClientRect().top < window.innerHeight + 80);
      if (pastHero && !nearFooter) {
        sticky.classList.add('show');
      } else {
        sticky.classList.remove('show');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------- Add to cart */
  function addToCart(quantity) {
    // Replace PRODUCT_VARIANT_ID with your product's variant ID in Shopify admin.
    var variantId = window.WHITENING_VARIANT_ID || 'PRODUCT_VARIANT_ID';

    if (variantId === 'PRODUCT_VARIANT_ID') {
      // Not configured yet — send the shopper to the cart/checkout gracefully.
      window.location.href = '/cart';
      return;
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: variantId, quantity: quantity }] })
    })
      .then(function (res) { return res.json(); })
      .then(function () { window.location.href = '/cart'; })
      .catch(function (err) {
        console.error('Add to cart failed:', err);
        window.location.href = '/cart';
      });
  }

  function initAddToCart() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qty = parseInt(btn.getAttribute('data-quantity'), 10) || 1;
        addToCart(qty);
      });
    });
  }

  /* -------------------------------------------------- Smooth anchor scroll */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var navbar = document.getElementById('navbar');
        var offset = navbar ? navbar.offsetHeight + 8 : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* -------------------------------------------------- Init */
  document.addEventListener('DOMContentLoaded', function () {
    initFaq();
    initReveal();
    initNavbar();
    initStickyCta();
    initAddToCart();
    initSmoothAnchors();
  });

  // Expose for inline handlers / debugging
  window.addToCart = addToCart;
})();
