/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {
    constructor(parentElement, geoData, collegeData){
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.collegeData = collegeData;
        this.displayData = []

        this.initVis()
    }

    initVis(){
        let vis = this;

        //defining margins and width / height of the space
        vis.margin = {top: -10, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        //pixel values of projection
        //might need to adjust the pixel values
        vis.viewpoint = {'width': 975, 'height': 500};
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
            .attr('fill', 'white') //--> would need to change fill but for now for it to show me the states
            .attr("d", vis.path);

        //creating a color scale for the fill of map
        //6a1370
        vis.colors = d3.scaleLinear().range(["#FFFFFF", "#6A1370"])


        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        let filteredData = [];
        //State abbreviation_x is the state abbreviation 2 letters
        //State abbreviation_y is the full name

        filteredData = vis.collegeData;

        console.log(filteredData)

        //console.log(filteredData['SATAverage'])

        let DatabyState = Array.from(d3.group(filteredData, d => d['State abbreviation_y']), ([key, value]) => ({key, value}));

        console.log(DatabyState)

        vis.stateInfo = []

        DatabyState.forEach(state => {
            //init counters
            let ACTMedian = 0;
            let counter = 0;

            state.value.forEach(entry => {
                ACTMedian += +entry['ACTMedian']
                counter += 1
            })

            vis.stateInfo.push({
                state: state.key,
                AverageACT: ACTMedian / counter
            })
        })

        console.log(vis.stateInfo)








        vis.updateVis();
    }

    updateVis(){

        let vis = this;
        let assignColor = '';

        console.log(vis.stateInfo[1]['AverageACT'])

        //vis.colors.domain([0,d3.max(vis.stateInfo, d => d['AverageACT'])])

       // console.log(vis.colors.domain)

       // vis.states.attr('fill', d=> vis.colors(d['AverageACT']))



    }
}