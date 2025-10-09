// 🌍 Coordonnées de Miami pour météo réaliste
const latitude = 25.7617;
const longitude = -80.1918;

// 🕰️ Heure SL (Pacific Time / GMT-8)
const slTime = new Date().toLocaleString("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "2-digit",
  hour12: false
});
const hourSL = parseInt(slTime);
const timeOfDay = (hourSL >= 6 && hourSL < 18) ? "day" : "night";

// ⏰ Mise à jour toutes les 6h SLT
const updateHours = [0, 6, 12, 18];

// 🎨 Appliquer le thème sororité
document.body.classList.add("sorority");

if (updateHours.includes(hourSL)) {
  // 🔗 Appel API Open-Meteo
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      const weather = data.current_weather;
      const temperature = weather.temperature;
      const code = weather.weathercode;

      // 🔁 Mapping Open-Meteo vers conditions RP
      const conditionMap = {
        0: "Clear",
        1: "Cloudy",
        2: "Cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Fog",
        51: "Rain",
        53: "Rain",
        55: "Rain",
        61: "Rain",
        63: "Rain",
        65: "Rain",
        71: "Snow",
        73: "Snow",
        75: "Snow",
        80: "Showers",
        81: "Showers",
        82: "Showers",
        95: "Storm",
        96: "Storm",
        99: "Tornado"
      };

      const condition = conditionMap[code] || "Clear";

      // 🖼️ Mise à jour des éléments HTML
      document.getElementById("condition").textContent = condition;
      document.getElementById("temperature").textContent = temperature + "°";
      document.getElementById("meteo-icon").src = `assets/img/${timeOfDay}${condition.toLowerCase()}.png`;
      document.getElementById("unit-icon").src = `assets/img/celcius.png`;
      document.getElementById("sl-clock").textContent = `SLT : ${hourSL}h`;
    })
    .catch(error => {
      console.error("Erreur météo :", error);
      document.getElementById("condition").textContent = "Indisponible";
      document.getElementById("temperature").textContent = "--°";
      document.getElementById("meteo-icon").src = `assets/img/${timeOfDay}clear.png`;
      document.getElementById("unit-icon").src = `assets/img/celcius.png`;
      document.getElementById("sl-clock").textContent = `SLT : --h`;
    });
} else {
  // ⏳ Affichage sans mise à jour
  document.getElementById("sl-clock").textContent = `SLT : ${hourSL}h`;
}
