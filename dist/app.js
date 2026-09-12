(function () {
  "use strict";

  const guides = window.GUIDES;
  const article = document.getElementById("article");
  const sectionNav = document.getElementById("section-nav");
  const onPageNav = document.getElementById("on-page-nav");
  const pageNav = document.getElementById("page-nav");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const progress = document.getElementById("reading-progress");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuButton = document.getElementById("mobile-menu");
  const toast = document.getElementById("toast");

  let activeGuideId = "guia-java-basico";
  let activeSectionId = "inicio";
  let toastTimer;

  function normalize(value) {
    return value
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function textFromHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.textContent.replace(/\s+/g, " ").trim();
  }

  function readRoute() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const requestedGuide = guides[parts[0]] ? parts[0] : "guia-java-basico";
    const guide = guides[requestedGuide];
    const requestedSection = guide.sections.some((section) => section.id === parts[1])
      ? parts[1]
      : "inicio";

    return { guideId: requestedGuide, sectionId: requestedSection };
  }

  function routeTo(guideId, sectionId) {
    return "#/" + guideId + "/" + sectionId;
  }

  function renderSidebar(guide, sectionId) {
    document.getElementById("sidebar-eyebrow").textContent = guide.label;
    document.getElementById("sidebar-title").textContent = guide.shortTitle;

    sectionNav.innerHTML = guide.sections
      .map((section, index) => {
        const active = section.id === sectionId ? " active" : "";
        const current = section.id === sectionId ? ' aria-current="page"' : "";
        return (
          '<a class="' + active.trim() + '" href="' + routeTo(activeGuideId, section.id) + '"' + current + ">" +
          "<span>" + String(index).padStart(2, "0") + "</span>" +
          "<strong>" + section.nav + "</strong>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderArticle(guide, section) {
    const index = guide.sections.indexOf(section);
    article.innerHTML =
      '<header class="article-header">' +
        '<p class="kicker">' + guide.label + " · " + String(index).padStart(2, "0") + "</p>" +
        "<h1>" + section.title + "</h1>" +
        '<p class="lead">' + section.lead + "</p>" +
        '<div class="meta-row">' +
          '<span class="meta-pill">' + section.time + " de leitura</span>" +
          '<span class="meta-pill">' + guide.level + "</span>" +
          '<span class="meta-pill">Fonte: ' + guide.source + "</span>" +
        "</div>" +
      "</header>" +
      section.html;

    article.querySelectorAll(".copy-code").forEach((button) => {
      button.addEventListener("click", copyCode);
    });

    renderOnPage();
  }

  function renderOnPage() {
    const headings = Array.from(article.querySelectorAll("h2[id]"));
    if (!headings.length) {
      onPageNav.innerHTML = '<span style="color:var(--muted);font-size:.75rem">Visão geral</span>';
      return;
    }

    onPageNav.innerHTML = headings
      .map((heading) => '<a href="#' + heading.id + '" data-anchor="' + heading.id + '">' + heading.textContent + "</a>")
      .join("");

    onPageNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById(link.dataset.anchor).scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderPageNav(guide, section) {
    const index = guide.sections.indexOf(section);
    const previous = guide.sections[index - 1];
    const next = guide.sections[index + 1];

    function link(item, direction) {
      if (!item) return '<span class="placeholder"></span>';
      const label = direction === "previous" ? "← Anterior" : "Próxima →";
      return (
        '<a href="' + routeTo(activeGuideId, item.id) + '">' +
          "<small>" + label + "</small>" +
          "<strong>" + item.nav + "</strong>" +
        "</a>"
      );
    }

    pageNav.innerHTML = link(previous, "previous") + link(next, "next");
  }

  function updateGuideSwitcher() {
    document.querySelectorAll("[data-guide-link]").forEach((link) => {
      const active = link.dataset.guideLink === activeGuideId;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function renderRoute() {
    const route = readRoute();
    activeGuideId = route.guideId;
    activeSectionId = route.sectionId;

    const guide = guides[activeGuideId];
    const section = guide.sections.find((item) => item.id === activeSectionId);

    searchInput.value = "";
    searchResults.hidden = true;
    article.hidden = false;
    pageNav.hidden = false;

    renderSidebar(guide, activeSectionId);
    renderArticle(guide, section);
    renderPageNav(guide, section);
    updateGuideSwitcher();
    closeMenu();
    window.scrollTo({ top: 0, behavior: "instant" });
    updateProgress();
    document.title = section.title + " · Guias Java";
  }

  function search(query) {
    const guide = guides[activeGuideId];
    const term = normalize(query.trim());

    if (!term) {
      searchResults.hidden = true;
      article.hidden = false;
      pageNav.hidden = false;
      return;
    }

    const matches = guide.sections
      .map((section, index) => ({
        section,
        index,
        body: textFromHtml(section.html)
      }))
      .filter((item) => normalize(item.section.title + " " + item.section.lead + " " + item.body).includes(term));

    article.hidden = true;
    pageNav.hidden = true;
    searchResults.hidden = false;
    searchResults.innerHTML =
      "<h1>Resultados da busca</h1>" +
      "<p>" + matches.length + (matches.length === 1 ? " seção encontrada" : " seções encontradas") + ' para “' + escapeHtml(query.trim()) + "”.</p>" +
      (matches.length
        ? matches.map((item) => {
            const body = item.body;
            const normalizedBody = normalize(body);
            const hit = normalizedBody.indexOf(term);
            const start = Math.max(0, hit - 55);
            const excerpt = (start > 0 ? "… " : "") + body.slice(start, start + 165) + (body.length > start + 165 ? "…" : "");
            return (
              '<a class="search-result" href="' + routeTo(activeGuideId, item.section.id) + '">' +
                "<small>SEÇÃO " + String(item.index).padStart(2, "0") + "</small>" +
                "<strong>" + item.section.title + "</strong>" +
                "<p>" + escapeHtml(excerpt) + "</p>" +
              "</a>"
            );
          }).join("")
        : '<div class="empty-search">Nenhum conteúdo encontrado. Tente uma palavra mais curta ou outro termo técnico.</div>');
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function copyCode(event) {
    const code = event.currentTarget.parentElement.querySelector("code").textContent;
    try {
      await navigator.clipboard.writeText(code);
      showToast("Código copiado");
    } catch (_error) {
      showToast("Não foi possível copiar");
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function updateProgress() {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = documentHeight > 0 ? Math.min(100, (window.scrollY / documentHeight) * 100) : 0;
    progress.style.width = percentage + "%";
  }

  function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) closeMenu();
    else openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  searchInput.addEventListener("input", (event) => search(event.target.value));
  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape") {
      if (document.activeElement === searchInput) {
        searchInput.value = "";
        search("");
        searchInput.blur();
      }
      closeMenu();
    }
  });

  if (!location.hash) {
    location.replace("#/guia-java-basico/inicio");
  } else {
    renderRoute();
  }
})();
