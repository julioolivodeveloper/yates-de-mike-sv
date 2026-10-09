const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const quoteForm = document.querySelector("[data-quote-form]");
const bookingDialog = document.querySelector("[data-booking-dialog]");
const reservationForm = document.querySelector("[data-reservation-form]");
const bookingContent = document.querySelector("[data-booking-content]");
const bookingSuccess = document.querySelector("[data-booking-success]");
const planButtons = document.querySelectorAll("[data-plan]");
const heroVideo = document.querySelector("[data-hero-video]");
const backgroundVideos = document.querySelectorAll("video:not([data-hero-video])");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".intro-grid, .intro-photo, .section-heading, .experience-card, .route-copy > *, .service-grid article, .steps article, .gallery-grid figure, .instagram-band > *, .final-cta div"
);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  document.body.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -32px 0px" });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
    revealObserver.observe(element);
  });
}

backgroundVideos.forEach((video) => {
  video.preload = "none";
});

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.08, rootMargin: "120px 0px" });

  backgroundVideos.forEach((video) => videoObserver.observe(video));
} else if (!prefersReducedMotion) {
  backgroundVideos.forEach((video) => video.play().catch(() => {}));
} else {
  heroVideo?.pause();
}

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (heroVideo?.dataset.heroPlaylist) {
  const heroPlaylist = heroVideo.dataset.heroPlaylist.split(",").map((item) => item.trim()).filter(Boolean);
  const heroPosters = (heroVideo.dataset.heroPosters || "").split(",").map((item) => item.trim());
  let heroVideoIndex = Math.max(heroPlaylist.indexOf(heroVideo.getAttribute("src")), 0);

  heroVideo.addEventListener("ended", () => {
    if (heroPlaylist.length < 2) return;

    heroVideoIndex = (heroVideoIndex + 1) % heroPlaylist.length;
    const nextPoster = heroPosters[heroVideoIndex];

    if (nextPoster) {
      heroVideo.poster = nextPoster;
    }

    heroVideo.src = heroPlaylist[heroVideoIndex];
    heroVideo.load();
    heroVideo.play().catch(() => {});
  });
}

const today = new Date();
const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
quoteForm.elements.date.min = localToday;

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }
});

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#reservar").scrollIntoView({ behavior: "smooth", block: "center" });
    quoteForm.elements.date.focus({ preventScroll: true });
  });
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const date = data.get("date");
  const days = Number(data.get("days"));
  const formatDate = new Date(`${date}T12:00:00`).toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric" });

  bookingDialog.querySelector("[data-summary-date]").textContent = formatDate;
  bookingDialog.querySelector("[data-summary-days]").textContent = `${days} ${days === 1 ? "día" : "días"}`;

  bookingContent.hidden = false;
  bookingSuccess.hidden = true;
  reservationForm.reset();
  bookingDialog.showModal();
});

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingContent.hidden = true;
  bookingSuccess.hidden = false;
  reservationForm.reset();
  bookingDialog.querySelector("[data-success-title]").focus();
});

bookingDialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
  button.addEventListener("click", () => bookingDialog.close());
});

bookingDialog.addEventListener("click", (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});
