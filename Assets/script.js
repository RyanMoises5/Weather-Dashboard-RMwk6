var locationEl = $('#location');
var submitBtn = $("#search-button");
var clearBtn = $('#clear-button');
var todayStats = $("#today");
var forecast = $("#5day-forecast");
var prevSearch = $('#prev-search');

var items = [];             // Array to fill for saving to local storage

function init() {           // Retrieves previous search items and uses it to add a history belong the search bar
    var saveData = JSON.parse(localStorage.getItem("itemList"));

    if (saveData !== null) {
        items = saveData;
    }

    renderLocations();
}

init();             

function renderLocations () {           // Takes previous search items and creates a button for each previous search
    for (let index = 0; index < items.length; index++) {;
        var itemName = items[index];

        var searchElement = $('<button>');
        searchElement.text(itemName);
        searchElement.addClass("m-2 prev-search");
        prevSearch.append(searchElement);
    }
}

var formSubmission = function (event) {     // Activates the function to fetch API and also the function to save the search term when the form is submitted
    event.preventDefault();

    var locationInput = locationEl.val().trim();

    if (locationInput) {
        getData(locationInput);
        saveLocation(locationInput);
    } else {
        alert('Please enter a location');
    }
};

var saveLocation = function (locationInput) {       // Updates the local storage for every new search location and updates the previous history
    items.push(locationInput);
    
    localStorage.setItem("itemList", JSON.stringify(items));
    
    prevSearch.empty();
    renderLocations();
}

var getData = function (locationInput) {        // Takes the API URL and adds the search term and the API key to the URL so a fetch request can be made
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + locationInput + '&appid=b70a8edb3a23f7455b534efc0f71881d&units=imperial';

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {          // If fetch request is successful, the data in the form of a JSON will be used to display the current day's weather condition and the 5 day forecast
                console.log(response);
                response.json().then( function (data) {
                    console.log(data);
                    
                    displayTodayData(data, locationInput);      // Function to gather information of current day and append current day elements
                    displayForecast(data);                      // Function to gather information for 5-day forecast and append 5-day forecast elements
                });
            } else {
                alert ('Error: City Information ' + response.statusText);       // If fetch request fails, an alert will appear showing failure
            }
        })
};

var displayTodayData = function (data, locationInput) {     // Function to gather information of current day and append current day elements

    todayStats.empty();     // Empties div before appending

    var headerToday = $('<h1>');
    headerToday.text(locationInput + " (" + dayjs.unix(data.list[0].dt).format("M/D/YYYY") + ")");      // Takes the UNIX date-time and changes the format using dayjs
    todayStats.append(headerToday);
    
    var latLon = $('<p>');
    latLon.text("Lat: " + data.city.coord.lat + ", Lon:" + data.city.coord.lon);
    todayStats.append(latLon);
    
    var iconToday = $('<img>');
    iconToday.attr('src', "https://openweathermap.org/img/wn/" + (data.list[0].weather[0].icon) + "@2x.png");
    todayStats.append(iconToday);

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

var displayForecast = function (data) {         // Function to gather information for 5-day forecast and append 5-day forecast elements
                                                // Uses a for loop to perform 5 days with times seperated by 24 hrs
    forecast.empty();       // Empties div before appending

    for (let index = 7; index < 40; index = index +8) {
        
        var forecastCard = $('<div>');

        var iconForecast = $('<img>');
        iconForecast.attr('src', "https://openweathermap.org/img/wn/" + (data.list[index].weather[0].icon) + ".png");

        var headerForecast = $('<h4>');
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
        forecastCard.addClass("fs-6 bg-secondary p-1 m-1");

        forecast.append(forecastCard);
    }
}

submitBtn.on("click", formSubmission);      // Event listener that enables the functions when the form is submitted

clearBtn.on("click", function() {           // Event listener that clears the previous history and updates the div where previous searches are contained

    items = [];
    localStorage.setItem("itemList", JSON.stringify(items));

});

prevSearch.on("click", '.prev-search', function (event) {       // Event listener that takes the text of the buttons of the previous history and performs a search using that text
    
    var locationInput = $(event.target).text();

    getData(locationInput);
})