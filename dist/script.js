const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const quoteForm = document.querySelector("[data-quote-form]");
const quoteResult = document.querySelector("[data-quote-result]");
const quoteMessage = document.querySelector("[data-quote-message]");
const copyMessage = document.querySelector("[data-copy-message]");
const planButtons = document.querySelectorAll("[data-plan]");
const heroVideo = document.querySelector("[data-hero-video]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (heroVideo?.dataset.nextSrc) {
  let hasSwappedHeroVideo = false;

  heroVideo.addEventListener("ended", () => {
    if (hasSwappedHeroVideo) return;

    hasSwappedHeroVideo = true;
    heroVideo.loop = true;

    if (heroVideo.dataset.nextPoster) {
      heroVideo.poster = heroVideo.dataset.nextPoster;
    }

    heroVideo.src = heroVideo.dataset.nextSrc;
    heroVideo.load();
    heroVideo.play().catch(() => {});
  });
}

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
    quoteForm.elements.experience.value = button.dataset.plan;
    document.querySelector("#reservar").scrollIntoView({ behavior: "smooth", block: "center" });
    quoteForm.elements.guests.focus({ preventScroll: true });
  });
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const date = data.get("date") || "fecha por confirmar";
  const guests = data.get("guests");
  const experience = data.get("experience");
  const time = data.get("time");
  const message = `Hola Yates de Mike, quiero cotizar ${experience} para ${guests}, en horario de ${time}, con fecha ${date}. Me gustaría conocer disponibilidad y detalles de la salida.`;

  quoteMessage.textContent = message;
  quoteResult.hidden = false;
});

copyMessage.addEventListener("click", async () => {
  const text = quoteMessage.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyMessage.textContent = "Copiado";
    window.setTimeout(() => {
      copyMessage.textContent = "Copiar";
    }, 1400);
  } catch {
    copyMessage.textContent = "Selecciona el texto";
  }
});
