const detailPanel = document.querySelector("#conceptDetail");
const params = new URLSearchParams(window.location.search);
const moduleId = params.get("module");
const conceptIndex = Number(params.get("concept"));

const moduleItem = modules.find((item) => item.id === moduleId);
const concept = moduleItem && moduleItem.concepts[conceptIndex];
const detail = conceptDetails[`${moduleId}:${conceptIndex}`];

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

if (!moduleItem || !concept || !detail) {
    detailPanel.innerHTML = `
        <p class="eyebrow">Conteúdo não encontrado</p>
        <h1>Não foi possível localizar este conceito.</h1>
        <p class="detail-lead">Volte para a página inicial e escolha um card disponível.</p>
    `;
} else {
    document.title = `${concept.name} | WebTrans Lab`;

    detailPanel.innerHTML = `
        <p class="eyebrow">${moduleItem.title}</p>
        <h1>${detail.title}</h1>
        <p class="detail-lead">${detail.explanation}</p>

        <section class="detail-section">
            <h2>Ideia central</h2>
            <p>${concept.explanation}</p>
        </section>

        <section class="detail-section">
            <h2>Exemplos práticos</h2>
            <div class="example-list">
                ${detail.examples.map((example) => `<article>${example}</article>`).join("")}
            </div>
        </section>

        <section class="detail-section">
            <h2>Exemplo de leitura</h2>
            <div class="code-block">
                <div class="code-header">
                    <span>Trecho didático</span>
                </div>
                <pre><code>${escapeHtml(detail.code)}</code></pre>
            </div>
        </section>

        <section class="detail-section reflection-box">
            <strong>Como estudar este conceito</strong>
            <p>${detail.study}</p>
        </section>
    `;
}
