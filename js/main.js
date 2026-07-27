/* Divya Jyoti Public School — Shared JavaScript */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScroll();
  initScrollTop();
  initFadeIn();
  initCounters();
  initGallery();
  initGalleryFilters();
  initForms();
  setActiveNavLink();
});

/* Mobile Navigation */
function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    nav.classList.toggle("open");
    document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* Sticky Header */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/* Scroll to Top */
function initScrollTop() {
  const btn = document.querySelector(".scroll-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Fade-in on Scroll */
function initFadeIn() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* Gallery Lightbox */
function initGallery() {
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.querySelector(".lightbox");
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  let currentIndex = 0;
  const images = Array.from(items).map((item) => ({
    src: item.querySelector("img").src,
    alt: item.querySelector("img").alt,
  }));

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      showImage(index);
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/* Gallery Category Filters */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === "all" || category === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });
}

/* Animated Counters */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* Form Handling */
function initForms() {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitter = e.submitter;
      if (submitter?.dataset.action === "whatsapp") {
        sendWhatsApp(form);
        return;
      }

      const btn = submitter || form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = "✓ Sent Successfully!";
        btn.style.background = "#22c55e";
        form.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  });
}

function sendWhatsApp(form) {
  const name = form.querySelector("[name='name']")?.value || "";
  const phone = form.querySelector("[name='phone']")?.value || "";
  const email = form.querySelector("[name='email']")?.value || "";
  const subject = form.querySelector("[name='subject']")?.selectedOptions?.[0]?.text || "";
  const message = form.querySelector("[name='message']")?.value || "";

  const text = `Hello Divya Jyoti Public School,%0A%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email || "N/A"}%0ASubject: ${subject || "General Inquiry"}%0A%0AMessage: ${message}`;
  window.open(`https://wa.me/919001477276?text=${text}`, "_blank");
}

/* Highlight Active Nav Link */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}
