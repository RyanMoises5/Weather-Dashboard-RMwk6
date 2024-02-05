var locationEl = $('#location');
var submitBtn = $("#search-button");
var todayStats = $("#today");
var forecast = $("#5day-forecast");

var formSubmission = function (event) {
    event.preventDefault();

    var locationInput = locationEl.val().trim();

    if (locationInput) {
        getData(locationInput);
    } else {
        alert('Please enter a location');
    }
};

var getData = function (locationInput) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + locationInput + '&appid=b70a8edb3a23f7455b534efc0f71881d&units=imperial';

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then( function (data) {
                    console.log(data);
                    
                    displayTodayData(data, locationInput);
                    displayForecast(data);
                });
            } else {
                alert ('Error: City ' + response.statusText);
            }

        })

};

var displayTodayData = function (data, locationInput) {

    todayStats.empty();

    var headerToday = $('<h1>');
    headerToday.text(locationInput + " (" + dayjs.unix(data.list[0].dt).format("M/D/YYYY") + ")");
    todayStats.append(headerToday);
    
    var tempToday = $('<p>');
    tempToday.text("Temp: " + data.list[0].main.temp + "°F");
    todayStats.append(tempToday);

    var windToday = $('<p>');
    windToday.text("Wind: " + data.list[0].wind.speed + " MPH");
    todayStats.append(windToday);

    var humidToday = $('<p>');
    humidToday.text("Humidity: " + data.list[0].main.humidity + "%");
    todayStats.append(humidToday);
}

var displayForecast = function (data) {

    forecast.empty();

    for (let index = 7; index < 40; index = index +8) {
        
        var forecastCard = $('<div>');

        var iconForecast = $('<img>');
        iconForecast.attr('src', "https://openweathermap.org/img/wn/" + (data.list[index].weather[0].icon) + "@2x.png");

        var headerForecast = $('<h3>');
        headerForecast.text(dayjs.unix(data.list[index].dt).format("M/D/YYYY"));
        
        var tempForecast = $('<p>');
        tempForecast.text("Temp: " + data.list[index].main.temp + "°F");
        
        var windForecast = $('<p>');
        windForecast.text("Wind: " + data.list[index].wind.speed + " MPH");
    
        var humidForecast = $('<p>');
        humidForecast.text("Humidity: " + data.list[index].main.humidity + "%");

        forecastCard.append(headerForecast);
        forecastCard.append(iconForecast);
        forecastCard.append(tempForecast);
        forecastCard.append(windForecast);
        forecastCard.append(humidForecast);
        forecastCard.addClass("bg-secondary p-1 m-1")

        forecast.append(forecastCard);
    }
}

submitBtn.on("click", formSubmission);