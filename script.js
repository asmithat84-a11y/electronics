/* =========================================================
   VoltFix Electronics - script.js
   Edit the SHOP object below to change shop details everywhere.
   ========================================================= */

const SHOP = {
  name: "VoltFix Electronics",
  phone: "+919999999999",          // used for call links
  phoneDisplay: "+91 99999 99999", // shown on the page
  whatsapp: "919999999999",        // country code + number, no + sign
  serviceRadiusKm: 20,
  arrivalMinutes: 30,
};

document.addEventListener("DOMContentLoaded", () => {
  applyShopDetails();
  setupMenu();
  setupProductFilter();
  setupEnquiryButtons();
  setupDistanceChecker();
  setupBookingForm();
  setupImageFallback();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Shop details ---------- */
function applyShopDetails() {
  document.querySelectorAll("[data-shop='name']").forEach((el) => (el.textContent = SHOP.name));
  document.querySelectorAll("[data-shop-tel]").forEach((el) => {
    el.setAttribute("href", "tel:" + SHOP.phone);
    if (el.classList.contains("call-link") || el.closest(".footer-links") || el.closest(".book-phone")) {
      if (!el.classList.contains("call-link")) el.textContent = SHOP.phoneDisplay;
    }
  });
  document.querySelectorAll("[data-shop-wa]").forEach((el) =>
    el.setAttribute("href", "https://wa.me/" + SHOP.whatsapp)
  );
}

/* ---------- Mobile menu ---------- */
function setupMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- Product filter ---------- */
function setupProductFilter() {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".product-card");
  const empty = document.getElementById("emptyState");

  function applyFilter(category) {
    let visible = 0;
    cards.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible++;
    });
    empty.hidden = visible !== 0;

    chips.forEach((chip) => {
      const active = chip.dataset.filter === category;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-selected", String(active));
    });
  }

  chips.forEach((chip) => chip.addEventListener("click", () => applyFilter(chip.dataset.filter)));

  // Clicking a category card filters the product list
  document.querySelectorAll(".category-card[data-filter]").forEach((card) =>
    card.addEventListener("click", () => applyFilter(card.dataset.filter))
  );
}

/* ---------- WhatsApp enquiry ---------- */
function setupEnquiryButtons() {
  document.querySelectorAll(".enquire").forEach((btn) =>
    btn.addEventListener("click", () => {
      const message = `Hello ${SHOP.name}, I am interested in: ${btn.dataset.product}. Is it in stock?`;
      window.open(`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    })
  );
}

/* ---------- Distance checker ---------- */
function setupDistanceChecker() {
  const input = document.getElementById("distanceInput");
  const result = document.getElementById("distanceResult");
  const button = document.getElementById("checkDistance");

  function check() {
    const km = parseFloat(input.value);
    result.className = "checker-result";

    if (Number.isNaN(km) || km < 0) {
      result.textContent = "Enter your distance in kilometres, for example 12.";
      result.classList.add("bad");
      return;
    }
    if (km <= SHOP.serviceRadiusKm) {
      result.textContent = `Yes, we cover ${km} km. A technician can reach you in ${SHOP.arrivalMinutes} minutes.`;
      result.classList.add("ok");
    } else {
      result.textContent = `${km} km is outside our ${SHOP.serviceRadiusKm} km area. Bring the device to the shop, or call us for a pickup.`;
      result.classList.add("bad");
    }
  }

  button.addEventListener("click", check);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
}

/* ---------- Booking form ---------- */
function setupBookingForm() {
  const form = document.getElementById("bookForm");
  const status = document.getElementById("formStatus");

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Enter your name."),
    phone: (v) => (/^[6-9]\d{9}$/.test(v.trim()) ? "" : "Enter a valid 10-digit mobile number."),
    device: (v) => (v ? "" : "Choose the device that needs repair."),
    distance: (v) => (v !== "" && Number(v) >= 0 ? "" : "Enter how far you are from the shop."),
    issue: (v) => (v.trim().length >= 5 ? "" : "Describe the problem in a few words."),
  };

  function validateField(name) {
    const field = form.elements[name];
    const message = rules[name](field.value);
    field.closest(".field").classList.toggle("invalid", Boolean(message));
    form.querySelector(`[data-error-for="${name}"]`).textContent = message;
    return !message;
  }

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", () => validateField(name));
    form.elements[name].addEventListener("input", () => {
      if (form.elements[name].closest(".field").classList.contains("invalid")) validateField(name);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!allValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("bad");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const km = Number(data.distance);

    if (km > SHOP.serviceRadiusKm) {
      status.textContent = `You are ${km} km away, outside our ${SHOP.serviceRadiusKm} km home-service area. Call the shop and we will arrange a pickup.`;
      status.classList.add("bad");
      return;
    }

    // Demo: save bookings in the browser. A real shop would send this to a server.
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push({ ...data, time: new Date().toISOString() });
    localStorage.setItem("bookings", JSON.stringify(bookings));

    status.textContent = `Thank you, ${data.name.trim()}. We will call you within 5 minutes.`;
    status.classList.add("ok");
    showToast("Booking request sent");
    form.reset();
  });
}

/* ---------- Toast ---------- */
function showToast(text) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ---------- Broken image fallback ---------- */
function setupImageFallback() {
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'>" +
        "<rect width='100%' height='100%' fill='#e4ebf5'/>" +
        "<text x='50%' y='50%' fill='#5b6b82' font-family='sans-serif' font-size='22' " +
        "text-anchor='middle' dominant-baseline='middle'>Image not available</text></svg>"
    );

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      if (img.src !== placeholder) img.src = placeholder;
    }, { once: true });
  });
}
