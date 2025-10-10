// 📍 Coordonnées RP de Winter's Gate
const latitude = 45.3;
const longitude = 1.3;

// 🔗 API météo
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

// 🖼️ Icônes météo selon code Open-Meteo
const iconMap = {
	//Jour
  0: "dayclear.png",         // ciel clair
  1: "daypcloudy.png",  // partiellement nuageux
  2: "dayloudy.png",  // couvert
  45: "dayfog.png",             // brouillard
  48: "dayfreezefog.png",             // brouillard givrant
  61: "dayrain.png",            // pluie légère
  71: "daysnow.png",            // neige légère
  97: "daystorm.png",            // orage
	//Nuit
  90: "nightclear.png",         // nuit clair
  91: "nightpcloudy.png",  // nuit partiellement nuageux
  92: "nightloudy.png",  // nuit couverte
  93: "nightfog.png",             // brouillard nocturne
  94: "nightfreezefog.png",             // brouillard nocturne givrant
  95: "nightrain.png",            // nuit pluie
  96: "nightsnow.png",            // nuit neige
  98: "nightstorm.png",            // orage nuit
	//Catastrophe
  99: "tornado.png"          // tornade
};

// 🔁 Mise à jour du HUD météo
async function updateWeatherHUD() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const weather = data.current_weather;
    const temperature = weather.temperature;
    const code = weather.weathercode;

    // 🌡️ Températures min/max simulées
    const tempMin = (temperature - 2).toFixed(1);
    const tempMax = (temperature + 2).toFixed(1);

    // 🖼️ Icône météo
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
    setText("temp-min", `${tempMin}°`);
    setText("temp-max", `${tempMax}°`);

    setImage("prev-icon", `assets/img/${icon}`);
    setText("prev-min", `${(temperature - 3).toFixed(1)}°`);
    setText("prev-max", `${(temperature + 1).toFixed(1)}°`);

    console.log("✅ Météo mise à jour depuis Open-Meteo");
  } catch (error) {
    console.error("❌ Erreur API Open-Meteo :", error);
  }
}

// 🚀 Lancement au chargement
document.addEventListener("DOMContentLoaded", updateWeatherHUD);

// ⏱️ Mise à jour toutes les 15 minutes
setInterval(updateWeatherHUD, 15 * 60 * 1000);
