// 📍 Coordonnées RP de Winter's Gate
const latitude = 45.3;
const longitude = 1.3;

// 🔗 API météo
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

// 🖼️ Icônes météo selon code Open-Meteo
const iconMap = {
  0: "clear.png",      // Clear
  1: "clear.png",      // Mainly Clear
  2: "pcloudy.png",    // Partly Cloudy
  3: "cloudy.png",     // Overcast
  45: "fog.png",       // Fog
  48: "fog.png",       // Rime Fog
  51: "fog.png",   // Light Drizzle
  53: "fog.png",   // Moderate Drizzle
  55: "fog.png",   // Dense Drizzle
  56: "freezefog.png",   // Freezing Drizzle
  57: "freezefog.png",   // Heavy Freezing Drizzle
  61: "rain.png",      // Light Rain
  63: "rain.png",      // Moderate Rain
  65: "rain.png",      // Heavy Rain
  66: "rain.png",      // Freezing Rain
  67: "rain.png",      // Heavy Freezing Rain
  71: "snow.png",      // Light Snow
  73: "snow.png",      // Moderate Snow
  75: "snow.png",      // Heavy Snow
  77: "snow.png",      // Snow Grains
  80: "rain.png",      // Rain Showers
  81: "rain.png",      // Heavy Rain Showers
  82: "rain.png",      // Violent Rain Showers
  85: "snow.png",      // Snow Showers
  86: "snow.png",      // Heavy Snow Showers
  95: "storm.png",     // Thunderstorm
  96: "storm.png",     // Thunderstorm + Hail
  99: "storm.png"      // Severe Thunderstorm
};


function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Freezing Drizzle",
    57: "Heavy Freezing Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Rain Showers",
    81: "Heavy Rain Showers",
    82: "Violent Rain Showers",
    85: "Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm + Hail",
    99: "Severe Thunderstorm"
  };
  return descriptions[code] || "Unknown";
}


// 🕒 Heure SL (GMT-8)
function getSLHour() {
	const now = new Date();
	const utcHour = now.getUTCHours();
	return (utcHour + 16) % 24; // UTC - 8
}

function isSLNightHour() {
	const hour = getSLHour();
	return hour >= 18 || hour < 6;
}

// 🔍 Récupère l’unité depuis l’URL du MOaP
function getUnitFromURL() {
	const params = new URLSearchParams(window.location.search);
	const unit = params.get("unit");
	return unit === "fahrenheit" ? "fahrenheit" : "celsius";
}

function isSLNightHourAt(offsetHours = 0) {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const slHour = (utcHour + 16 + offsetHours) % 24;
  return slHour >= 18 || slHour < 6;
}

// 🔁 Mise à jour du HUD météo
async function updateWeatherHUD() {
	try {
		const response = await fetch(API_URL);
		const data = await response.json();
		const weather = data.current_weather;
		const temperature = weather.temperature;
		const code = weather.weathercode;
		const unit = getUnitFromURL();
		const unitSymbol = unit === "fahrenheit" ? "F" : "C";
		// 🌡️ Conversion selon unité
		let tempMin, tempMax, prevMin, prevMax;
		if (unit === "fahrenheit") {
			tempMin = ((temperature - 2) * 9 / 5 + 32).toFixed(1);
			tempMax = ((temperature + 2) * 9 / 5 + 32).toFixed(1);
			prevMin = ((temperature - 3) * 9 / 5 + 32).toFixed(1);
			prevMax = ((temperature + 1) * 9 / 5 + 32).toFixed(1);
		} else {
			tempMin = (temperature - 2).toFixed(1);
			tempMax = (temperature + 2).toFixed(1);
			prevMin = (temperature - 3).toFixed(1);
			prevMax = (temperature + 1).toFixed(1);
		}
		// 🎨 Sélection icône selon heure SL
		let iconBase = iconMap[code] || "default.png";
		let iconMain = isSLNightHourAt(0) ? `night${iconBase}` : `day${iconBase}`;
		let iconPrev = isSLNightHourAt(6) ? `night${iconBase}` : `day${iconBase}`;
		// 🔄 Mise à jour DOM
		const setText = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.textContent = value;
		};
		const setImage = (id, src) => {
			const el = document.getElementById(id);
			if (el) el.src = src;
		};
		setImage("weather-icon", `assets/img/${iconMain}`);
		setText("temp-min", `${tempMin}°${unitSymbol}`);
		setText("temp-max", `${tempMax}°${unitSymbol}`);
		setText("weather-desc", getWeatherDescription(code));
		setImage("prev-icon", `assets/img/${iconPrev}`);
		setText("prev-min", `${prevMin}°${unitSymbol}`);
		setText("prev-max", `${prevMax}°${unitSymbol}`);
		console.log(`✅ Météo mise à jour (${unitSymbol}) - Heure SL : ${getSLHour()}h`);
	}
	catch (error) {
		console.error("❌ Erreur API Open-Meteo :", error);
	}
}

// 🚀 Lancement au chargement
document.addEventListener("DOMContentLoaded", updateWeatherHUD);

// ⏱️ Mise à jour toutes les 6 heures
setInterval(updateWeatherHUD, 6 * 60 * 60 * 1000);
