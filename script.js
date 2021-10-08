// storing API key
var apiKey = "&appid=86f2ecb5f73a9028974233aa68af9360";

// vars to fetch weather later on
var starterUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var finalUrl;

var userCity = $('#search-input');
var searchButton = $('#search-button');
var searchedCity = '';
var pastSearches = $('#pastSearches');
var City;

var unitMeasurement = "&units=imperial";
var lat;
var lon;

// Setting up a curent date (format ll // Oct 5, 2021):
var currentDate = moment().format('ll');
// Setting up date for forecast cards
var dayOne =  moment().add(1, 'days').format('ll');
var dayTwo =  moment().add(2, 'days').format('ll');
var dayThree =  moment().add(3, 'days').format('ll');
var dayFour =  moment().add(4, 'days').format('ll');
var dayFive =  moment().add(5, 'days').format('ll');

// dispplaying data lines
$('#dayOne').text(dayTwo);
$('#dateTwo').text(dayTwo);
$('#dayThree').text(dayThree);
$('#dayFour').text(dayFour);
$('#dayFive').text(dayFive);

function submitSearch(e){
    searchedCity = userCity.val(); 
    var searchedCities = JSON.parse(localStorage.getItem("savedCities") || "[]");
    searchedCities.push(searchedCity);

    // storing user input in Local storage
    localStorage.setItem("savedCities", JSON.stringify(searchedCities));
    // creating buttons with user search input
    var lastCity = document.createElement("button");
    lastCity.innerText = searchedCity;
    lastCity.classList.add("btn");
    lastCity.classList.add("btnPast");
    // appending buttons to the list
    pastSearches.append(lastCity);
    lastCity.addEventListener("click", getWeather(lastCity)); 

    // console.log(searchedCity);
    getWeather(e);

}

function getWeather(e) {
    // If user doesnt input anything:
    if (searchedCity === ""){
      $('#location').text("Please, select a city");
      $('#cityDate').text("");
      $('#temp').text("");
      $('#wind').text("");
      $('#humidity').text("");
      $('#uvIndex').text("");
    }
        else {
        // fetching data from Weather API with user input
       finalUrl = starterUrl + searchedCity + apiKey + unitMeasurement;
       fetch(finalUrl)
       .then(function (response) {
       return response.json();
       })   
       .then(function (data) {
        lat = data.coord.lat;
        lon = data.coord.lon;
        console.log(data)

        // Updating and displaying current weather conditions 
        $('#userInput').children('input').val('')
        $('#conditions').attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        $('#location').text(searchedCity);
        $('#cityDate').text(currentDate);
        $('#temp').text(data.main.temp + '°F');
        $('#wind').text(data.wind.speed + " MPH");
        $('#humidity').text(data.main.humidity + "%")
        $('#uvIndex').text(data.main.uvi);
        getUVI(e)
        forecast(e);
    })}};
  
        // displaying UVI index and adding colors depending on its value
function  getUVI(e) {
        var uviIndexURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + apiKey;
        fetch(uviIndexURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        $('#uvIndex').text(data[0].value);
        if (data[0].value < 3.0) {
            $("#uvIndex").css("background-color", "green");
          } else if (data[0].value >= 3.0 && data[0].value <= 5.0) {
            $("#uvIndex").css("background-color", "yellow");
          } else if (data[0].value > 5.0 && data[0].value <= 7.0) {
            $("#uvIndex").css("background-color", "orange");
          } else if (data[0].value > 7.0 && data[0].value <= 10.0) {
            $("#uvIndex").css("background-color", "red");
          } else {
            $("#uvIndex").css("background-color", "violet");
          }
})};

// console.log(dayFive);

// fetching and displaying data for forecast cards
function forecast(e)  {
    futureUrl = forecastUrl + searchedCity + apiKey + unitMeasurement;
       fetch(futureUrl)
       .then(function (response) {
       return response.json();
       })   
       .then(function (data) {
        // console.log(futureUrl)
    $(".forecast").each(function (i) {
      var temp = data.list[i].main.temp;
      var imgLink = "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
      var wind = data.list[i].wind.speed;
      var humid = data.list[i].main.humidity;
      this.querySelector(".icon").setAttribute("src", imgLink);
      this.querySelector(".temp").textContent = "Temp: " + temp + "F";
      this.querySelector(".wind").textContent = "Wind " + wind + "MPH";
      this.querySelector(".humid").textContent = "Humidity: " + humid + "%";
    });
  })};

  // displaying searhes on page reload
$(document).ready ( function(){
    var searchedCities = JSON.parse(localStorage.getItem("savedCities") || "[]");
    // console.log(searchedCities);
    for (let i = 0; i < searchedCities.length; i++) {
        $('#pastSearches').append('<button class ="btn btnPast" data-city = "'+ searchedCities[i]+'">'+ searchedCities[i] + '</button>');
    }
 })

// $('.btnPast').on(click , '.btnPast')

// on click event for generated buttons
$(document).on('click','.btnPast',function(e){
    searchedCity = $(this).data('city');
    console.log(searchedCity);
    getWeather(e);
})

// main on click event for weather search
$('#search-button').click (submitSearch);
