const projectGrid = document.querySelector("#projects-grid");
const certificatesGrid = document.querySelector("#certificates-grid");
const modal = document.querySelector("#certificate-modal");
const modalContent = document.querySelector("#modal-content");
const modalClose = document.querySelector(".modal-close");

const ICONS = {
  github: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.47 11.47 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.93.43.37.81 1.1.81 2.22v3.28c0 .32.22.7.83.58A12 12 0 0 0 12 .7Z"/></svg>',
  instagram: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>',
  external: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"/></svg>',
  mail: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.3l9 5.63 9-5.63V7H3Zm18 10V9.66l-8.47 5.3a1 1 0 0 1-1.06 0L3 9.66V17h18Z"/></svg>',
  certificate: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h13l3 3v15H4V3Zm12 1.7V7h2.3L16 4.7ZM6 5v14h12V9h-4V5H6Zm2 4h6v1.8H8V9Zm0 3.5h8v1.8H8v-1.8Zm0 3.5h5v1.8H8V16Z"/></svg>'
};

function projectImage(project) {
  const source = project.image || `https://opengraph.githubassets.com/1/${project.github?.replace('https://github.com/', '') || 'Saqlvation/portfolio'}`;
  return `<img class="project-image" src="${source}" alt="${project.title} project preview" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">`;
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card";

  const demoLink = project.demo
    ? `<a href="${project.demo}" target="_blank" rel="noreferrer">Live ↗</a>`
    : "";

  const githubLink = project.github
    ? `<a href="${project.github}" target="_blank" rel="noreferrer">GitHub ↗</a>`
    : `<span class="muted">Link coming soon</span>`;

  // Check if image exists, otherwise use the original orb animation
  const visualContent = project.image 
    ? `<img src="${project.image}" alt="${project.title} preview" class="project-image" />`
    : `<div class="project-orb"></div><div class="project-orb small"></div><div class="project-orb tiny"></div>`;

  card.innerHTML = `
    <div class="project-visual" data-short="${project.short || ""}" aria-hidden="true">
      ${visualContent}
    </div>
    <div class="project-meta">
      <span class="project-index">0${index + 1} / ${project.category}</span>
      <span class="project-year">${project.year}</span>
    </div>
    <h3 class="project-title">${project.title}</h3>
    <p class="project-description">${project.description}</p>
    <div class="project-tags">
      ${(project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join("")}
    </div>
    <div class="project-links">${githubLink}${demoLink}</div>
  `;

  return card;
}

function configurePdfWorker() {
  if (!window.pdfjsLib) return false;
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return true;
}

async function renderPdfPage(url, targetWidth) {
  const pdf = await window.pdfjsLib.getDocument(url).promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = (targetWidth / base.width) * dpr;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.aspectRatio = `${base.width} / ${base.height}`;
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  return canvas;
}

function showThumbnailFallback(container) {
  const placeholder = container.querySelector(".cert-pdf-placeholder");
  if (placeholder) placeholder.innerHTML = `${ICONS.certificate} PDF certificate`;
}

async function renderPdfThumbnail(container, url, label) {
  if (!url) return;
  if (!configurePdfWorker()) {
    showThumbnailFallback(container);
    return;
  }
  const timer = setTimeout(() => showThumbnailFallback(container), 6000);
  try {
    const width = Math.max(container.clientWidth, 320);
    const canvas = await renderPdfPage(url, width);
    canvas.className = "cert-pdf-canvas";
    container.innerHTML = "";
    container.appendChild(canvas);
    container.classList.add("has-preview");
  } catch (error) {
    console.warn(`Could not render ${label}`, error);
    showThumbnailFallback(container);
  } finally {
    clearTimeout(timer);
  }
}

