const moduleNav = document.querySelector("#moduleNav");
const modulePanel = document.querySelector("#modulePanel");
const searchInput = document.querySelector("#searchInput");
const flowDescription = document.querySelector("#flowDescription");
const studyPathList = document.querySelector("#studyPath");
const routineChecklistList = document.querySelector("#routineChecklist");
const flowNodes = document.querySelectorAll(".flow-node");

let activeModuleId = modules[0].id;

function normalizeText(value) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function moduleMatchesSearch(moduleItem, term) {
    const searchable = [
        moduleItem.title,
        moduleItem.source,
        moduleItem.summary,
        moduleItem.reflection,
        ...moduleItem.concepts.flatMap((concept) => [concept.name, concept.explanation])
    ].join(" ");

    return normalizeText(searchable).includes(term);
}

function renderNavigation() {
    const term = normalizeText(searchInput.value.trim());
    const filteredModules = term
        ? modules.filter((moduleItem) => moduleMatchesSearch(moduleItem, term))
        : modules;

    moduleNav.innerHTML = "";

    filteredModules.forEach((moduleItem, index) => {
        const button = document.createElement("button");
        button.className = `nav-item ${moduleItem.id === activeModuleId ? "active" : ""}`;
        button.type = "button";
        button.dataset.moduleId = moduleItem.id;
        button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${moduleItem.title}`;
        moduleNav.appendChild(button);
    });

    if (filteredModules.length === 0) {
        moduleNav.innerHTML = '<p class="empty-state">Nenhum módulo encontrado.</p>';
        modulePanel.innerHTML = '<div class="empty-panel">Tente buscar por camada, servlet, JDBC, exceção ou coleção.</div>';
        return;
    }

    if (!filteredModules.some((moduleItem) => moduleItem.id === activeModuleId)) {
        activeModuleId = filteredModules[0].id;
    }

    renderModule();
}

function renderModule() {
    const moduleItem = modules.find((item) => item.id === activeModuleId);

    modulePanel.innerHTML = `
        <div class="module-header">
            <div>
                <p class="eyebrow">${moduleItem.source}</p>
                <h2>${moduleItem.title}</h2>
            </div>
            <span class="reading-pill">${moduleItem.concepts.length} conceitos</span>
        </div>

        <p class="module-summary">${moduleItem.summary}</p>

        <div class="concept-grid">
            ${moduleItem.concepts.map((concept, index) => `
                <a class="concept-card concept-link" href="conceito.html?module=${moduleItem.id}&concept=${index}">
                    <h3>${concept.name}</h3>
                    <p>${concept.explanation}</p>
                    <span>Ver explicação e exemplos</span>
                </a>
            `).join("")}
        </div>

        <div class="code-block">
            <div class="code-header">
                <span>Exemplo didático</span>
                <button type="button" class="icon-button" id="copyCode" aria-label="Copiar exemplo" title="Copiar exemplo">⧉</button>
            </div>
            <pre><code>${escapeHtml(moduleItem.code)}</code></pre>
        </div>

        <div class="reflection-box">
            <strong>Ponto de leitura</strong>
            <p>${moduleItem.reflection}</p>
        </div>
    `;

    document.querySelectorAll(".nav-item").forEach((button) => {
        button.classList.toggle("active", button.dataset.moduleId === activeModuleId);
    });

    document.querySelector("#copyCode").addEventListener("click", async () => {
        await navigator.clipboard.writeText(moduleItem.code);
        const copyButton = document.querySelector("#copyCode");
        copyButton.textContent = "✓";
        setTimeout(() => {
            copyButton.textContent = "⧉";
        }, 1200);
    });
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderSupportPanels() {
    flowDescription.textContent = flowDescriptions.interface;
    studyPathList.innerHTML = studyPath.map((item) => `<li>${item}</li>`).join("");
    routineChecklistList.innerHTML = routineChecklist.map((item) => `<li>${item}</li>`).join("");
}

moduleNav.addEventListener("click", (event) => {
    const button = event.target.closest(".nav-item");
    if (!button) {
        return;
    }

    activeModuleId = button.dataset.moduleId;
    renderModule();
});

searchInput.addEventListener("input", renderNavigation);

flowNodes.forEach((node) => {
    node.addEventListener("click", () => {
        flowNodes.forEach((flowNode) => flowNode.classList.remove("active"));
        node.classList.add("active");
        flowDescription.textContent = flowDescriptions[node.dataset.flow];
    });
});

renderSupportPanels();
renderNavigation();
