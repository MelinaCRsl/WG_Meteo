// 📍 Coordonnées RP de Winter's Gate
const latitude = 45.3;
const longitude = 1.3;

// 🔗 API météo
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

// 🖼️ Icônes météo selon code Open-Meteo
const iconMap = {
	0: "dayclear.png",
	1: "daypcloudy.png",
	2: "dayloudy.png",
	45: "dayfog.png",
	48: "dayfreezefog.png",
	61: "dayrain.png",
	71: "daysnow.png",
	97: "daystorm.png",
	90: "nightclear.png",
	91: "nightpcloudy.png",
	92: "nightloudy.png",
	93: "nightfog.png",
	94: "nightfreezefog.png",
	95: "nightrain.png",
	96: "nightsnow.png",
	98: "nightstorm.png",
	99: "tornado.png"
};

// 🔍 Récupère l’unité depuis l’URL du MOaP
function getUnitFromURL() {
	const params = new URLSearchParams(window.location.search);
	const unit = params.get("unit");
	return unit === "fahrenheit" ? "fahrenheit" : "celsius"; // fallback
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

		const unitSymbol = unit === "fahrenheit" ? "F" : "C";
		const icon = iconMap[code] || "default.png";

		// 🔄 Mise à jour DOM
		const setText = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.textContent = value;
		};

		const setImage = (id, src) => {
			const el = document.getElementById(id);
			if (el) el.src = src;
		};

		setImage("weather-icon", `assets/img/${icon}`);
		setText("temp-min", `${tempMin}°${unitSymbol}`);
		setText("temp-max", `${tempMax}°${unitSymbol}`);
		setImage("prev-icon", `assets/img/${icon}`);
		setText("prev-min", `${prevMin}°${unitSymbol}`);
		setText("prev-max", `${prevMax}°${unitSymbol}`);

		console.log(`✅ Météo mise à jour (${unitSymbol}) depuis Open-Meteo`);
	} catch (error) {
		console.error("❌ Erreur API Open-Meteo :", error);
	}
}

// 🚀 Lancement au chargement
document.addEventListener("DOMContentLoaded", updateWeatherHUD);

// ⏱️ Mise à jour toutes les 15 minutes
setInterval(updateWeatherHUD, 15 * 60 * 1000);
