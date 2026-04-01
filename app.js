document.addEventListener("DOMContentLoaded", () => {
  const data = buildWeatherData();
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  const countBadge = document.getElementById("count");

  function renderCard(entry) {
    const capitalWeather = entry.cities[0].today;

    const citiesHTML = entry.cities
      .map((city) => {
        const t = city.today;
        const n = city.tomorrow;
        return `
        <div class="city-row">
          <div class="city-name-col">
            <span class="city-name">${city.name}</span>
            ${city.isCapital ? '<span class="capital-badge">Capital</span>' : ""}
          </div>
          <div class="weather-col">
            <span class="weather-emoji">${t.emoji}</span>
            <span class="weather-temp">${t.temp}°C</span>
            <span class="weather-condition">${t.condition}</span>
            <span class="weather-meta">💧${t.humidity}% 💨${t.wind}km/h</span>
          </div>
          <div class="weather-col">
            <span class="weather-emoji">${n.emoji}</span>
            <span class="weather-temp">${n.temp}°C</span>
            <span class="weather-condition">${n.condition}</span>
            <span class="weather-meta">💧${n.humidity}% 💨${n.wind}km/h</span>
          </div>
        </div>`;
      })
      .join("");

    return `
      <article class="card">
        <div class="card-header">
          <span class="country-flag">${entry.flag}</span>
          <div class="country-info">
            <div class="country-name">${entry.country}</div>
            <div class="country-weather-summary">${capitalWeather.emoji} ${capitalWeather.condition} · ${capitalWeather.temp}°C today</div>
          </div>
        </div>
        <div class="col-headers">
          <span class="col-header">City</span>
          <span class="col-header">Today</span>
          <span class="col-header">Tomorrow</span>
        </div>
        ${citiesHTML}
      </article>`;
  }

  function render(query) {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? data.filter((e) => e.country.toLowerCase().includes(q))
      : data;

    countBadge.textContent = `${filtered.length} of ${data.length} countries`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>No countries match "<strong>${query}</strong>"</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join("");
  }

  searchInput.addEventListener("input", (e) => render(e.target.value));
  render("");
});
