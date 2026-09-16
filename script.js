const projectGrid = document.querySelector("#projects-grid");
const certificatesGrid = document.querySelector("#certificates-grid");
const modal = document.querySelector("#certificate-modal");
const modalContent = document.querySelector("#modal-content");
const modalClose = document.querySelector(".modal-close");

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card";

  const demoLink = project.demo
    ? `<a href="${project.demo}" target="_blank" rel="noreferrer">Live ↗</a>`
    : "";

  const githubLink = project.github
    ? `<a href="${project.github}" target="_blank" rel="noreferrer">GitHub ↗</a>`
    : `<span class="muted">Link coming soon</span>`;

  card.innerHTML = `
    <div class="project-visual" data-short="${project.short || ""}" aria-hidden="true">
      <div class="project-orb"></div>
      <div class="project-orb small"></div>
      <div class="project-orb tiny"></div>
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

function createCertificateCard(cert, index) {
  const card = document.createElement("article");
  card.className = `cert-card${cert.featured ? " featured-cert" : ""}`;

  const hasFile = Boolean(cert.file);
  const fileHint = hasFile ? "open certificate" : "details only";

  card.innerHTML = `
    <div class="cert-preview">
      <div>
        <div class="cert-seal">${cert.type === "Language" ? "C1" : "✓"}</div>
      </div>
    </div>
    <div>
      <h3 class="cert-name">${cert.title}</h3>
      <p class="cert-org">${cert.issuer}</p>
    </div>
    <div class="cert-bottom">
      <span>${cert.date}</span>
      <span>${fileHint}</span>
    </div>
  `;

  card.addEventListener("click", () => openCertificate(cert));
  return card;
}

function openCertificate(cert) {
  modalContent.innerHTML = `
    <p class="eyebrow">${cert.type || "Certificate"}</p>
    <h3>${cert.title}</h3>
    <p>${cert.issuer} · ${cert.date}</p>
  `;

  if (cert.file) {
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(cert.file);

    if (isImage) {
      modalContent.insertAdjacentHTML(
        "beforeend",
        `<img class="modal-media" src="${cert.file}" alt="${cert.title}" />`
      );
    } else {
      modalContent.insertAdjacentHTML(
        "beforeend",
        `<p><a class="text-link" href="${cert.file}" target="_blank" rel="noreferrer">Open certificate file ↗</a></p>`
      );
    }
  } else {
    modalContent.insertAdjacentHTML(
      "beforeend",
      `<p>Add the certificate image/PDF to <code>assets/certificates</code> and set its path in <code>content.js</code>.</p>`
    );
  }

  if (typeof modal.showModal === "function") modal.showModal();
}

function render() {
  projects.forEach((project, index) => {
    projectGrid.appendChild(createProjectCard(project, index));
  });

  certificates.forEach((cert, index) => {
    certificatesGrid.appendChild(createCertificateCard(cert, index));
  });

  document.querySelector("#year").textContent = new Date().getFullYear();

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
