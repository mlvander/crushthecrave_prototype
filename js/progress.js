/*global $ */
/*jslint plusplus: true */

function buildChart() {
    "use strict";
    
    $(function () {
        $('#container').highcharts({
            chart: {
                type: 'spline',
                backgroundColor: "none",
                height: "500"
            },
            title: {
                text: 'Quit Progress',
                style: { "color": "#FFF" },
                x: 15
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: document.progressDates,
                labels: {
                    style: { "color": "#FFF" }
                }
            },
            yAxis: {
                title: {
                    text: '# of Cigarettes',
                    style: { "color": "#FFF" }
                },
                labels: {
                    style: { "color": "#FFF" }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            legend: {
                itemStyle: { "color": "#FFF" }
            },
            series: [{
                name: 'Allowance',
                marker: {
                    symbol: 'square'
                },
                data: document.progressAllowance
            }, {
                name: 'Smoked',
                color: '#fb9b1d',
                marker: {
                    symbol: 'diamond'
                },
                data: document.progressSmoked
            }]
        });
    });
}