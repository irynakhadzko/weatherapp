document.addEventListener("DOMContentLoaded", () => {
  const data        = buildWeatherData();
  const grid        = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  const countBadge  = document.getElementById("count");

  function weatherColHTML(w) {
    return `<div class="weather-col">
      <span class="weather-emoji">${w.emoji}</span>
      <span class="weather-temp">${w.temp}°C</span>
      <span class="weather-condition">${w.condition}</span>
      <span class="weather-meta">💧${w.humidity}% 💨${w.wind}km/h</span>
    </div>`;
  }

  function cityRowHTML(city) {
    return `
      <div class="city-row">
        <div class="city-name-col">
          <span class="city-name">${city.name}</span>
          ${city.isCapital ? '<span class="capital-badge">Capital</span>' : ""}
        </div>
        ${weatherColHTML(city.today)}
        ${weatherColHTML(city.tomorrow)}
      </div>`;
  }

  function cardHTML(entry) {
    const cap = entry.cities[0];
    return `
      <article class="card">
        <div class="card-header">
          <span class="country-flag">${entry.flag}</span>
          <div class="country-info">
            <div class="country-name">${entry.country}</div>
            <div class="country-weather-summary">${cap.today.emoji} ${cap.today.condition} · ${cap.today.temp}°C</div>
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
});
