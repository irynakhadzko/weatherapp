document.addEventListener("DOMContentLoaded", () => {
  const data        = buildWeatherData();
  const grid        = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  const countBadge  = document.getElementById("count");
  const statusBar   = document.getElementById("status-bar");
  const statusText  = document.getElementById("status-text");
  const statusProg  = document.getElementById("status-progress");

  // ── Render helpers ──────────────────────────────────────────

  function weatherColHTML(w, loading) {
    if (loading) {
      return `<div class="weather-col loading-col">
        <div class="skeleton skeleton-emoji"></div>
        <div class="skeleton skeleton-temp"></div>
        <div class="skeleton skeleton-cond"></div>
        <div class="skeleton skeleton-meta"></div>
      </div>`;
    }
    return `<div class="weather-col">
      <span class="weather-emoji">${w.emoji}</span>
      <span class="weather-temp">${w.temp}°C</span>
      <span class="weather-condition">${w.condition}</span>
      <span class="weather-meta">💧${w.humidity}% 💨${w.wind}km/h</span>
    </div>`;
  }

  function cityRowHTML(city) {
    return `
      <div class="city-row" data-city="${city.name}">
        <div class="city-name-col">
          <span class="city-name">${city.name}</span>
          ${city.isCapital ? '<span class="capital-badge">Capital</span>' : ""}
        </div>
        ${weatherColHTML(city.today,    city.loading)}
        ${weatherColHTML(city.tomorrow, city.loading)}
      </div>`;
  }

  function cardHTML(entry) {
    const cap = entry.cities[0];
    const summary = cap.loading
      ? '<span class="live-badge loading-badge">Loading…</span>'
      : `${cap.today.emoji} ${cap.today.condition} · ${cap.today.temp}°C
         <span class="live-badge">Live</span>`;

    return `
      <article class="card" id="card-${entry.country.replace(/\s+/g, "-")}">
        <div class="card-header">
          <span class="country-flag">${entry.flag}</span>
          <div class="country-info">
            <div class="country-name">${entry.country}</div>
            <div class="country-weather-summary">${summary}</div>
          </div>
        </div>
        <div class="col-headers">
          <span class="col-header">City</span>
          <span class="col-header">Today</span>
          <span class="col-header">Tomorrow</span>
        </div>
        ${entry.cities.map(cityRowHTML).join("")}
      </article>`;
  }

  // ── Initial render (mock) ───────────────────────────────────

  function render(query) {
    const q        = query.trim().toLowerCase();
    const filtered = q ? data.filter(e => e.country.toLowerCase().includes(q)) : data;

    countBadge.textContent = `${filtered.length} of ${data.length} countries`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>No countries match "<strong>${query}</strong>"</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(cardHTML).join("");
  }

  searchInput.addEventListener("input", e => render(e.target.value));
  render("");

  // ── Progressive live data loading ───────────────────────────

  const CONCURRENCY = 6;
  let completed = 0;
  const total   = data.reduce((n, e) => n + e.cities.length, 0);

  statusBar.hidden = false;
  statusText.textContent = `Fetching live weather… 0 / ${total} cities`;

  function updateStatus() {
    completed++;
    const pct = Math.round((completed / total) * 100);
    statusProg.style.width = pct + "%";
    statusText.textContent = completed < total
      ? `Fetching live weather… ${completed} / ${total} cities`
      : "Live weather loaded ✓";
    if (completed >= total) {
      setTimeout(() => { statusBar.hidden = true; }, 2000);
    }
  }

  function applyLiveWeather(countryIdx, cityIdx, live) {
    const city    = data[countryIdx].cities[cityIdx];
    city.today    = live.today;
    city.tomorrow = live.tomorrow;
    city.loading  = false;

    const cardId = `card-${data[countryIdx].country.replace(/\s+/g, "-")}`;
    const card   = document.getElementById(cardId);
    if (!card) return;

    const rows = card.querySelectorAll(".city-row");
    const row  = rows[cityIdx];
    if (!row) return;

    const cols = row.querySelectorAll(".weather-col, .loading-col");
    cols.forEach(c => c.remove());
    row.insertAdjacentHTML("beforeend",
      weatherColHTML(city.today,    false) +
      weatherColHTML(city.tomorrow, false)
    );

    if (cityIdx === 0) {
      const summary = card.querySelector(".country-weather-summary");
      if (summary) {
        summary.innerHTML = `${city.today.emoji} ${city.today.condition} · ${city.today.temp}°C
          <span class="live-badge">Live</span>`;
      }
    }
  }

  async function loadAllCities() {
    const tasks = [];
    data.forEach((entry, ci) =>
      entry.cities.forEach((city, xi) =>
        tasks.push({ city: city.name, ci, xi })
      )
    );

    let idx = 0;

    async function worker() {
      while (idx < tasks.length) {
        const { city, ci, xi } = tasks[idx++];
        const live = await fetchCityWeather(city);
        if (live) applyLiveWeather(ci, xi, live);
        updateStatus();
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  }

  loadAllCities();
});
