
var apiKey = '827087d08d500053e7e228302b37efe2'
var forcastResultEl = document.getElementById('forcast-result');
var searchInput = document.querySelector('#weather-search').value;
var searchBtn = document.querySelector('#searchBtn');
var savedResultEl = document.getElementById('saved-cities')
var resultsDiv = document.getElementById('result-div')
var iconDiv = document.getElementById('icon-div')
var futureDivEl = document.getElementById('future')
var futureDate = document.getElementById('future-date');
var futureIcon = document.getElementById('future-icon');
var futureWeatherEl = document.getElementById('future-weather')
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
currentForcastEl.innerHTML = '';
iconDiv.innerHTML = '';
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
    currentTemp.textContent = 'Temperature: ' + data.main.temp + ' ℉';
    currentForcastEl.append(currentTemp);

    var humidity = document.createElement('li');
    humidity.textContent = 'Humidity: ' + data.main.humidity;
    currentForcastEl.append(humidity);

    var windSpeed = document.createElement('li');
    windSpeed.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';
    currentForcastEl.append(windSpeed)

    pastSearches.push(data.name);
    localStorage.setItem('pastquery',JSON.stringify(pastSearches));

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    console.log (lat);
    console.log (lon);  
    

    getUvIndex(lat,lon);
    futureWeather(lat,lon);
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
        uvIndex.textContent = 'UV Index: ' + uvIndexEl;
        currentForcastEl.appendChild(uvIndex);

        if (uvIndexEl <= 2.9) {
            uvIndex.className = 'low'
        }

        else if (uvIndexEl >= 3 || uvIndexEl <= 5.9) {
            uvIndex.className = 'moderate'
        }

        else if (uvIndexEl >= 6 || uvIndexEl <= 7.9) {
            uvIndex.className = 'high'
        }

        else {uvIndexEl.classname = 'extreme'}

    });
}

function futureWeather (lat,lon) {
var futureForcastUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=&appid='+apiKey+'&units=imperial';

fetch(futureForcastUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);

    if (!data.daily.length) {
        console.log('not working')

    }

    
    for (var i = 0; i < data.daily.length; i++) {
            console.log('results!!')
            printFutureForcast(data.daily[i])
    }
    

    function printFutureForcast(dataObj) {
        console.log(dataObj);
        
        var futureWeatherImg = dataObj.weather[0].icon;
        var iconUrl = 'http://openweathermap.org/img/wn/' + futureWeatherImg + '.png'

        var futureImg = document.createElement('img');
        futureImg.src = iconUrl
        futureWeatherEl.append(futureImg);


        if (dataObj.weather[0].icon) {

        }

        if (dataObj.temp.day) {
            var futureTemp = document.createElement('li');
            futureTemp.textContent = 'Temp: ' + dataObj.temp.day + ' ℉';
            futureWeatherEl.append(futureTemp) 
        }

        if (dataObj.humidity) {
            var futureHumidity = document.createElement('li');
            futureHumidity.textContent = 'Humidity: ' + dataObj.humidity;
            futureWeatherEl.append(futureHumidity) 
        }
        
    }

        // var day1Date = data.list[1].dt_txt;
        // var day2Date = data.list[9].dt_txt;
        // var day3Date = data.list[17].dt_txt;
        // var day4Date = data.list[25].dt_txt;
        // var day5Date = data.list[33].dt_txt;

        // var day1DateTemp = data.list[1].main.temp;
        // var day2DateTemp = data.list[9].main.temp;
        // var day3DateTemp = data.list[17].main.temp;
        // var day4DateTemp = data.list[25].main.temp;
        // var day5DateTemp = data.list[33].main.temp;


        // var day1DateHumidity = data.list[1].main.humidity;
        // var day2DateHumidity = data.list[9].main.humidity;
        // var day3DateHumidity = data.list[17].main.humidity;
        // var day4DateHumidity = data.list[25].main.humidity;
        // var day5DateHumidity = data.list[33].main.humidity;


        // console.log(day1Date)
        // console.log(day2Date)
        // console.log(day3Date)
        // console.log(day4Date)
        // console.log(day5Date)

        // console.log(day1DateTemp)
        // console.log(day2DateTemp)
        // console.log(day3DateTemp)
        // console.log(day4DateTemp)
        // console.log(day5DateTemp)

        // console.log(day1DateHumidity) 
        // console.log(day2DateHumidity) 
        // console.log(day3DateHumidity) 
        // console.log(day4DateHumidity) 
        // console.log(day5DateHumidity) 


    });

}

