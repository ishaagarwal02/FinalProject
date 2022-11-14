/* * * * * * * * * * * * * *
*          RadarVis          *
* * * * * * * * * * * * * */

//data structure:
//features = the vertices (i.e. ACT score, SAT score, whatever)
//then there are POINTS, which have different values for each FEATURE
//i.e. the points would be colleges with the relevant features, each feature has a different value
//so the data should look like: [{SAT: 1500, GPA: 2}, {SAT: 1600, GPA: 4}] for 2 points 2 features


//steps:
//append svg
//plot gridlines (i.e. the polygons/circles/whatever) using a scale and ticks
//for each tick, plot the shape (i.e. circle or polygon), where radius comes from the previous scale
//add text for ticks
//now, plot the axes (which are the lines from the center TO the features)
//do some math about the angles and where to place them, and then plot d3 lines with appropriate coordinates
//FINALLY, plot the data.
//need to make them move?


class RadarVis{
    constructor(parentElement, collegeData){
        this.parentElement = parentElement;
        this.collegeData = collegeData;
        this.displayData = [];

        this.initVis()
    }
    initVis(){
        let vis = this;
        vis.margin = {top: 10, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;

        //this works to filter by column, but does not create key-value pairs properly (i think?)
        vis.displayData =  vis.collegeData.map(function(d){
            return {
                key: d['Institution (entity) name'],
                name: d['Institution (entity) name'],
                ACT: d['ACTMedian'],
                SAT: d['SATAverage'],
                Cost: d['AverageCost'],
                Enrollment: d['Estimated undergraduate enrollment, full time']}
        })
        console.log(vis.displayData)

        vis.updateVis();

    }
    updateVis(){
        let vis = this;

    }
}