//Promise to get the config and data json from local folder
function getSampleData(urlToGet) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: urlToGet,
        success: deferred.resolve,
        error: deferred.reject
    });
    return deferred.promise();
}

//Catch JSON Parse Errors and notify the dev
function errorHandle() {
    alert('An Error Occurred Loading Local JSON');
}

//Render the plugin
function renderGrid(config, data) {
    $('.grid').SuperGrid({
        columns: config[0] || [],
        data: data[0] || []
    });
}

//todo remove this function and standardize the output to a json
function generateData() {
    var arr = [],
        i = 0,
        newObj;

    function randomTitle() {
      var rndNumber = randomIntFromInterval(0,10);
      var titles = [
        'Advisory',
        'Simple Application',
        'Mono-Chromo Plastic',
        'Warning Return',
        'Basic Return',
        'Razor Accelerated Death',
        'Caffinated Dogs',
        'Glitchy Gas',
        'Holy Cow Collection',
        'Holy Cow Distribution',
        'Pea Pod'
      ];
      return titles[rndNumber];
    }
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function randomData() {
        newObj = {};
        newObj.id = randomIntFromInterval(100000, 900000).toString();
        newObj.login = "aaaa";
        newObj.timeStamp = randomDate(new Date(2012, 0, 1), new Date()).getTime();
        newObj.aarpNumber = randomIntFromInterval(100, 2000);
        newObj.docCode = Math.random().toString(36).slice(2, 6);
        newObj.codedSerial = randomIntFromInterval(1000, 9999);
        newObj.title = randomTitle();
        return newObj;
    }
    while (i < 1000) {
        arr.push(randomData());
        i++;
    }
    return arr;
}

//When all JSON files have been loaded render the grid plugin
$.when(getSampleData('/js/sampleData/config.json'), getSampleData('/js/sampleData/data.json')).then(renderGrid, errorHandle);
