'use strict';
// charset: utf-8

window.addEventListener("resize", create_dataviz, false);

var dataviz = {
    done: false
}

function create_dataviz() {
    if (getDepart() !== "" && getArrivee() !== "") {
        if (dataviz.done) {
            clearBarChart("#bar-demo");
            clearBarChart("#bar-demo-3");
        }

        create_dataviz_1();
        create_dataviz_2();
        create_dataviz_3();

        dataviz.done = true;
    }
}

function create_dataviz_1() {
    var value = data.d30.matrix.mode[getMode()][getDepart()][getArrivee()];
    var total = data.d30.matrix.mode.total[getDepart()][getArrivee()];
    var rounded = 0;
    if (total > 0) {
        rounded = Math.ceil(value / total * 10) * 10;
    }

    if (rounded > 0) {
        document.getElementById("people").src = "img/dataviz1/" + rounded + ".svg";
    } else {
        document.getElementById("people").src = "";
    }

    document.getElementById("number").firstChild.nodeValue = value;
}

function create_dataviz_2() {
    var total = data.d30.matrix.mode.total[getDepart()][getArrivee()];

    var bar = [0, 0, 0, 0];

    if (total > 0) {
        bar = [
            (data.d30.matrix.mode.voiture[getDepart()][getArrivee()] / total * 100).toFixed(0),
            (data.d30.matrix.mode.tc[getDepart()][getArrivee()] / total * 100).toFixed(0),
            (data.d30.matrix.mode.velo[getDepart()][getArrivee()] / total * 100).toFixed(0),
            (data.d30.matrix.mode.marche[getDepart()][getArrivee()] / total * 100).toFixed(0)
        ];
    }

    drawBarChart(bar, "#bar-demo", ["pourcentVoiture", "pourcentCommun", "pourcentVelo", "pourcentPied"], ["#d4584e", "#29a7de", "#e3ab04", "#177275"]);
}

function create_dataviz_3() {
    var total = data.d30.matrix.motif.total[getDepart()][getArrivee()];

    var bar = [0, 0, 0];

    if (total > 0) {
        bar = [
        (data.d30.matrix.motif.travail[getDepart()][getArrivee()] / total * 100).toFixed(0),
        (data.d30.matrix.motif.etudes[getDepart()][getArrivee()] / total * 100).toFixed(0),
        (data.d30.matrix.motif.autre[getDepart()][getArrivee()] / total * 100).toFixed(0)
        ];
    }

    drawBarChart(bar, "#bar-demo-3", ["pourcentTravail", "pourcentEtude", "pourcentAutres"], ["#d4584e", "#29a7de", "#e3ab04"]);
}

function drawBarChart(dataset, idForDrawing, idsForValues, colorsSet) {
    var barWidth = 0.02 * window.innerWidth;
    var barHeight = 0.18 * window.innerHeight;
    var barFullWidth = (barWidth + 10) * dataset.length;

    var x = d3.scale.linear().domain([0, dataset.length]).range([0, barFullWidth]);
    var y = d3.scale.linear().domain([-1, 100]).rangeRound([0, barHeight]);

    // add the canvas to the DOM
    var barDemo = d3.select(idForDrawing).
        append("svg:svg").
        attr("width", barFullWidth).
        attr("height", barHeight);

    barDemo.selectAll("rect").
      data(dataset).
      enter().
      append("svg:rect").
      attr("x", function (value, index) { return x(index); }).
      attr("y", function (value) { return barHeight - y(value); }).
      attr("height", function (value) { return y(value); }).
      attr("width", barWidth).
      attr("fill", function (datum, index) { return colorsSet[index]; });

    idsForValues.forEach(function (s, i) {
        document.getElementById(s).firstChild.nodeValue = dataset[i];
        i += 1;
    }, 0);
}

function clearBarChart(id) {
    d3.select(id).select("svg").remove();
}

function updateTransportMode() {
    create_dataviz_1();
    document.getElementById("transport").src = document.getElementById("myCar").href.baseVal;
}