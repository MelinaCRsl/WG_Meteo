// 📍 Coordonnées RP de Winter's Gate
const latitude = 45.3;
const longitude = 1.3;

// 🔗 API météo
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

// 🖼️ Icônes météo selon code Open-Meteo
const iconMap = {
	0: "clear.png",
	1: "pcloudy.png",
	2: "cloudy.png",
	45: "fog.png",
	48: "freezefog.png",
	61: "rain.png",
	71: "snow.png",
	97: "storm.png",
	99: "tornado.png"
};

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear",
    1: "Partly Cloudy",
    2: "Cloudy",
    45: "Fog",
    48: "Freezing Fog",
    61: "Light Rain",
    71: "Light Snow",
    97: "Thunderstorm",
    99: "Tornado"
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
		setImage("prev-icon", `assets/img/${iconPrev}`);
		setText("temp-min", `${tempMin}°${unitSymbol}`);
		setText("temp-max", `${tempMax}°${unitSymbol}`);
		setText("weather-desc", getWeatherDescription(code));
		setImage("prev-icon", `assets/img/${icon}`);
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
