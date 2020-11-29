class VatComplyAPI {
    static async getRates({ date, base } = {}) {
        const url = new URLSearchParams();
        console.log({ date, base });
        if (date) url.set("date", date);
        if (base) url.set("base", base);
        const response = await fetch(
            `https://api.vatcomply.com/rates?${url.toString()}`
        );
        const json = await response.json();
        return json["rates"] || null;
    }
    static async getCurrencies() {
        const response = await fetch("https://api.vatcomply.com/currencies");
        const json = await response.json();
        return json || null;
    }
    static async getGeolocation() {
        const response = await fetch("https://api.vatcomply.com/geolocate");
        const json = await response.json();
        return json["country_code"] || null;
    }
}
