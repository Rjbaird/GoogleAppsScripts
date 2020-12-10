/*
// =============== Function Overview =============== //
This function allows you to make an API Get Request for api following the REST protocol.
Simply update the token and baseUrl variables for the api that you are using.
Call the function as a variable and then pass that variable to another function that parses the data

*/

function apiGetRequest() {
    var token = 'ENTER TOKEN HERE'; //enter your API token inside the single quotation marks if required
    var baseUrl = 'ENTER BASE URL HERE'; // enter the base url for the API call here
    var headers = { 'Authorization': 'Bearer ' + token };
    var params = {
        'method': 'GET',
        'headers': headers,
        'contentType': 'application/json'
    };
    var responseData = JSON.parse(UrlFetchApp.fetch(baseUrl, params))
    return responseData
}

function makeApiCallAndParseData() {
    var data = apiGetRequest();
    parseData(data)
}
