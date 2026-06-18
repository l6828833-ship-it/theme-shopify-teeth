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

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});
