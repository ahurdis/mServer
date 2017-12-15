let fs = require('fs');

Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));

let data = [{ "ID": 3629, "Name": "Sotši", "CountryCode": "RUS", "District": "Krasnodar", "Population": 358600 }, { "ID": 2389, "Name": "Poryong", "CountryCode": "KOR", "District": "Chungchongnam", "Population": 122604 }, { "ID": 3190, "Name": "Yanbu", "CountryCode": "SAU", "District": "Medina", "Population": 119800 }, { "ID": 585, "Name": "Djibouti", "CountryCode": "DJI", "District": "Djibouti", "Population": 383000 }, { "ID": 2495, "Name": "Safi", "CountryCode": "MAR", "District": "Doukkala-Abda", "Population": 262300 }, { "ID": 2699, "Name": "Matola", "CountryCode": "MOZ", "District": "Maputo", "Population": 424662 }, { "ID": 1579, "Name": "Nara", "CountryCode": "JPN", "District": "Nara", "Population": 362812 }, { "ID": 881, "Name": "Marilao", "CountryCode": "PHL", "District": "Central Luzon", "Population": 101017 }, { "ID": 3664, "Name": "Blagoveštšensk", "CountryCode": "RUS", "District": "Amur", "Population": 222000 }, { "ID": 550, "Name": "Bobo-Dioulasso", "CountryCode": "BFA", "District": "Houet", "Population": 300000 }, { "ID": 2152, "Name": "Laiyang", "CountryCode": "CHN", "District": "Shandong", "Population": 137080 }, { "ID": 1065, "Name": "Shambajinagar (Aurangabad)", "CountryCode": "IND", "District": "Maharashtra", "Population": 573272 }];



// first write out the keys

if (data.length >= 1) {

    let logger = fs.createWriteStream('filedata/log.csv', {
        flags: 'w' // 'w' means (over)wright
    });

    var headerKeys = Object.keys(data[0]);
    logger.write(headerKeys.join() + '\n');

    for (var i = 0; i < data.length; i++) {
        var rowValues = Object.values(data[i]);
        logger.write(rowValues.join() + '\n');
    }

    logger.end();
}

