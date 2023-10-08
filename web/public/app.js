const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:3000';

// Append a Header to every webpage
$('.header').append(`
    <h1>IoT Scalability </h1>
`);

// Append a Footer to every webpage
$('.footer').append("Copyright: @ SIT314 2023");

function postThis(url, body, returnPage, successCallback, errorCallback) {
    $.ajax({
        url: `${API_URL}/${url}`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (response) {
            localStorage.setItem('log', JSON.stringify(response));
            if (successCallback) {
                successCallback(response);
            } else {
                location.href = `${returnPage}`;
            }
        },
        error: function (response) {
            localStorage.setItem('log', JSON.stringify(response));
            if (errorCallback) {
                errorCallback(response);
            } else {
                location.href = `${returnPage}`;
            }
        }
    });
}

function deleteThis(url, body, returnPage, successCallback, errorCallback) {
    $.ajax({
        url: `${API_URL}/${url}`,
        type: 'DELETE',
        data: JSON.stringify(body),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (response) {
            localStorage.setItem('log', JSON.stringify(response));
            if (successCallback) {
                successCallback(response);
            } else {
                location.href = `${returnPage}`;
            }
        },
        error: function (response) {
            localStorage.setItem('log', JSON.stringify(response));
            if (errorCallback) {
                errorCallback(response);
            } else {
                location.href = `${returnPage}`;
            }
        }
    });
}

// Function to toggle between light and dark themes
function nightToggle() {
    var element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme == "light" ? "dark" : "light";
}
