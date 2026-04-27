(() => {
  const products = window.PRODUCTS || [];
  const grid = document.getElementById("grid");
  const filtersEl = document.getElementById("filters");
  const searchEl = document.getElementById("search");
  const emptyEl = document.getElementById("empty");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const state = { category: "All", query: "" };

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const counts = categories.reduce((acc, c) => {
    acc[c] = c === "All" ? products.length : products.filter((p) => p.category === c).length;
    return acc;
  }, {});

  // ---- Filters ----
  filtersEl.innerHTML = categories
    .map(
      (c) => `
      <button type="button" class="chip" data-cat="${escapeAttr(c)}" aria-pressed="${c === state.category}">
        ${escapeHtml(c)}<span class="count">${counts[c]}</span>
      </button>`
    )
    .join("");

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.category = btn.dataset.cat;
    filtersEl.querySelectorAll(".chip").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.cat === state.category))
    );
    render();
  });

  // ---- Search ----
  searchEl.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });

  // ---- Render ----
  function render() {
    const visible = products.filter((p) => {
      const inCat = state.category === "All" || p.category === state.category;
      const q = state.query;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return inCat && inQuery;
    });

    grid.innerHTML = visible.map(cardHtml).join("");
    emptyEl.classList.toggle("hidden", visible.length !== 0);
  }

  function cardHtml(p) {
    return `
      <article class="card" data-id="${p.id}">
        <div class="card-art" style="background:${p.color};color:${p.fg}">
          <span class="card-tag">${escapeHtml(p.category)}</span>
          <span aria-hidden="true">${p.icon}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(p.name)}</h3>
          <p class="card-desc">${escapeHtml(p.desc)}</p>
          <div class="card-rates" role="group" aria-label="Rental rates">
            <div>
              <span class="rate-label">Daily</span>
              <span class="rate-value"><span class="currency">$</span>${p.daily}</span>
            </div>
            <div>
              <span class="rate-label">Weekly</span>
              <span class="rate-value"><span class="currency">$</span>${p.weekly}</span>
            </div>
            <div>
              <span class="rate-label">Monthly</span>
              <span class="rate-value"><span class="currency">$</span>${p.monthly}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  render();
})();
