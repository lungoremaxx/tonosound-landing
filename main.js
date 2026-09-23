/* ==========================================================
   CONFIGURACIÓN — editar estos valores
   ========================================================== */
const CONFIG = {
  // Número de WhatsApp en formato internacional, sin +, espacios ni guiones.
  // Ej. Argentina (CABA): 5491112345678
  whatsapp: "5493518750771",
  // ID del Pixel de Meta (Events Manager). Vacío = pixel desactivado.
  metaPixelId: "",
  // URL de Instagram. Vacío = se oculta el link.
  instagram: "",
};

/* ---------- Meta Pixel ---------- */
(function initPixel() {
  if (!CONFIG.metaPixelId) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq("init", CONFIG.metaPixelId);
  fbq("track", "PageView");
})();

function track(event, params) {
  if (typeof window.fbq === "function") window.fbq("track", event, params || {});
}

/* ---------- WhatsApp ---------- */
function waUrl(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".js-wa").forEach((el) => {
  el.href = waUrl(el.dataset.waMsg || "Hola TonoSound!");
  el.target = "_blank";
  el.rel = "noopener";
  el.addEventListener("click", () => track("Contact", { content_name: el.dataset.track || "whatsapp" }));
});

if (CONFIG.instagram) {
  document.querySelectorAll(".js-ig").forEach((el) => {
    el.href = CONFIG.instagram;
    el.target = "_blank";
    el.rel = "noopener";
    el.hidden = false;
  });
}

document.querySelectorAll('a[href="#cotizar"]').forEach((el) =>
  el.addEventListener("click", () => track("ViewContent", { content_name: "cotizar_cta" }))
);

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Tabs ---------- */
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    selectTab(tab);
    tab.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  });
  tab.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

/* ---------- Formulario → WhatsApp ---------- */
const form = document.getElementById("quote-form");
const formError = document.getElementById("form-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = (data.get("nombre") || "").trim();
  const tipo = data.get("tipo");

  form.nombre.classList.toggle("is-invalid", !nombre);
  form.tipo.classList.toggle("is-invalid", !tipo);
  if (!nombre || !tipo) {
    formError.hidden = false;
    (!nombre ? form.nombre : form.tipo).focus();
    return;
  }
  formError.hidden = true;

  let fecha = data.get("fecha");
  if (fecha) {
    const [y, m, d] = fecha.split("-");
    fecha = `${d}/${m}/${y}`;
  }
  const necesita = data.getAll("necesita");

  const lines = [
    "Hola TonoSound! Quiero pedir una cotización.",
    "",
    `• Nombre: ${nombre}`,
    `• Evento: ${tipo}`,
    fecha && `• Fecha: ${fecha}`,
    data.get("lugar") && `• Lugar: ${data.get("lugar").trim()}`,
    data.get("personas") && `• Personas: ${data.get("personas")}`,
    necesita.length && `• Necesito: ${necesita.join(", ")}`,
    data.get("mensaje") && `• Comentarios: ${data.get("mensaje").trim()}`,
  ].filter(Boolean);

  track("Lead", { content_name: tipo, content_category: necesita.join("|") });
  window.open(waUrl(lines.join("\n")), "_blank", "noopener");
});

form.querySelectorAll("input, select").forEach((el) =>
  el.addEventListener("input", () => el.classList.remove("is-invalid"))
);

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".section .h2, .service, .event, .steps li, .rider, .quote__intro, .form");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    io.observe(el);
  });
}

/* ---------- Onda sonora del hero ---------- */
(function wave() {
  const canvas = document.getElementById("wave");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, raf, base = 0.5, visible = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Envolvente: la onda crece hacia la derecha, como en el board de marca.
  function y(x, t, phase, amp) {
    const nx = x / w;
    const env = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, (nx - 0.28) / 0.72))), 1.4);
    return h * base +
      Math.sin(nx * 9 + t + phase) * amp * env +
      Math.sin(nx * 21 - t * 1.4 + phase) * amp * 0.18 * env;
  }

  function frame(ts) {
    const t = reduce ? 1.2 : ts * 0.00045;
    ctx.clearRect(0, 0, w, h);
    const mobile = w < 700;
    const amp = h * (mobile ? 0.08 : 0.15);
    base = mobile ? 0.3 : 0.5;

    const grad = ctx.createLinearGradient(w * 0.3, 0, w, 0);
    grad.addColorStop(0, "rgba(0,229,255,0)");
    grad.addColorStop(0.25, "rgba(0,229,255,0.9)");
    grad.addColorStop(0.7, "rgba(168,255,61,0.8)");
    grad.addColorStop(1, "rgba(255,176,34,0.9)");

    // Líneas verticales tipo espectro
    const step = mobile ? 10 : 7;
    for (let x = w * 0.3; x < w; x += step) {
      const yy = y(x, t, 0, amp);
      const len = Math.abs(yy - h * base) * 1.5 + 4;
      const a = Math.min(0.28, len / h);
      ctx.strokeStyle = x / w > 0.78 ? `rgba(255,176,34,${a})` : `rgba(0,229,255,${a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yy - len * 0.5);
      ctx.lineTo(x, yy + len * 0.5);
      ctx.stroke();
    }

    // Ondas principales con glow
    const layers = [
      { phase: 0, width: 2.4, alpha: 1, blur: 24 },
      { phase: 0.5, width: 1.2, alpha: 0.5, blur: 12 },
      { phase: 1.1, width: 1, alpha: 0.3, blur: 0 },
    ];
    layers.forEach((l) => {
      ctx.save();
      ctx.globalAlpha = l.alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = l.width;
      ctx.shadowColor = "rgba(0,229,255,0.8)";
      ctx.shadowBlur = l.blur;
      ctx.beginPath();
      for (let x = w * 0.25; x <= w; x += 3) {
        const yy = y(x, t, l.phase, amp * (1 - l.phase * 0.25));
        x === w * 0.25 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Reflejo en el piso
    const floor = ctx.createLinearGradient(0, h * 0.72, 0, h);
    floor.addColorStop(0, "rgba(0,229,255,0.05)");
    floor.addColorStop(1, "rgba(0,229,255,0)");
    ctx.fillStyle = floor;
    ctx.fillRect(w * 0.4, h * 0.72, w * 0.6, h * 0.28);

    if (!reduce && visible) raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", () => { resize(); if (reduce) frame(0); });
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(frame);
  }).observe(canvas);
  raf = requestAnimationFrame(frame);
})();
