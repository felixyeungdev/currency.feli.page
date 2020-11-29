const baseCurrencySelect = document.querySelector("#base-currencies");
const amountInput = document.querySelector("#amount");
const convertButton = document.querySelector("#convert");
const baseInfo = document.querySelector(".base-info");
const convertedList = document.querySelector(".converted-list");

var userCountryCode;
var currencyLookup;

var currencyRates;
var convertedAmounts;
var baseCurrency;
var baseAmount;
var isUpdatingRates = false;

async function renderConvertedCurrencies() {
    function renderBaseInfo() {
        baseInfo.innerHTML = "";
        const h2 = document.createElement("h2");
        h2.innerText = `${baseAmount} ${currencyLookup[baseCurrency]["name"]}`;
        const h3 = document.createElement("h3");
        h3.innerText = `Equals to...`;
        baseInfo.append(h2, h3);
    }
    function renderConvertedList() {
        convertedList.innerHTML = "";
        for (var currency in convertedAmounts) {
            var amount = convertedAmounts[currency];
            var currencyName = currencyLookup[currency]["name"];
            var currencySymbol = currencyLookup[currency]["symbol"];

            const currencyElement = document.createElement("div");
            currencyElement.classList.add("currency");
            const h2 = document.createElement("h2");
            h2.innerText = `${amount} ${currencyName}`;
            currencyElement.append(h2);
            convertedList.append(currencyElement);
        }
    }
    renderBaseInfo();
    renderConvertedList();
    return;
}

async function showBaseCurrencies(currencies) {
    for (var currency in currencies) {
        const currencyData = currencies[currency];
        const option = document.createElement("option");
        option.value = currency;
        option.innerText = `${currencyData["name"]} (${currencyData["symbol"]})`;
        baseCurrencySelect.append(option);
        if (currency.includes(userCountryCode)) {
            baseCurrencySelect.value = currency;
        }
    }
    if (!baseCurrencySelect.value) baseCurrencySelect.value = "GBP";
    baseCurrencySelect.disabled = false;
}

async function updateRates() {
    if (isUpdatingRates) return;
    amountInput.disabled = true;
    convertButton.disabled = true;
    isUpdatingRates = true;

    baseCurrency = baseCurrencySelect.value;
    currencyRates = await VatComplyAPI.getRates({ base: baseCurrency });

    amountInput.disabled = false;
    isUpdatingRates = false;
    convertButton.disabled = false;
    return;
}

async function convert() {
    baseAmount = parseFloat(amountInput.value) || 0;
    convertedAmounts = {};
    for (var currency in currencyRates) {
        var rate = currencyRates[currency];
        convertedAmounts[currency] = Math.round(rate * baseAmount * 100) / 100;
    }
    renderConvertedCurrencies();
    return;
}

async function main() {
    baseCurrencySelect.disabled = true;
    amountInput.disabled = true;
    convertButton.disabled = true;
    amountInput.value = 0;
    baseAmount = 0;
    userCountryCode = await VatComplyAPI.getGeolocation();
    currencyLookup = await VatComplyAPI.getCurrencies();
    await showBaseCurrencies(currencyLookup);
    await updateRates();
    convert();
}

convertButton.addEventListener("click", convert);
baseCurrencySelect.addEventListener("change", updateRates);
amountInput.addEventListener("keyup", convert);

main();
