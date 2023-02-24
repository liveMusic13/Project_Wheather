"use strict";

//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

const apiURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "7c41cd25804bb459e4b37ce55b19c5f7";


function pageLoaded() {
  let inputSearch = document.querySelector(".header__search-city");
  let buttonSearch = document.querySelector(".header__search-button");
  let wheatherOutput = document.querySelector(".wheather__output-block");

  buttonSearch.addEventListener('click', sendRequest);

  function sendRequest() {
    if (!validateInputSearch()) return;

    let requestURL = formatURL();
    fetch(requestURL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        writeOutput(formatOutput(data));
      })
  }

  function formatOutput(data) {
    let htmlString = `
    <h2 class="wheather__title">${data.name}</h2>
    <div class="wheather__block-content">
      <p class="wheather__pressure">Давление: ${fixUndefined(data.main.pressure, " мм рт. ст.")}</p>
      <div class="wheather__block-temperature">
        <p class="wheather__temperature">Температура: ${fixUndefined(data.main.temp, " C")}</p>
        <img class="wheather__image" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="image">
        <p class="wheather__description">${data.weather[0].description}</p>
        <p class="wheather__humidity">Влажность: ${fixUndefined(data.main.humidity, " %")}</p>
        <p class="wheather__temperature wheather__temperature_feels-like">Ощущаеться как: ${fixUndefined(data.main.feels_like, " C")}</p>
      </div>
      <div class="wheather__block-wind">
        <p class="wheather__wind-speed">Скорость ветра: ${fixUndefined(data.wind.speed, " м/с")}</p>
        <p class="wheather__wind-gust">Порывы ветра: ${fixUndefined(data.wind.gust, " м/с")}</p>
        <p class="wheather__wind-deg">Направление ветра: ${directionOfTheWind(data.wind.deg)}</p>
      </div>
      </div>
    `;
    return htmlString;
  }

  function writeOutput(message) {
    wheatherOutput.style.display = "flex";
    wheatherOutput.innerHTML = message;
  }

  function formatURL() {
    let url = new URL(apiURL);
    url.searchParams.set("q", inputSearch.value);
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "ru");
    return url;
  }

  function validateInputSearch() {
    return inputSearch.value !== "";
  }

  function directionOfTheWind(cb) {
    if (cb === 360 || cb === 0) {
      return 'Северный';
    } else if (cb === 90) {
      return 'Восточный';
    } else if (cb === 180) {
      return 'Южный';
    } else if (cb === 270) {
      return 'Западный';
    } else if (cb >= 90 && cb <= 180) {
      return 'Ю-В';
    } else if (cb >= 0 && cb <= 90) {
      return 'С-В';
    } else if (cb >= 180 && cb <= 270) {
      return 'Ю-З';
    } else if (cb >= 270 && cb <= 360) {
      return 'С-З';
    }
  }

  function fixUndefined(data, unit) {
    if (data === "undefined" || !data) {
      return "Данные не доступны";
    } else {
      return data + unit;
    }
  }

}

document.addEventListener("DOMContentLoaded", pageLoaded);