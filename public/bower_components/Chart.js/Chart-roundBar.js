(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;


	var defaultConfig = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};

	Chart.RoundedRectangle = Chart.Rectangle.extend({
        draw: function () {
            var ctx = this.ctx,
                halfWidth = this.width / 2,
                leftX = this.x - halfWidth,
                rightX = this.x + halfWidth,
                top = this.base - (this.base - this.y),
                halfStroke = this.strokeWidth / 2,
                radius = 5;


            // Canvas doesn't allow us to stroke inside the width so we can
            // adjust the sizes to fit if we're setting a stroke on the line
            if (this.showStroke) {
                leftX += halfStroke;
                rightX -= halfStroke;
                top += halfStroke;
            }

            ctx.beginPath();

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;


           // stop from creating funky shapes if the radius is bigger than the rectangle we are creating
            ctx.moveTo(leftX, this.base+1);
            ctx.lineTo(leftX, top + radius);
            ctx.quadraticCurveTo(leftX, top, leftX + radius, top);
            ctx.lineTo(rightX - radius, top);
            ctx.quadraticCurveTo(rightX, top, rightX, top + radius);
            ctx.lineTo(rightX, this.base);
            //ctx.quadraticCurveTo(rightX, this.base, rightX , this.base);
            ctx.lineTo(leftX, this.base);
            //ctx.quadraticCurveTo(leftX, this.base, leftX, this.base);



            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            }
        },

    });
Chart.types.Bar.extend({
    name: "roundBar",
    initialize: function (data) {

        //Expose options as a scope variable here so we can access it in the ScaleClass
        var options = this.options;

        this.ScaleClass = Chart.Scale.extend({
            offsetGridLines: true,
            calculateBarX: function (datasetCount, datasetIndex, barIndex) {
                //Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
                var xWidth = this.calculateBaseWidth(),
                    xAbsolute = this.calculateX(barIndex) - (xWidth / 2),
                    barWidth = this.calculateBarWidth(datasetCount);

                return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth / 2;
            },
            calculateBaseWidth: function () {
                return (this.calculateX(1) - this.calculateX(0)) - (2 * options.barValueSpacing);
            },
            calculateBarWidth: function (datasetCount) {
                //The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
                var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

                return (baseWidth / datasetCount);
            }
        });

        this.datasets = [];

        //Set up tooltip events on the chart
        if (this.options.showTooltips) {
            helpers.bindEvents(this, this.options.tooltipEvents, function (evt) {
                var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

                this.eachBars(function (bar) {
                    bar.restore(['fillColor', 'strokeColor']);
                });
                helpers.each(activeBars, function (activeBar) {
                    activeBar.fillColor = activeBar.highlightFill;
                    activeBar.strokeColor = activeBar.highlightStroke;
                });
                this.showTooltip(activeBars);
            });
        }

        //Declare the extension of the default point, to cater for the options passed in to the constructor
        this.BarClass = Chart.RoundedRectangle.extend({
            strokeWidth: this.options.barStrokeWidth,
            showStroke: this.options.barShowStroke,
            ctx: this.chart.ctx
        });

        //Iterate through each of the datasets, and build this into a property of the chart
        helpers.each(data.datasets, function (dataset, datasetIndex) {

            var datasetObject = {
                label: dataset.label || null,
                fillColor: dataset.fillColor,
                strokeColor: dataset.strokeColor,
                bars: []
            };

            this.datasets.push(datasetObject);

            helpers.each(dataset.data, function (dataPoint, index) {
                //Add a new point for each piece of data, passing any required data to draw.
                datasetObject.bars.push(new this.BarClass({
                    value: dataPoint,
                    label: data.labels[index],
                    datasetLabel: dataset.label,
                    strokeColor: dataset.strokeColor,
                    fillColor: dataset.fillColor,
                    highlightFill: dataset.highlightFill || dataset.fillColor,
                    highlightStroke: dataset.highlightStroke || dataset.strokeColor
                }));
            }, this);

        }, this);

        this.buildScale(data.labels);

        this.BarClass.prototype.base = this.scale.endPoint;

        this.eachBars(function (bar, index, datasetIndex) {
            helpers.extend(bar, {
                width: this.scale.calculateBarWidth(this.datasets.length),
                x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                y: this.scale.endPoint
            });
            bar.save();
        }, this);

        this.render();
    },
});

}).call(this);

