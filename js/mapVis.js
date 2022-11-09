/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {
    constructor(parentElement, geoData){
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.displayData = []

        this.initVis()
    }

    initVis(){
        let vis = this;

        //defining margins and width / height of the space
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        //pixel values of projection
        //might need to adjust the pixel values
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        //geometry of the USA
        //topo json -> geo json
        //console.log(vis.usa)

        // adjust map position - map contains all the state groups
        vis.map = vis.svg.append("g")// group will contain all state paths
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`)
        // .attr("class", "states")

        //creating a path to then draw the states
        vis.path = d3.geoPath()

        //converting the topo json -> geo json DATA and storing it in the usa
        vis.usa = topojson.feature(vis.geoData, vis.geoData.objects.states).features

        //drawing all the states in the map using the geo Json data (vis.usa) using our path
        vis.states = vis.map.selectAll(".states")
            .data(vis.usa)
            .enter()
            .append("path")
            .attr('class', 'states')
            .attr('stroke', 'black')
            .attr("d", vis.path);

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;


        vis.updateVis();
    }

    updateVis(){

    }
}