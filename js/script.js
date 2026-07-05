// ─── Nexaroitech – script.js ───

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Mobile hamburger ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      if (navbar) navbar.classList.toggle('menu-open');
      document.body.classList.toggle('nav-open-lock');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        if (navbar) navbar.classList.remove('menu-open');
        document.body.classList.remove('nav-open-lock');
      });
    });
  }

  // ── Expandable service cards (services.html) ──
  document.querySelectorAll('.service-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');
    const toggleCard = () => {
      const isOpen = card.classList.toggle('open');
      card.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard();
      }
    });
  });

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Animate on scroll ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.service-card, .internship-card, .value-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // ── Contact form with WhatsApp + Email via EmailJS ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const successMsg = document.getElementById('formSuccess');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = {
        name: this.name.value,
        email: this.email.value,
        phone: this.phone.value,
        subject: this.subject.value,
        message: this.message.value,
      };

      // Build WhatsApp message
      const waText = `Hello Nexaroitech,\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nSubject: ${data.subject}\n\nMessage: ${data.message}`;
      const waUrl = `https://wa.me/919084200498?text=${encodeURIComponent(waText)}`;

      // Open WhatsApp
      window.open(waUrl, '_blank');

      // Also send via mailto fallback
      const mailtoLink = `mailto:apal87457@gmail.com?subject=${encodeURIComponent('[Nexaro] ' + data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n${data.message}`)}`;
      setTimeout(() => window.open(mailtoLink, '_blank'), 1500);

      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.textContent = '✓ Message sent! We\'ll reply within 24 hours.';
      }
      this.reset();
      btn.disabled = false;
      btn.textContent = 'Send Message';
    });
  }

  // ── Internship Apply Form ──
  const internForm = document.getElementById('internForm');
  if (internForm) {
    internForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const data = {
        fullname: this.fullname.value,
        email: this.email.value,
        phone: this.phone.value,
        domain: this.domain.value,
        college: this.college.value,
        linkedin: this.linkedin?.value || 'N/A',
        message: this.message?.value || '',
      };

      const waText = `🎓 *Internship Application – Nexaroitech*\n\nName: ${data.fullname}\nEmail: ${data.email}\nPhone: ${data.phone}\nDomain: ${data.domain}\nCollege: ${data.college}\nLinkedIn: ${data.linkedin}\n\nMessage: ${data.message}`;
      const waUrl = `https://wa.me/919084200498?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');

      const mailtoLink = `mailto:apal87457@gmail.com?subject=${encodeURIComponent('[Internship Application] ' + data.domain + ' – ' + data.fullname)}&body=${encodeURIComponent(`Name: ${data.fullname}\nEmail: ${data.email}\nPhone: ${data.phone}\nDomain: ${data.domain}\nCollege: ${data.college}\nLinkedIn: ${data.linkedin}\n\n${data.message}`)}`;
      setTimeout(() => window.open(mailtoLink, '_blank'), 1500);

      btn.textContent = '✓ Application Submitted!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = 'Apply Now'; btn.disabled = false; }, 4000);
      this.reset();
    });
  }

  // ── Certificate Verify ──
  const verifyForm = document.getElementById('verifyForm');
  if (verifyForm) {
    let bundledCerts = {};

    fetch('data/certificates.json')
      .then(r => r.ok ? r.json() : {})
      .then(data => { bundledCerts = data || {}; })
      .catch(() => { bundledCerts = {}; })
      .finally(() => {
        // Auto-verify if a ?id= param is present (used by certificate QR codes)
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get('id');
        if (idParam) {
          verifyForm.certId.value = idParam;
          verifyForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      });

    function lookupCertificate(certId) {
      // 1. Locally-generated certificates (this browser's admin panel / dashboard)
      if (typeof nexaroGetCertificates === 'function') {
        const local = nexaroGetCertificates();
        if (local[certId]) return local[certId];
      }
      // 2. Bundled/shared certificates.json
      if (bundledCerts[certId]) return bundledCerts[certId];
      return null;
    }

    verifyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const certId = this.certId.value.trim().toUpperCase();
      const result = document.getElementById('verifyResult');
      const cert = lookupCertificate(certId);
      if (cert) {
        result.className = 'verify-result success';
        result.innerHTML = `✓ Certificate Verified<br><small>Issued to <strong>${cert.name}</strong> for <strong>${cert.domain}</strong> internship (${cert.duration}) in ${cert.year}.</small>`;
      } else {
        result.className = 'verify-result error';
        result.innerHTML = `✗ Certificate not found. Please check the ID and try again.`;
      }
      result.style.display = 'block';
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