function createCertificateCard(cert, index) {
  const card = document.createElement("article");
  card.className = `cert-card${cert.featured ? " featured-cert" : ""}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${cert.title} — ${cert.issuer}. Open preview`);
  const isPdf = Boolean(cert.file && /\.pdf($|\?)/i.test(cert.file));
  const isImage = Boolean(cert.file && /\.(png|jpe?g|webp|gif)($|\?)/i.test(cert.file));
  card.innerHTML = `
    <div class="cert-preview${isPdf ? " is-pdf" : ""}">
      ${isImage ? `<img class="cert-pdf-canvas" src="${cert.file}" alt="${cert.title}" loading="lazy">` : ""}
      ${isPdf ? `<div class="cert-pdf-placeholder">Loading certificate preview…</div>` : ""}
      ${!isPdf && !isImage ? `<div><div class="cert-seal">${cert.type === "Language" ? "C1" : "✓"}</div></div>` : ""}
    </div>
    <div><h3 class="cert-name">${cert.title}</h3><p class="cert-org">${cert.issuer}</p></div>
    <div class="cert-bottom"><span>${cert.date}</span><span>${cert.file ? `${ICONS.certificate} View` : "details"}</span></div>
  `;
  const preview = card.querySelector(".cert-preview");
  if (isImage) preview.classList.add("has-preview");
  if (isPdf) renderPdfThumbnail(preview, cert.file, cert.title);
  card.addEventListener("click", () => openCertificate(cert));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCertificate(cert);
    }
  });
  return card;
}

async function openCertificate(cert) {
  modalContent.innerHTML = `<p class="eyebrow">${cert.type || "Certificate"}</p><h3>${cert.title}</h3><p>${cert.issuer} · ${cert.date}</p>`;
  if (typeof modal.showModal === "function" && !modal.open) modal.showModal();

  if (!cert.file) {
    modalContent.insertAdjacentHTML("beforeend", `<p>Add the certificate image/PDF to <code>assets/certificates</code> and set its path in <code>content.js</code>.</p>`);
    return;
  }

  if (/\.(png|jpe?g|webp|gif)($|\?)/i.test(cert.file)) {
    modalContent.insertAdjacentHTML("beforeend", `<img class="modal-media" src="${cert.file}" alt="${cert.title}" />`);
  } else if (configurePdfWorker()) {
    const frame = document.createElement("div");
    frame.className = "modal-media modal-media-pdf";
    frame.textContent = "Loading certificate…";
    modalContent.appendChild(frame);
    try {
      const canvas = await renderPdfPage(cert.file, 1100);
      frame.textContent = "";
      frame.appendChild(canvas);
    } catch (error) {
      console.warn(`Could not render ${cert.title}`, error);
      frame.remove();
    }
  }

  modalContent.insertAdjacentHTML(
    "beforeend",
    `<p class="modal-actions"><a class="text-link" href="${cert.file}" target="_blank" rel="noreferrer">${ICONS.external} Open original ↗</a></p>`
  );
}

function setupTicker() {
  const track = document.querySelector(".ticker-track");
  if (!track || track.dataset.duplicated) return;
  track.innerHTML += track.innerHTML;
  track.dataset.duplicated = "true";
}

function setupReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".section-heading, .project-card, .cert-card, .skill-row, .language-card, .about-copy, .link-box, .contact-inner");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

  targets.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

function setupScrollState() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function render() {
  projects.forEach((project, index) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  certificates.forEach((cert, index) => {
    certificatesGrid.appendChild(createCertificateCard(cert, index));
  });

  document.querySelector("#year").textContent = new Date().getFullYear();

  document.querySelectorAll(".link-box").forEach(box => {
    const label = box.querySelector("span:first-child")?.textContent?.trim();
    const a = box.querySelector("a");
    if (!a) return;
    if (label === "GitHub") a.innerHTML = `${ICONS.github} @Saqlvation ↗`;
    if (label === "Instagram") a.innerHTML = `${ICONS.instagram} @micsgrave ↗`;
  });

  document.querySelectorAll('a[href="mailto:YOUR_EMAIL_HERE"]').forEach(link => {
    if (SITE.email && SITE.email !== "YOUR_EMAIL_HERE") {
      link.href = `mailto:${SITE.email}`;
      if (link.textContent.includes("YOUR_EMAIL_HERE")) link.textContent = `${SITE.email} ↗`;
    }
  });

  const contactEmail = document.querySelector(".contact-email");
  if (contactEmail && SITE.email !== "YOUR_EMAIL_HERE") {
    contactEmail.href = `mailto:${SITE.email}`;
    contactEmail.textContent = `${SITE.email} ↗`;
  }

  setupTicker();
  setupReveal();
  setupScrollState();
}

modalClose.addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  const rect = modal.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left && event.clientX <= rect.right &&
    event.clientY >= rect.top && event.clientY <= rect.bottom;

  if (!inside) modal.close();
});

render();
