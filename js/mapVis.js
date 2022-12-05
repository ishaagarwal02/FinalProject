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
        vis.margin = {top: -10, right: 20, bottom: 30, left: 200};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        console.log(vis.width)

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        //pixel values of projection
        vis.viewpoint = {'width': vis.width*1.1, 'height': vis.width*2.15};
        vis.zoom = vis.width / vis.viewpoint.width;

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
            .attr('fill', 'white')
            .attr("d", vis.path);

        //creating a color scale for the fill of map
        vis.colors = d3.scaleLinear().range(["#FFFFFF", "#00205b"])

        //creating a tooltip:
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        //creating a legend
        vis.legendScale = d3.scaleLinear()
            .range([0, vis.width/2]);

        vis.legendAxis = d3.axisBottom()
            .scale(vis.legendScale)
            .ticks(4);

        // Adds the legend group
        vis.legendGroup = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width /5}, ${vis.height - 5*vis.margin.bottom})`)

        let legendColorScale = d3.scaleSequential()
            .interpolator(d3.interpolate('#FFFFFF', '#00205b'))
            .domain([0, 50]);

        let gradientRange = d3.range(60);

        vis.legend = vis.legendGroup.selectAll('.rects')
            .data(gradientRange)
            .enter()
            .append('rect')
            .attr('y', -25)
            .attr('height', 25)
            .attr('x', (d, i) => i * (vis.width/120))
            .attr('width', vis.width/120)
            .attr('fill', d => legendColorScale(d))
            .attr('class', 'rects')


        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        let filteredData = [];
        //State abbreviation_x is the state abbreviation 2 letters
        //State abbreviation_y is the full name

        filteredData = vis.collegeData;


        //aggregating data over states
        let DatabyState = Array.from(d3.group(filteredData, d => d['State abbreviation_y']), ([key, value]) => ({key, value}));

       // console.log(DatabyState)

        vis.stateInfo = []

        DatabyState.forEach(state => {
            //init counters
            let counter = 0; //counter to get averages

            //interesting values
            let ACTMedian = 0;
            let AdmissionRate = 0;
            let TotalApps = 0;

            //looping over the states to get sums per state

            state.value.forEach(entry => {
                ACTMedian += +entry['ACTMedian']
                AdmissionRate += +entry['AdmissionRate']
                TotalApps += +entry['Applicants total_x']
                counter += 1
            })

            //pushing the information into the new dataset
            vis.stateInfo.push({
                state: state.key,
                AverageACT: ACTMedian / counter,
                AvgAdmissionRate: AdmissionRate / counter * 100,
                TotalApps: TotalApps / counter,
                NumColleges: counter
            })
        })



        vis.updateVis();
    }

    updateVis(){

        let vis = this;
        let assignColor = '';

        //assigning colors to states based on the selected category and ranges
        vis.colors.domain([0,d3.max(vis.stateInfo, d => d[selectedCategory_map])])

        vis.states.attr("fill", function(d){
            vis.stateInfo.forEach(state => {
                if (state.state == d.properties.name){
                    //console.log(state.state)
                    // console.log(state.absCases)
                    assignColor = vis.colors(state[selectedCategory_map])
                }
            })
            return assignColor;
        })


        //utilizing the tooltip:
        vis.states.on('mouseover', function(event,d){
            d3.select(this)
               // .attr('stroke-width', '2px')
                .attr('stroke', 'black')
                .attr('fill', 'rgba(100,100,100,0.62)')

            let stateMouseOver = vis.stateInfo.find(obj => obj.state === d.properties.name)
//need to fix formatting on Average ACT and Total Number of Applicants --> round
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h3> State: ${d.properties.name}<h3>
             <h4> Number of Colleges: ${stateMouseOver.NumColleges}</h4>    
             <h4> Average ACT: ${d3.format("0.3")(stateMouseOver.AverageACT)}</h4>   
             <h4> Average Admissions Rate: ${d3.format("0.3")(stateMouseOver.AvgAdmissionRate)}%</h4>  
             <h4> Average Number of Applicants: ${d3.format("0.6")(stateMouseOver.TotalApps)}</h4>    
  

         </div>`);
        }).on('mouseout', function(event, d){
            d3.select(this)
                .attr("fill", function(d){
                    vis.stateInfo.forEach(state => {
                        if (state.state == d.properties.name){
                            assignColor = vis.colors(state[selectedCategory_map])
                        }
                    })
                    return assignColor;
                })

            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })

        // Updates domains
        vis.legendScale.domain([0, d3.max(vis.stateInfo, d => d[selectedCategory_map])]);

        vis.legendGroup.call(vis.legendAxis);


    }
}