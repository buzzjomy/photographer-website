document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header solid-on-scroll ---------- */
  var header = document.getElementById('siteHeader');
  if (header && !header.classList.contains('page-header')) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add('is-solid');
      } else {
        header.classList.remove('is-solid');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
      });
    });
  }

  /* ---------- Portfolio filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.hidden = !match;
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var closeBtn = document.getElementById('lightboxClose');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    var visibleItems = [];
    var currentIndex = 0;

    function getVisibleItems() {
      return Array.prototype.filter.call(galleryItems, function (item) {
        return !item.hidden;
      });
    }

    function openLightbox(index) {
      visibleItems = getVisibleItems();
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
      var item = visibleItems[currentIndex];
      if (!item) return;
      var img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.getAttribute('data-category') === 'weddings' ? 'Weddings' : 'Portraits';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        visibleItems = getVisibleItems();
        var index = visibleItems.indexOf(item);
        openLightbox(index === -1 ? 0 : index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      updateLightbox();
    });
    nextBtn.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      updateLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });
  }

  /* ---------- Contact form (AJAX submit to FormSubmit.co) ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Sending...';
      status.className = 'form-status';
      status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (response.ok && data.success !== 'false') {
            status.textContent = 'Thank you! Your enquiry has been sent — we\'ll be in touch within 48 hours.';
            status.className = 'form-status success';
            form.reset();
          } else {
            status.textContent = 'Something went wrong sending your message. Please try emailing or calling directly instead.';
            status.className = 'form-status error';
          }
        });
      }).catch(function () {
        status.textContent = 'Something went wrong sending your message. Please try emailing or calling directly instead.';
        status.className = 'form-status error';
      }).finally(function () {
        submitBtn.disabled = false;
      });
    });
  }

});
