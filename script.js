// Global state for scan results and analytics
let scanResults = null;
const analyticsData = {
  totalScans: 0,
  industries: {},
  lastUpdated: null
};
  // Enhanced scan button handler with analytics
window.runLuminAIScan = function() {
  // Track scan initiation
  analyticsData.totalScans++;
  analyticsData.lastUpdated = new Date().toISOString();
  
  // Show scanning notification
  const notification = document.createElement('div');
  notification.className = 'scan-notification';
  notification.innerHTML = `
    <div class="scan-notification-content">
      <div class="scan-progress">
        <div class="scan-progress-bar"></div>
      </div>
      <p>Scanning how AI describes your business...</p>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
const scanSection = document.getElementById('scan-widget');
  if (scanSection) {
    scanSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const firstInput = scanSection.querySelector('input, textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 400);
    }
    return Promise.resolve();
  }
  return Promise.reject('Scan section not found');
};
// Enhanced stats with industry data
const industryStats = {
  "ecommerce": { leads: "2.8x", accuracy: "72%"},
  "healthcare": { leads: "3.1x", accuracy: "81%"},
  "professional": { leads: "2.4x", accuracy: "68%"},
  "manufacturing": { leads: "2.1x", accuracy: "65%"}
};

// Animate stats counter with enhanced data
function animateCounters() {
  const industry = "ecommerce"; // Could be dynamic based on user input
  
document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let count = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(count) + suffix;
      }
    }, 16);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Animate stats when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
// Initialize feather icons
  feather.replace();
  // Other primary button click handlers
const primaryButtons = document.querySelectorAll('.btn-primary:not([data-role="scan-button"])');
  primaryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Default primary button behavior
    });
  });
// Secondary button click handlers
  const secondaryButtons = document.querySelectorAll('.btn-secondary');
  secondaryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // In a real app, this would open a contact form or booking modal
      console.log('Book a call clicked');
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
