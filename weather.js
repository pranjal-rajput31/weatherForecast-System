//http://api.weatherapi.com/v1/forecast.json?key=de45430ea762468dbe670505252407&q=pune&days=5&aqi=yes&alerts=yes

//fetchdata function to get weather data from the API
// This function fetches weather data for a given city and updates the HTML elements with the received data.
// It also handles errors and displays them to the user.
async function fetchdata(city) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=de45430ea762468dbe670505252407&q=${city}&days=5&aqi=yes&alerts=yes`
    );
// Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if required fields exist before accessing them
    if (!data.location || !data.current || !data.current.condition) {
      throw new Error("Invalid data format received from API");
    }
// Update the HTML elements with the fetched data
    document.getElementById("cityName").textContent = data.location.name;
    document.getElementById(
      "temperature"
    ).textContent = `${data.current.temp_c}°C`;
    document.getElementById("condition").textContent =
      data.current.condition.text;
    document.getElementById(
      "humidity"
    ).textContent = `Humidity: ${data.current.humidity}%`;
    document.getElementById(
      "wind"
    ).textContent = `Wind: ${data.current.wind_kph} kph`;
    document.getElementById(
      "feelsLike"
    ).textContent = `Feels Like: ${data.current.feelslike_c}°C`;
    document.getElementById("weatherIcon").src =
      data.current.condition.icon.replace("64x64", "128x128"); // Use a larger icon size
    document.getElementById(
      "pressure"
    ).textContent = `Pressure: ${data.current.pressure_mb} mb`;

    // Populate forecast for the next 5 days
    for (let i = 0; i < 5; i++) {
      const day = data.forecast.forecastday[i];
      const dayElement = document.getElementById(`day${i + 1}`);
      if (dayElement) {
        dayElement.querySelector(
          "p"
        ).textContent = `${day.date} - ${day.day.condition.text}`;
        dayElement.querySelector("img").src = day.day.condition.icon.replace(
          "64x64",
          "128x128"
        ); // Use a larger icon size
        dayElement.querySelector(
          ".temp"
        ).textContent = `${day.day.avgtemp_c}°C`;
      }
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert(`Failed to fetch weather data. Reason: ${error.message}`);
  }
}

function dis() {
  const city = document.getElementById("cityInput").value;
  if (/^[a-zA-Z\s]+$/.test(city)) {
    // alert(`Weather for ${city} is being fetched...`);
    let history = JSON.parse(localStorage.getItem("cityHistory") || "[]");
    if (city && !history.includes(city)) {
      history.push(city);
      localStorage.setItem("cityHistory", JSON.stringify(history)); // Save to local storage
    }
    fetchdata(city);
    // Here you would typically call a weather API to get the data
    return false; // Prevent form submission for demonstration
  } else {
    alert("Please enter a city name.");
    return false; // Prevent form submission
  }
}

function input() {
  const menu = document.getElementById("historyMenu");
  menu.innerHTML = "My History"; //
  let history = JSON.parse(localStorage.getItem("cityHistory") || "[]");
  if (history.length > 0) {
    history.forEach((city) => {
      const item = document.createElement("div");
      item.textContent = city;
      item.className = "p-2 hover:bg-gray-100 cursor-pointer";
      item.onclick = function () {
        document.getElementById("cityInput").value = city;
        fetchdata(city);
        menu.classList.add("hidden");
      };
      menu.appendChild(item);
    });
  }
  menu.classList.remove("hidden");
}
document.addEventListener("click", function (e) {
  const input = document.getElementById("cityInput");
  const menu = document.getElementById("historyMenu");
  if (!input.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});


