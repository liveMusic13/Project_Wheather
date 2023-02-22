"use strict";

//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

const apiURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "7c41cd25804bb459e4b37ce55b19c5f7";
const apiGeocod = "http://api.openweathermap.org/geo/1.0/direct";

function pageLoaded() {
  let inputSearch = document.querySelector(".header__search-city");
  let buttonSearch = document.querySelector(".header__search-button");
  let wheatherOutput = document.querySelector(".wheather__output-block");

  let resultLon = 0;
  let resultLat = 0;

  buttonSearch.addEventListener('click', sendRequest);

  async function sendRequest() {
    if (!validateInputSearch()) return;

    let requestURLGeo = formatURLGeo();
    // вводим data, чтобы была возможность дождаться результата всего запроса, а не переходить дальше к другим функциям
    const data = await fetch(requestURLGeo)
      .then((response) => {
        return response.json();
      })
      .then((data) => {

        resultLat = data[0].lon;
        resultLon = data[0].lat;
        console.log(resultLat);
        console.log(resultLon);
        //возвращаем данные, чтобы у всего запроса было, что возвращать и присвоить в переменную
        return data;
      });
    // если data на месте, в ней есть данные, то запускаем код дальше
    if (data) {
      let requestURL = formatURL();
      fetch(requestURL)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          writeOutput(formatOutput(data));
        });
    }
  }

  function formatOutput(data) {
    let htmlString = `
    <h2 class="wheather__title">${data.name}</h2>
    <img class="wheather__image" src="" alt="image"> 
    <p class="wheather__description">${data.main.temp}</p>
    `;
    return htmlString;
  }

  function writeOutput(message) {
    wheatherOutput.innerHTML = message;
  }

  function formatURL() {
    let url = new URL(apiURL);
    url.searchParams.set("lat", resultLat);
    url.searchParams.set("lon", resultLon);
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "ru");
    return url;
  }

  function formatURLGeo() {
    let url = new URL(apiGeocod);
    url.searchParams.set("q", inputSearch.value);
    url.searchParams.set("limit", 5);
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("lang", "ru");
    return url;
  }

  function validateInputSearch() {
    return inputSearch.value !== "";
  }

}

document.addEventListener("DOMContentLoaded", pageLoaded);