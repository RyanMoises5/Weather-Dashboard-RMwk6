var locationEl = $('#location');
var submitBtn = $("#search-button");

var formSubmission = function (event) {
    event.preventDefault();

    var locationInput = locationEl.val().trim();

    if (locationInput) {
        // getData(locationInput);
    } else {
        alert('Please enter a location');
    }
};

var getData = function (locationInput) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + locationInput + '&appid=b70a8edb3a23f7455b534efc0f71881d';

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then( function (data) {
                    console.log(data);
                    // function here //
                });
            } else {
                alert ('Error: ' + response.statusText);
            }
        });
};

submitBtn.on("click", formSubmission);