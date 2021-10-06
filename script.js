var apiKey = "&appid=86f2ecb5f73a9028974233aa68af9360";

var starterUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var finalUrl;

var userCity = $('#search-input');
var searchButton = $('#search-button');
var searchedCity;

var unitMeasurement = "&units=imperial";
var lat;
var lon;

// Setting up a curent date (format ll // Oct 5, 2021):
var currentDate = moment().format('ll');

function submitSearch(e){
    searchedCity = userCity.val(); 
    // console.log(searchedCity);
    getWeather(e);
}

function getWeather(e) {

    if (searchedCity === ""){
      $('#location').text("Please, select a city");
      $('#cityDate').text("");
      $('#temp').text("");
      $('#wind').text("");
      $('#humidity').text("");
      $('#uvIndex').text("");
    }
        else {
       finalUrl = starterUrl + searchedCity + apiKey + unitMeasurement;
       fetch(finalUrl)
       .then(function (response) {
       return response.json();
       })   
       .then(function (data) {
        lat = data.coord.lat;
        lon = data.coord.lon;
        $('#userInput').children('input').val('')
        $('#location').text(searchedCity);
        $('#cityDate').text(currentDate);
        $('#temp').text(data.main.temp + '°F');
        $('#wind').text(data.wind.speed + " MPH");
        $('#humidity').text(data.main.humidity + "%")
        $('#uvIndex').text(data.main.uvi);
        getUVI(e)
        forecast(data);}
        
    )}};
  

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


var forecast = function (arr) {
    $("#forecast").each(function (i) {
      var temp = arr.daily[i].temp.day;
      var imgLink =
        "https://openweathermap.org/img/w/" +
        arr.daily[i].weather[0].icon +
        ".png";
      var wind = arr.daily[i].wind_speed;
      var humid = arr.daily[i].humidity;
      this.querySelector(".icon").setAttribute("src", imgLink);
      this.querySelector(".temp").textContent = "Temp:" + temp + "F";
      this.querySelector(".wind").textContent = "Wind" + wind + "MPH";
      this.querySelector(".humid").textContent = "Humidity:" + humid + "%";
    });
  };


$('#search-button').click (submitSearch);
