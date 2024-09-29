const cityInput = document.getElementById("search-city");
const searchBtn = document.querySelector(".search-btn");
const notFound = document.querySelector(".not-found");
const searchCity = document.querySelector(".search-cities");
const weatherInfo = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".current-country");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".temp-condition");
const humidityValueTxt = document.querySelector(".humidity-value");
const windValueTxt = document.querySelector(".wind-value");
const weatherImg = document.querySelector(".weather-img");
const currentDateTxt = document.querySelector(".current-date");
const forecastItemsContainer = document.querySelector(".forecast-container");

const apiKey = "91511ae6b98d981506f6f9ff2edaf8bc";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstrom.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  // console.log(currentDate.toLocaleDateString("en-GB",options))
  return currentDate.toLocaleDateString("en-IN", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplay(notFound);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";
  currentDateTxt.textContent = getCurrentDate();
  weatherImg.src = `imgs/weather_svg/${getWeatherIcon(id)}`;

  await updateForcastesInfo(city);
  showDisplay(weatherInfo);
}
async function updateForcastesInfo(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastItemsContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      //   console.log(forecastWeather);
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day : "2-digit",
    month : "short"
  }
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption)
  const forecastItem = `
    <div class="forecast-item">
        <h5 class="forecast-date reg-txt">${dateResult}</h5>
        <img src="imgs/weather_svg/${getWeatherIcon(id)}" alt="thunder-img" />
        <h5 class="forecast-temp">${Math.round(temp)} °C</h5>
    </div> 
    `;
    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem)
}

function showDisplay(section) {
  [weatherInfo, searchCity, notFound].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "block";
}
