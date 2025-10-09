// 🌍 Miami coordinates for RP realism
const latitude = 25.7617;
const longitude = -80.1918;

// 🕰️ SL Time (Pacific Time / GMT-8)
const slTime = new Date().toLocaleString("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "2-digit",
  hour12: false
});
const hourSL = parseInt(slTime);
const timeOfDay = (hourSL >= 6 && hourSL < 18) ? "day" : "night";

// 🔧 Default unit based on RP zone
let unit = "fahrenheit";

// 🧠 Optional override from settings or URL
const userUnit = new URLSearchParams(window.location.search).get("unit");
if (userUnit === "celsius") unit = "celsius";

// 🎨 Apply theme and unit class
document.body.classList.add("sorority");
document.body.classList.add(unit);

// ⏰ Weather updates every 6 hours SLT
const updateHours = [0, 6, 12, 18];

if (updateHours.includes(hourSL)) {
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      const weather = data.current_weather;
      const temperature = weather.temperature;
      const code = weather.weathercode;

      // 🔁 Map Open-Meteo codes to RP conditions
      const conditionMap = {
        0: "Clear", 1: "Cloudy", 2: "Cloudy", 3: "Cloudy",
        45: "Fog", 48: "Fog",
        51: "Rain", 53: "Rain", 55: "Rain", 61: "Rain", 63: "Rain", 65: "Rain",
        71: "Snow", 73: "Snow", 75: "Snow",
        80: "Showers", 81: "Showers", 82: "Showers",
        95: "Storm", 96: "Storm", 99: "Tornado"
      };

      const condition = conditionMap[code] || "Clear";

      // 🌡️ Convert temperature if needed
      let displayTemp = temperature;
      let unitIcon = "fahrenheit.png";

      if (unit === "celsius") {
        displayTemp = (temperature - 32) * 5 / 9;
        unitIcon = "celcius.png";
      }

      // 🖼️ Update UI
      document.getElementById("condition").textContent = condition;
      document.getElementById("temperature").textContent = Math.round(displayTemp) + "°";
      document.getElementById("meteo-icon").src = `assets/img/${timeOfDay}${condition.toLowerCase()}.png`;
      document.getElementById("unit-icon").src = `assets/img/${unitIcon}`;
      document.getElementById("sl-clock").textContent = `SLT: ${hourSL}h`;
    })
    .catch(error => {
      console.error("Weather error:", error);
      document.getElementById("condition").textContent = "Unavailable";
      document.getElementById("temperature").textContent = "--°";
      document.getElementById("meteo-icon").src = `assets/img/${timeOfDay}clear.png`;
      document.getElementById("unit-icon").src = `assets/img/fahrenheit.png`;
      document.getElementById("sl-clock").textContent = `SLT: --h`;
    });
} else {
  document.getElementById("sl-clock").textContent = `SLT: ${hourSL}h`;
}
