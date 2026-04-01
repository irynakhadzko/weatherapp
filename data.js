// ── Weather conditions ────────────────────────────────────────
const mockConditions = [
  { label: "Sunny",         emoji: "☀️",  temp_range: [18, 32] },
  { label: "Partly Cloudy", emoji: "⛅",  temp_range: [12, 24] },
  { label: "Cloudy",        emoji: "☁️",  temp_range: [8,  18] },
  { label: "Rainy",         emoji: "🌧️", temp_range: [6,  15] },
  { label: "Drizzle",       emoji: "🌦️", temp_range: [8,  16] },
  { label: "Thunderstorm",  emoji: "⛈️", temp_range: [10, 20] },
  { label: "Snowy",         emoji: "❄️",  temp_range: [-8,  2] },
  { label: "Foggy",         emoji: "🌫️", temp_range: [4,  12] },
  { label: "Windy",         emoji: "🌬️", temp_range: [5,  14] },
  { label: "Clear Night",   emoji: "🌙",  temp_range: [5,  15] },
];

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function mockWeather(cityName, dayOffset = 0) {
  let hash = 0;
  for (let i = 0; i < cityName.length; i++)
    hash = (hash * 31 + cityName.charCodeAt(i)) >>> 0;
  const rng  = seededRandom(hash + dayOffset * 9999);
  const cond = mockConditions[Math.floor(rng() * mockConditions.length)];
  const [lo, hi] = cond.temp_range;
  return {
    condition: cond.label,
    emoji:     cond.emoji,
    temp:      Math.round(lo + rng() * (hi - lo)),
    humidity:  Math.round(40 + rng() * 50),
    wind:      Math.round(5  + rng() * 35),
  };
}

