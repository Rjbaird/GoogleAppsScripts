/*
// =============== Script Overview =============== //
I wanted a way to automate tracking for my Dogecoin gains/losses in YNAB. Using the [YNAB API](https://api.youneedabudget.com/v1#/Accounts/getAccounts) and the [Coin API](https://docs.coinapi.io/#get-specific-rate). I need to create a sheet for tracking the number of Dogecoin I own, the current exchange rate, when/how much I bought it for and my total gains/loses. This will all be written in Google Apps Scripts

Every week, the script will make a YNAB transaction for the gains/losses for the week. Maybe I'll have it send an email report too so I can get practice writing emails in HTML.

// =============== Algorithms & Steps =============== //
1. Get current number of Dogecoin owned
2. Get current price of Dogecoin
3. Get most recent  account balance
4. Calculate gains/losses
5. Create POST request with gains/losses to YNAB

// =============== Functions =============== //
setScriptProps()
- This script is ran to set the script properties and global variables. Only needed if the code is saved to source control like GitHub

runDogeTracker()
- The master functions. Runs all other functions and passes results into the next function in the algorithm. Conversion to Milliunits is done here. 

getCurrentAccount(token, budgetId, accountId)
- Makes an GET request to the YNAB API and gets the current value of the account. Requires the YNAB API token, YNAB budget_id and YNAB account_id. Does not convert data from Milliunits to standard currency

getCryptoData(token, assetId)
- Uses the CoinAPI to get the current crypto exchange rate in USD. Requires a CoinAPI key and asset_id for desired cryptocurrency. Daily limit of 100 request per day.

createTransaction(accountId, date, amount, payee)
- Creates the transactions object for the POST request. Determines flag_color based on a positive or negative amount. Requires account_id, current date, transaction amount and payee name. 

updateAccount(token, budgetId, transactionData)
- Makes an POST request to the YNAB API and creates a transaction based on the data from createTransation. Currently broken and only gives a 500 error. Requires YNAB API token, YNAB budget_id and transactionData JSON object.

*/

// =============== Global Variables =============== //

function setScriptProps() {
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperties({
      'ynabToken': 'value', //replace value with your YNAB token inside the single quotation marks 
      'coinToken': 'value', //replace value with your CoinAPI token inside the single quotation marks
      'budgetId': 'value', //replace value with your YNAB budget_id inside the single quotation marks
      'accountId': 'value', //replace value with your YNAB account_id inside the single quotation marks
    });
    console.log('============ Script Properties Saved ============');
    var props = ScriptProperties.getProperties();
    console.log(props);
  }
  
  function deleteAllScriptProps() {
    var props = ScriptProperties.deleteAllProperties();
    console.log('============ All Script Properties Deleted ============');
  }
  
  const numberOfDoge = 1000;
  const assetId = 'DOGE';
  const globalProperties = PropertiesService.getScriptProperties();
  const token = globalProperties.getProperty('ynabToken');
  const coinToken = globalProperties.getProperty('coinToken');
  const budgetId = globalProperties.getProperty('budgetId');
  const accountId = globalProperties.getProperty('accountId');
  
  
  function runDogeTracker() {
    var currentCryptoPrice = getCryptoData(coinToken, assetId).rate;
    var dogeValue = (currentCryptoPrice * numberOfDoge) * 1000;
    var accountBalance = getCurrentAccount(token, budgetId, accountId);
    var dogeProfit = parseFloat((dogeValue - accountBalance).toFixed(2));
    var newDate = new Date();
    var date = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
    var transactionData = createTransaction(accountId, date, dogeProfit, assetId);
    var response = updateAccount(token, budgetId, transactionData);
  }
  
  function getCurrentAccount(token, budgetId, accountId) {
    var baseurl = `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${accountId}`;
    var headers = {
      'Authorization': 'Bearer ' + token
    };
    var params = {
      'method': 'GET',
      'headers': headers,
      'contentType': 'application/json'
    };
    var accountObject = JSON.parse(UrlFetchApp.fetch(baseurl, params));
    var accountBalance = accountObject.data.account.balance;
    return accountBalance
  }
  
  function getCryptoData(token, assetId) {
    var baseurl = `https://rest.coinapi.io/v1/exchangerate/${assetId}/USD`;
    var headers = { 'X-CoinAPI-Key': token };
    var params = {
      'method': 'GET',
      'headers': headers,
      'contentType': 'application/json'
    };
    var currentCryptoData = JSON.parse(UrlFetchApp.fetch(baseurl, params));
    console.log(currentCryptoData)
    return currentCryptoData;
  }
  
  function createTransaction(accountId, date, amount, payee) {
    if (amount <= 0) {
      var flagColor = "red"
    } else {
      var flagColor = "green"
    }
  
    var transactionData = {
      "transaction": {
        "account_id": accountId,
        "date": date,
        "amount": amount * 1000, // convert the amount to Milliunits
        "payee_name": payee,
        "memo": `Gains/losses for ${date}`,
        "cleared": "cleared",
        "approved": true,
        "flag_color": flagColor,
      }
    };
    return transactionData;
  }
  
  function updateAccount(token, budgetId, transactionData) {
    const baseurl = `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions/`;
    const headers = { 'Authorization': 'Bearer ' + token };
    const params = {
      'method': 'POST',
      'headers': headers,
      'payload': transactionData,
    };
    var response = UrlFetchApp.fetch(baseurl, params);
    console.log(response);
  }