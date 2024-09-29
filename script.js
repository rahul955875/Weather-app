const cityInput = document.getElementById("search-city");
const searchBtn = document.querySelector(".search-btn");
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
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  console.log(weatherData);
}
