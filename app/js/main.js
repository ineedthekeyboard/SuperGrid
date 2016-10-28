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

function kickOffDevDemo(columns, data) {
    var selectedMode = $('.sidebar .item.active').data('id');

    //localize data
    window.columns = columns[0] || [];
    window.data = data[0] || [];

    //Render Default Grid
    renderGrid(selectedMode);

    //Bind Mode Changes
    bindListeners();
}

//Render supergrid
//Each mode is independently defined in the case statement so that it is obvious how to configure each mode
function renderGrid(mode) {
    var $grid = $('.application .grid'),
        newConfig;

    switch (mode) {
        case 'noPaging':
            $grid.SuperGrid({
                config: {columns: window.columns},
                data: window.data,
                paginate: false
            });
            break;
        case 'accessibility':
            $grid.SuperGrid({
                config: {columns: window.columns},
                data: window.data,
                accessibility: true //if enabled it will disable paging and col resize automatically.
            });
            break;
        case 'reOrder':
            $grid.SuperGrid({
                config: {columns: window.columns},
                data: window.data,
                colReorder: true
            });
            break;
        case 'fixedHeader':
            $grid.SuperGrid({
                config: {columns: window.columns},
                data: window.data,
                fixedHeader: {enabled: true, removeHeight: 20} //the extra removed is for scroll bar and padding size.
            });
            break;
        case 'formatter':
            //create special config to add formatters to:
            newConfig = {columns: Object.assign({}, window.columns)};

            //Formatters for a given id of a column:
            newConfig.formatters = {
                'timeStamp': function (rowData, completeDataSet) {
                    var cDate = new Date(rowData.timeStamp).toLocaleDateString("en-US");
                    return "I'm a custom format:" + cDate;
                },
                'login' : '<div style="text-transform:uppercase;">#login#</div>',
                'aarpNumber' : function (rowData) {
                    var newString = rowData.aarpNumber.toString().substring(0,1);
                    newString += '.' + rowData.aarpNumber.toString().substring(1);
                    return newString;
                }
            };

            //render supergrid as usual
            $grid.SuperGrid({
                config: newConfig,
                data: window.data,
                fixedHeader: {enabled: true, removeHeight: 20} //the extra removed is for scroll bar and padding size.
            });
            break;
        case 'customSort':
            //create special config to add formatters to:
            newConfig = {columns: Object.assign({}, window.columns)};

            //Formatters for a given id of a column:
            newConfig.formatters = {
                'timeStamp': function (rowData) {
                    var cDate = new Date(rowData.timeStamp).toLocaleDateString("en-US");
                    return "I'm a custom format:" + cDate;
                }
            };

            //Custom Sort
            newConfig.customSorters = {
                'timeStamp': function (a, b, blnAsc) {
                    var dateOne = new Date(a.timeStamp).getFullYear(),
                        dateTwo = new Date(b.timeStamp).getFullYear();
                    if (blnAsc) {
                        return (dateOne > dateTwo);
                    } else {
                        return (dateOne < dateTwo);
                    }
                },
                'login' : function (a, b, blnAsc) {
                    if (blnAsc) {
                        return (parseInt(a.aarpNumber) > parseInt(b.aarpNumber));
                    } else {
                        return (parseInt(a.aarpNumber) < parseInt(b.aarpNumber));
                    }
                }
            };

            //render supergrid as usual
            $grid.SuperGrid({
                config: newConfig,
                data: window.data,
                fixedHeader: {enabled: true, removeHeight: 20} //the extra removed is for scroll bar and padding size.
            });
            break;
        case 'cGroup':
            break;
        case 'idGroup':
            break;
        case 'default':
        default:
            //Entry point following ajax call:
            $('.grid').SuperGrid({
                config: {columns: window.columns},
                data: window.data
            });
            break;
    }

}

function bindListeners() {
    var $menu = $('.application .sidebar'),
        $application = $('.application');

    // $application.on('supergrid-rendered', function (e, data) {
    //     debugger;
    // });

    $menu.off('click', '.item');
    $menu.on('click', '.item', function () {
        var selectedMode = $(this).attr('data-id');

        //change active sidebar item
        $menu.find('.item').removeClass('active');
        $(this).addClass('active');

        //remove current grid
        $('.grid').remove();
        $application.append('<div class="grid"></div>');

        // auto height enabled make parent have a fixed height and width to calc by:
        if (selectedMode === 'fixedHeader') {
            $('.grid').addClass('fixedSize');
        }

        //Render New Grid
        renderGrid(selectedMode);

    });
}

//Catch JSON Parse Errors and notify the dev
function errorHandle() {
    alert('An Error Occurred Loading Local JSON');
}

//When all JSON files have been loaded render the grid plugin
$.when(getSampleData('/js/sampleData/config.json'), getSampleData('/js/sampleData/data.json'))
 .then(kickOffDevDemo, errorHandle);
