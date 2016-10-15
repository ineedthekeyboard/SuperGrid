"use strict";

function getConfig() {
    //Replace this with an ajax for the config if need be.
    return [{
        "name": "ID",
        "id": "id",
        "width": 200,
        "sortable": true,
        "cellClass": "stretch"
    }, {
        "name": "Time Of Retrieval",
        "id": "timeStamp",
        "sortable": true,
        "width": 160,
        "cellClass": "stretch"
    }, {
        "name": "Unit",
        "id": "aarpNumber",
        "sortable": true,
        "width": 150,
        "cellClass": "stretch"
    }, {
        "name": "Code",
        "id": "docCode",
        "sortable": true,
        "width": 100,
        "cellClass": "stretch"
    }, {
        "name": "Serial",
        "id": "codedSerial",
        "sortable": true,
        "width": 150,
        "cellClass": "stretch"
    }, {
        "name": "Type",
        "id": "title",
        "sortable": true,
        "width": 200,
        "cellClass": "stretch"
    }];
}

function getData() {
    //Replace this with an ajax for the config if need be.
    return [{
        "id": "824156",
        "timeStamp": 1460722981315,
        "aarpNumber": 1596,
        "docCode": "aqel",
        "codedSerial": 4228,
        "title": "Holy Cow Distribution"
    }, {
        "id": "746119",
        "timeStamp": 1414749382432,
        "aarpNumber": 1410,
        "docCode": "n5rj",
        "codedSerial": 2003,
        "title": "Caffinated Dogs"
    }, {
        "id": "824748",
        "timeStamp": 1364136101901,
        "aarpNumber": 1871,
        "docCode": "rkz8",
        "codedSerial": 7610,
        "title": "Glitchy Gas"
    }, {
        "id": "150482",
        "timeStamp": 1417639861339,
        "aarpNumber": 1176,
        "docCode": "rp0u",
        "codedSerial": 2460,
        "title": "Razor Accelerated Death"
    }];
}

function renderSuperGrid(gridType) {
    var config = getConfig(),
        data = getData(),
        $grid = $('.grid-container');
    switch (gridType) {
        case 'minimal':

            break;
        case 'advanced':

            break;
        case 'access':

            break;
        case 'default':
        default:
            $grid.SuperGrid({
                columns: config,
                data: data
            });

    }
    return gridType;
}

function navCalc() {
    var $mobileBar = $('.mobileBar'),
        $nonMobileBar = $('.nonMobileBar');
    if ($(window).width() < 800) {
        $mobileBar.fadeIn();
        $nonMobileBar.fadeOut();
    } else {
        $mobileBar.fadeOut();
        $nonMobileBar.fadeIn();
    }
}

function bindListeners() {
    //on resize event check size
    //$(window).resize(() => navCalc());
    //on grid change
    $('.nonMobileBar button').on('click', function(e) {
        //Handle table type change on click
        var $currentPressedButton = $(e.currentTarget),
            buttonPressed = $currentPressedButton.attr('buttonType');
        $('.nonMobileBar button.active').removeClass('active');
        $currentPressedButton.addClass('active');
        renderSuperGrid(buttonPressed);
    });

    //Foundation Script
    //$(document).foundation();
}

function startDemo() {
    //Render the grid for the first timeStamp
    renderSuperGrid('default');
    //Bind Listeners after the grid is rendered
    bindListeners();
}
//Kick Off demo
$(document).ready(startDemo());
