var apiKey = "&appid=86f2ecb5f73a9028974233aa68af9360";

var starterUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var finalUrl;

var userCity = $('#search-input');
var searchButton = $('#search-button');
var searchedCity;

var unitMeasurement = "&units=imperial";

// Setting up a curent date (format ll // Oct 5, 2021):
var currentDate = moment().format('ll');


function submitSearch(e){
    searchedCity = userCity.val(); 
    // console.log(searchedCity);
    getWeather(e);
}

function getWeather(e) {
    //    e.preventDefault();
       finalUrl = starterUrl + searchedCity + apiKey + unitMeasurement;
       fetch(finalUrl)
       .then(function (response) {
       return response.json();
       })   
       .then(function (data) {
       
        if (searchedCity === ""){
            $('#location').text("Please, select a city");
            $('#cityDate').text("");
            $('#temp').text("");
            $('#wind').text("");
            $('#humidity').text("");
        }
        else {
        $('#userInput').children('input').val('')
        $('#location').text(searchedCity);
        $('#cityDate').text(currentDate);
        $('#temp').text(data.main.temp + '°F');
        $('#wind').text(data.wind.speed + " MPH");
        $('#humidity').text(data.main.humidity + "%")}
   
    
})};

$('#search-button').click (submitSearch);
