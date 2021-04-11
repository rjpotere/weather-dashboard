
var apiKey = '827087d08d500053e7e228302b37efe2'
var forcastResultEl = document.getElementById('forcast-result');
var searchInput = document.querySelector('#weather-search').value;
var searchBtn = document.querySelector('#searchBtn');
var savedResultEl = document.getElementById('saved-cities')
var resultsDiv = document.getElementById('result-div')
var iconDiv = document.getElementById('icon-div')

var futureCard = document.getElementById('future-card')
var futureIcon = document.getElementById('future-icon');
var futureWeatherTemp = document.getElementById('future-temp')
var futureWeatherHumd = document.getElementById('future-humd')
var futureWeatherDate = document.getElementById('future-humd')


var currentForcastEl = document.getElementById('current-forcast');

var displaySearches = localStorage.getItem('pastquery');
var displaySearchesArray = JSON.parse(displaySearches)||[];

function savedSearches() {
savedResultEl.innerHTML = '';
for (var i = 0; i < displaySearchesArray.length; i++) {
    var savedCities = document.createElement('p');
    savedCities.classList.add("savedlist")
    savedCities.textContent = displaySearchesArray[i]
    savedResultEl.append(savedCities);

    if (displaySearchesArray.length == 15){
        displaySearchesArray = [];
    }

    savedCities.addEventListener('click',function(){
        getWeather(this.textContent);
    })
    
}}




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

    displaySearchesArray.push(data.name);
    localStorage.setItem('pastquery',JSON.stringify(displaySearchesArray));

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    console.log (lat);
    console.log (lon);  
    futureCard.innerHTML = '';

    getUvIndex(lat,lon);
    futureWeather(lat,lon);
    savedSearches();
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

    
    for (var i = 0; i < 5; i++) {
            console.log('results!!')
            var currentDay = moment().add(i+1,'days').format('M/D/YYYY') //can write as d

            printFutureForcast(data.daily[i],currentDay)
    }
    

    function printFutureForcast(dataObj,currentDay) {
        console.log(dataObj);


        var futureFiveCard = document.createElement('div')
        futureFiveCard.classList.add('futureFiveCard')

        var futureFive = document.createElement('h4');
        futureFive.textContent = currentDay;
        futureFiveCard.append(futureFive);
        
        var futureWeatherImg = dataObj.weather[0].icon;
        var iconUrl = 'http://openweathermap.org/img/wn/' + futureWeatherImg + '.png'


        if (dataObj.weather[0].icon) {
            var futureImg = document.createElement('img');
            futureImg.src = iconUrl
            futureFiveCard.append(futureImg);
        }

        if (dataObj.temp.day) {
            var futureTemp = document.createElement('p');
            futureTemp.textContent = 'Temp: ' + dataObj.temp.day + ' ℉';
            futureFiveCard.append(futureTemp) 
        }

        if (dataObj.humidity) {
            var futureHumidity = document.createElement('p');
            futureHumidity.textContent = 'Humidity: ' + dataObj.humidity;
            futureFiveCard.append(futureHumidity) 
        }
        
        futureCard.append(futureFiveCard);
        
    }   

    

    });

}

savedSearches();

