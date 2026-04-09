// ====== CONFIG ======
const WHATSAPP_NUMBER = "254724732539";

const SERVICES = [
  "Brand Identity Design",
  "Brand Guidelines",
  "Logo Design",
  "Company Profile",
  "Catalog Design",
  "Video Editing"
];

// ====== WhatsApp helper ======
function waLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// ====== Mobile Menu ======
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks?.querySelectorAll("a")?.forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ====== Booking Modal ======
const modal = document.getElementById("bookingModal");
const openBookingBtns = [
  document.getElementById("openBooking"),
  document.getElementById("openBooking2"),
  document.getElementById("openBooking3"),
  document.getElementById("openBooking4")
];
const closeBooking = document.getElementById("closeBooking");
const whatsappFromModal = document.getElementById("whatsappFromModal");

function showModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function hideModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openBookingBtns.forEach(btn => btn?.addEventListener("click", showModal));
closeBooking?.addEventListener("click", hideModal);

modal?.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});

// Fill service dropdown
const serviceSelect = document.getElementById("serviceSelect");
if (serviceSelect) {
  serviceSelect.innerHTML = SERVICES.map(s => `<option value="${s}">${s}</option>`).join("");
}

// Booking submit -> WhatsApp
const bookingForm = document.getElementById("bookingForm");
bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const service = document.getElementById("serviceSelect").value;
  const budget = document.getElementById("budget").value.trim();
  const deadline = document.getElementById("deadline").value.trim();
  const details = document.getElementById("details").value.trim();

  if (!budget || !deadline || !details) return;

  const msg =
`Hi King, I want to book a service ✅

Service: ${service}
Budget: KES ${budget}
Timeline: ${deadline}

Details:
${details}

Please share next steps + payment instructions.`;

  window.open(waLink(msg), "_blank");
});

whatsappFromModal?.addEventListener("click", () => {
  window.open(waLink("Hi King, I want to book a service. Please guide me."), "_blank");
});

// ====== Quick WhatsApp Buttons ======
const waFloat = document.getElementById("waFloat");
const heroWhatsapp = document.getElementById("heroWhatsapp");
const contactWhatsapp = document.getElementById("contactWhatsapp");

const defaultPitch = "Hi King, I’m interested in your services. Can we talk?";

if (waFloat) waFloat.href = waLink(defaultPitch);
if (heroWhatsapp) heroWhatsapp.href = waLink(defaultPitch);
if (contactWhatsapp) contactWhatsapp.href = waLink(defaultPitch);

// ====== Contact Form (front-end -> WhatsApp) ======
const contactForm = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    statusEl.textContent = "Fill in all fields.";
    return;
  }

  const fullMsg =
`New Inquiry ✅
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;

  window.open(waLink(fullMsg), "_blank");
  statusEl.textContent = "Opening WhatsApp…";
  contactForm.reset();
});

// ====== Portfolio Rendering + Search/Filter ======
const projectsGrid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

function uniqueCategories(projects) {
  const set = new Set(projects.map(p => p.category));
  return ["All", ...Array.from(set)];
}

function projectCard(p) {
  return `
    <div class="card project">
      <div class="thumb" style="background-image:url('${p.image}');"></div>
      <div class="project-meta">
        <span class="pill">${p.category}</span>
      </div>
      <h3>${p.title}</h3>
      <p class="muted">${p.description}</p>
    </div>
  `;
}

function renderFilterOptions() {
  if (!filterSelect || typeof PROJECTS === "undefined") return;
  const cats = uniqueCategories(PROJECTS);
  filterSelect.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

function renderProjects() {
  if (!projectsGrid || typeof PROJECTS === "undefined") return;

  const term = (searchInput?.value || "").toLowerCase().trim();
  const cat = filterSelect?.value || "All";

  const filtered = PROJECTS.filter(p => {
    const matchesTerm =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);

    const matchesCat = (cat === "All") || (p.category === cat);
    return matchesTerm && matchesCat;
  });

  projectsGrid.innerHTML = filtered.length
    ? filtered.map(projectCard).join("")
    : `<div class="card"><p class="muted">No projects found. Try a different search.</p></div>`;
}

renderFilterOptions();
renderProjects();

searchInput?.addEventListener("input", renderProjects);
filterSelect?.addEventListener("change", renderProjects);

// ====== Footer year ======
document.getElementById("year").textContent = new Date().getFullYear();
