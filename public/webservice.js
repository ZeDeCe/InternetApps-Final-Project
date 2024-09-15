async function fetchWebService(id) {
    const result = {
        monthDesc: null,
        year: null,
        percentYear: null
    }

    if (typeof id != 'number')
        return result;

    const apiURL = `https://api.cbs.gov.il/index/data/price?id=${id}&format=json&download=false&last=1`;

    try { 
        const response = await fetch(apiURL);
        const index = await response.json();

        result["monthDesc"] = index["month"][0]['date'][0]["monthDesc"];
        result["year"] = index["month"][0]['date'][0]["year"];
        result["percentYear"] = index["month"][0]['date'][0]["percentYear"];

    } catch(e) {
        console.error("Couldn't Fetch WebService.");
        console.error(e);
    }

    return result;
}

async function getCommBuildPriceIndex () {
    return await fetchWebService(800010);
}

async function getHousePriceIndex () {
    return await fetchWebService(40010);
}

async function getConsumerPriceIndex() {
    return await fetchWebService(120450);
}

export  {
    getCommBuildPriceIndex,
    getHousePriceIndex,
    getConsumerPriceIndex
}