var apiKey = '827087d08d500053e7e228302b37efe2'
var forcastResultEl = document.getElementById('forcast-result');
var searchInput = document.querySelector('#weather-search').value;
var searchBtn = document.querySelector('#searchBtn');
var savedResultEl = document.getElementById('saved-cities')
var resultsDiv = document.getElementById('result-div')
var iconDiv = document.getElementById('icon-div')

// var forcastCard = document.createElement('div');
// forcastCard.classList.add('forcast-card');
// forcastResultEl.append(forcastCard);

// var currentForcastResult = document.createElement('div');
// forcastCard.append(currentForcastResult);

var currentForcastEl = document.getElementById('current-forcast');
// currentForcastResult.appendChild(currentConditionsEl);

var pastSearches = [];

var displaySearches = localStorage.getItem('pastquery');
var displaySearchesArray = JSON.parse(displaySearches);

for (var i = 0; i < displaySearchesArray.length; i++) {
    var savedCities = document.createElement('li');
    savedCities.textContent = displaySearchesArray[i]
    savedResultEl.append(savedCities);

    savedCities.addEventListener('click',function(){
        getWeather(this.textContent);
    })
}


searchBtn.addEventListener('click', searchCriteria)
function searchCriteria() {
    var searchInput = document.querySelector('#weather-search').value;
    console.log(searchInput);
    getWeather(searchInput)
}

function getWeather(searchInput) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+searchInput+'&units=imperial&appid='+apiKey;
    console.log(apiUrl);

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log(data.name)

        var currentDate = moment();

        var weatherIcon = data.weather[0].icon;
        var iconUrl = 'http://openweathermap.org/img/wn/' + weatherIcon + '.png'

        var iconImg = document.createElement('img');
        iconImg.src = iconUrl
        iconDiv.append(iconImg);

    var cityNameEl = document.getElementById('forcast-city');
    var displayDate = document.getElementById('date');
    displaySearchesArray.textContent = currentDate;
    cityNameEl.textContent = data.name + " " + currentDate.format("(M/D/YYYY)");

    var currentTemp = document.createElement('li');
    currentTemp.textContent = 'Temperature: ' + data.main.temp;
    currentForcastEl.append(currentTemp);

    var humidity = document.createElement('li');
    humidity.textContent = 'Humidity: ' + data.main.humidity;
    currentForcastEl.append(humidity);

    var windSpeed = document.createElement('li');
    windSpeed.textContent = 'Wind Speed: ' + data.wind.speed;
    currentForcastEl.append(windSpeed)


    pastSearches.push(data.name);
    localStorage.setItem('pastquery',JSON.stringify(pastSearches));

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    console.log (lat);
    console.log (lon);    

    getUvIndex(lat,lon);
});
}


function getUvIndex(lat,lon) {

    var uvApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=&appid='+apiKey;
    console.log(uvApiUrl);

    fetch(uvApiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log(data.current.uvi);

        var uvIndexEl = data.current.uvi;

        var uvIndex = document.createElement('li');
        uvIndex.classList.add('uvi')
        uvIndex.textContent = 'UV Index: ' + uvIndexEl;
        currentForcastEl.appendChild(uvIndex);

        if (uvIndexEl <= 2) {
            uvIndex.className = 'low'
        }

    });
}






