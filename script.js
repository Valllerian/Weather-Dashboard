var apiKey = "&appid=86f2ecb5f73a9028974233aa68af9360";

var starterUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
var finalUrl;

var userCity = $('#search-input');
var searchButton = $('#search-button');
var searchedCity = '';
var pastSearches = $('#pastSearches');

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
            localStorage.setItem("city", searchedCity);
             var lastCity = document.createElement("button");
            lastCity.innerText = searchedCity;
            lastCity.classList.add("btn");
            pastSearches.append(lastCity);
            
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
        forecast(e);
    })}};
  

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

var dayOne =  moment().add(1, 'days').format('ll');
var dayTwo =  moment().add(2, 'days').format('ll');
var dayThree =  moment().add(3, 'days').format('ll');
var dayFour =  moment().add(4, 'days').format('ll');
var dayFive =  moment().add(5, 'days').format('ll');

$('#dayOne').text(dayTwo);
$('#dateTwo').text(dayTwo);
$('#dayThree').text(dayThree);
$('#dayFour').text(dayFour);
$('#dayFive').text(dayFive);


// console.log(dayFive);

// 
function forecast(e)  {
    futureUrl = forecastUrl + searchedCity + apiKey + unitMeasurement;
       fetch(futureUrl)
       .then(function (response) {
       return response.json();
       })   
       .then(function (data) {
        console.log(futureUrl)
    $(".forecast").each(function (i) {
      var temp = data.list[i].main.temp;
      var imgLink =
        "https://openweathermap.org/img/w/" +
        data.list[i].weather[0].icon +
        ".png";
      var wind = data.list[i].wind.speed;
      var humid = data.list[i].main.humidity;
      this.querySelector(".icon").setAttribute("src", imgLink);
      this.querySelector(".temp").textContent = "Temp: " + temp + "F";
      this.querySelector(".wind").textContent = "Wind " + wind + "MPH";
      this.querySelector(".humid").textContent = "Humidity: " + humid + "%";
    });
  })};

$('#search-button').click (submitSearch);
