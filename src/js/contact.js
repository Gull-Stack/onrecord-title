/* OnRecord Title — Contact Form with Spam Protection */

(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  // Set timestamp on load
  document.getElementById('formTimestamp').value = Date.now();

  // Gibberish detection
  function isGibberish(text) {
    if (!text || text.length < 3) return false;
    var lower = text.toLowerCase();
    // Check vowel ratio
    var vowels = (lower.match(/[aeiou]/g) || []).length;
    var ratio = vowels / lower.replace(/\s/g, '').length;
    if (ratio < 0.08 || ratio > 0.85) return true;
    // Check for excessive consecutive consonants
    if (/[^aeiou\s]{7,}/i.test(lower)) return true;
    return false;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(id, show) {
    var group = document.getElementById(id).closest('.form-group');
    if (show) group.classList.add('error');
    else group.classList.remove('error');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    if (document.getElementById('fax_number').value) {
      // Silent success for bots
      showSuccess();
      return;
    }

    // Timestamp check (must be >3s since page load)
    var ts = parseInt(document.getElementById('formTimestamp').value, 10);
    if (Date.now() - ts < 3000) {
      showSuccess(); // too fast = bot
      return;
    }

    // Validate fields
    var name = document.getElementById('contactName').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var subject = document.getElementById('contactSubject').value.trim();
    var message = document.getElementById('contactMessage').value.trim();

    var valid = true;

    if (!name) { setError('contactName', true); valid = false; }
    else { setError('contactName', false); }

    if (!validateEmail(email)) { setError('contactEmail', true); valid = false; }
    else { setError('contactEmail', false); }

    if (!subject) { setError('contactSubject', true); valid = false; }
    else { setError('contactSubject', false); }

    if (!message) { setError('contactMessage', true); valid = false; }
    else { setError('contactMessage', false); }

    if (!valid) return;

    // Gibberish check
    if (isGibberish(name) || isGibberish(subject) || isGibberish(message)) {
      showSuccess(); // silent reject
      return;
    }

    // Disable submit button
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // POST to API endpoint
    var formData = {
      name: name,
      email: email,
      phone: document.getElementById('contactPhone').value.trim(),
      contact_method: document.getElementById('contactMethod').value,
      subject: subject,
      message: message,
      fax_number: document.getElementById('fax_number').value,
      timestamp: document.getElementById('formTimestamp').value
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.success) {
        showSuccess();
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    })
    .catch(function(error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please try again or call us directly at 385-464-2060.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  });

  function showSuccess() {
    form.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
  }
})();
