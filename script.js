// 📍 Coordonnées RP de Winter's Gate
const latitude = 45.3;
const longitude = 1.3;

// 🔗 API météo
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

// 🖼️ Icônes météo selon code Open-Meteo
const iconMap = {
  0: "dayclear.png",         // ciel clair
  1: "daycloudycloudy.png",  // partiellement nuageux
  45: "fog.png",             // brouillard
  48: "fog.png",             // brouillard givrant
  61: "rain.png",            // pluie légère
  71: "snow.png",            // neige légère
  93: "nightclear.png",      // mode nuit ?
  94: "nightcloudy.png",     // mode nuit ?
  95: "storm.png",           // orage
  99: "tornado.png"          // tornade ?
  // ajouter plus d'icônes pour plus de variété à faire
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
