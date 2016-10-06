// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

//*************************************
//** Harness to Load Sample SuperGrid *
//*************************************
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

    window.config = config;
    window.data = data;

    bindListeners();
}

function bindListeners() {
    var $menu = $('.menu'),
        $application = $('.application'),
        option;

    $menu.off('click', '.item');
    $menu.on('click', '.item', function () {
        $menu.find('.item').removeClass('active');
        $(this).addClass('active');
        option = $(this).attr('data-id');

        $('.grid').remove();

        $application.append('<div class="grid"></div>');

        //auto height enabled make parent have a fixed height and width to calc by:
        if (option === 'fixedHeader') {
            $('.grid').addClass('fixedSize');
        }
        $('.grid').SuperGrid({
            columns: window.config[0] || [],
            data: window.data[0] || [],
            paginate: !(option === 'paginate'),
            colReorder: (option === 'reorder'),
            colResize: false, //setting this to default just so if we want to we can toggle it here
            fixedHeader: {enabled: (option === 'fixedHeader'), removeHeight: 20},//the extra removed is for scroll bar and padding size.
            accessibility: false //if enabled it will disable paging and col resize automatically.
        });
    });
}

//todo remove this function and standardize the output to a json
function generateData() {
    var arr = [],
        i = 0,
        newObj;

    function randomTitle() {
        var rndNumber = randomIntFromInterval(0, 10);
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
$.when(getSampleData('/js/sampleData/config.json'), getSampleData('/js/sampleData/data.json'))
 .then(renderGrid, errorHandle);