// ── Country / city data ───────────────────────────────────────
const EUROPE = [
  { country: "Albania",              flag: "🇦🇱", cities: ["Tirana",           "Durrës",             "Shkodër"]         },
  { country: "Andorra",              flag: "🇦🇩", cities: ["Andorra la Vella", "Escaldes-Engordany",  "Encamp"]          },
  { country: "Austria",              flag: "🇦🇹", cities: ["Vienna",            "Graz",               "Salzburg"]        },
  { country: "Belarus",              flag: "🇧🇾", cities: ["Minsk",             "Gomel",              "Mogilev"]         },
  { country: "Belgium",              flag: "🇧🇪", cities: ["Brussels",          "Antwerp",            "Ghent"]           },
  { country: "Bosnia & Herzegovina", flag: "🇧🇦", cities: ["Sarajevo",          "Banja Luka",         "Tuzla"]           },
  { country: "Bulgaria",             flag: "🇧🇬", cities: ["Sofia",             "Plovdiv",            "Varna"]           },
  { country: "Croatia",              flag: "🇭🇷", cities: ["Zagreb",            "Split",              "Rijeka"]          },
  { country: "Cyprus",               flag: "🇨🇾", cities: ["Nicosia",           "Limassol",           "Paphos"]          },
  { country: "Czech Republic",       flag: "🇨🇿", cities: ["Prague",            "Brno",               "Ostrava"]         },
  { country: "Denmark",              flag: "🇩🇰", cities: ["Copenhagen",        "Aarhus",             "Odense"]          },
  { country: "Estonia",              flag: "🇪🇪", cities: ["Tallinn",           "Tartu",              "Narva"]           },
  { country: "Finland",              flag: "🇫🇮", cities: ["Helsinki",          "Espoo",              "Tampere"]         },
  { country: "France",               flag: "🇫🇷", cities: ["Paris",             "Marseille",          "Lyon"]            },
  { country: "Germany",              flag: "🇩🇪", cities: ["Berlin",            "Munich",             "Hamburg"]         },
  { country: "Greece",               flag: "🇬🇷", cities: ["Athens",            "Thessaloniki",       "Patras"]          },
  { country: "Hungary",              flag: "🇭🇺", cities: ["Budapest",          "Debrecen",           "Miskolc"]         },
  { country: "Iceland",              flag: "🇮🇸", cities: ["Reykjavik",         "Akureyri",           "Keflavik"]        },
  { country: "Ireland",              flag: "🇮🇪", cities: ["Dublin",            "Cork",               "Galway"]          },
  { country: "Italy",                flag: "🇮🇹", cities: ["Rome",              "Milan",              "Naples"]          },
  { country: "Kosovo",               flag: "🇽🇰", cities: ["Pristina",          "Prizren",            "Peja"]            },
  { country: "Latvia",               flag: "🇱🇻", cities: ["Riga",              "Daugavpils",         "Liepāja"]         },
  { country: "Liechtenstein",        flag: "🇱🇮", cities: ["Vaduz",             "Schaan",             "Balzers"]         },
  { country: "Lithuania",            flag: "🇱🇹", cities: ["Vilnius",           "Kaunas",             "Klaipėda"]        },
  { country: "Luxembourg",           flag: "🇱🇺", cities: ["Luxembourg City",   "Esch-sur-Alzette",   "Differdange"]     },
  { country: "Malta",                flag: "🇲🇹", cities: ["Valletta",          "Birkirkara",         "Qormi"]           },
  { country: "Moldova",              flag: "🇲🇩", cities: ["Chișinău",          "Tiraspol",           "Bălți"]           },
  { country: "Monaco",               flag: "🇲🇨", cities: ["Monaco",            "Monte Carlo",        "La Condamine"]    },
  { country: "Montenegro",           flag: "🇲🇪", cities: ["Podgorica",         "Nikšić",             "Budva"]           },
  { country: "Netherlands",          flag: "🇳🇱", cities: ["Amsterdam",         "Rotterdam",          "The Hague"]       },
  { country: "North Macedonia",      flag: "🇲🇰", cities: ["Skopje",            "Bitola",             "Kumanovo"]        },
  { country: "Norway",               flag: "🇳🇴", cities: ["Oslo",              "Bergen",             "Trondheim"]       },
  { country: "Poland",               flag: "🇵🇱", cities: ["Warsaw",            "Kraków",             "Łódź"]            },
  { country: "Portugal",             flag: "🇵🇹", cities: ["Lisbon",            "Porto",              "Braga"]           },
  { country: "Romania",              flag: "🇷🇴", cities: ["Bucharest",         "Cluj-Napoca",        "Timișoara"]       },
  { country: "Russia",               flag: "🇷🇺", cities: ["Moscow",            "Saint Petersburg",   "Kazan"]           },
  { country: "San Marino",           flag: "🇸🇲", cities: ["San Marino",        "Serravalle",         "Borgo Maggiore"]  },
  { country: "Serbia",               flag: "🇷🇸", cities: ["Belgrade",          "Novi Sad",           "Niš"]             },
  { country: "Slovakia",             flag: "🇸🇰", cities: ["Bratislava",        "Košice",             "Prešov"]          },
  { country: "Slovenia",             flag: "🇸🇮", cities: ["Ljubljana",         "Maribor",            "Celje"]           },
  { country: "Spain",                flag: "🇪🇸", cities: ["Madrid",            "Barcelona",          "Valencia"]        },
  { country: "Sweden",               flag: "🇸🇪", cities: ["Stockholm",         "Gothenburg",         "Malmö"]           },
  { country: "Switzerland",          flag: "🇨🇭", cities: ["Bern",              "Zurich",             "Geneva"]          },
  { country: "Ukraine",              flag: "🇺🇦", cities: ["Kyiv",              "Kharkiv",            "Odessa"]          },
  { country: "United Kingdom",       flag: "🇬🇧", cities: ["London",            "Manchester",         "Birmingham"]      },
  { country: "Vatican City",         flag: "🇻🇦", cities: ["Vatican City",      "Borgo Pio",          "Trastevere"]      },
];

function buildWeatherData() {
  return EUROPE.map(entry => ({
    country: entry.country,
    flag:    entry.flag,
    cities:  entry.cities.map((city, idx) => ({
      name:      city,
      isCapital: idx === 0,
      today:     mockWeather(city, 0),
      tomorrow:  mockWeather(city, 1),
    })),
  }));
}
