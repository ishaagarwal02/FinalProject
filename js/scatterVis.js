/* * * * * * * * * * * * * *
*          ScatterVis          *
* * * * * * * * * * * * * */


class ScatterVis{
    constructor(parentElement, collegeData, eventHandler){
        this.parentElement = parentElement;
        this.collegeData = collegeData;
        this.displayData = []
        this.eventHandler = eventHandler;

        this.initVis()

    }
    initVis(){
        let vis = this;

        //defining margins

        vis.margin = {top: 60, right: 10, bottom: 60, left: 60};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;




        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        //create scales

        vis.x_scale = d3.scaleLinear()
            .range([vis.margin.left, vis.width-vis.margin.right])

        vis.y_scale = d3.scaleLinear()
            .range([vis.height/1.25, 0])

        //need to create a radius scale based on num colleges, so need to pull num colleges in wrangledata.
        vis.r_scale = d3.scaleLinear()
            .range([4,30])

        //adding colors
        vis.colorPalette = d3.scaleOrdinal(['#00bce4', '#037ef3', '#005670', '#00205b','#009f4d', '#efdf00', '#fe5000', '#da1884', '#a51890'])
        console.log(d3.schemeCategory10)

        //initiating brush and event handlers
        vis.currentBrushRegion = null;
        vis.brush = d3.brushX()
            .extent([[0,0],[vis.width, vis.height]])
            .on("brush", function(event){
                // User just selected a specific region
                vis.currentBrushRegion = event.selection;
               // console.log(vis.currentBrushRegion)
                vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x_scale.invert);

                // 3. Trigger the event 'selectionChanged' of our event handler
                vis.eventHandler.trigger("selectionChanged", vis.currentBrushRegion);
            });

        vis.brushGroup = vis.svg.append('g')
            .call(vis.brush)
            .attr('class', 'brush')

        //creating tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'scatterTooltip')

        vis.circle_group = vis.svg.append('g').attr('class', 'circle_group')

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')





        vis.wrangleData();


    }
    wrangleData(){
        let vis = this;

        let filteredData = [];
        filteredData = vis.collegeData;

      //  console.log(filteredData)

        //grouping together colleges by state
        let DatabyState = Array.from(d3.group(filteredData, d => d['State abbreviation_y']), ([key, value]) => ({key, value}));



        vis.stateInfo = []

        DatabyState.forEach(state => {
            //init counters
            let counter = 0; //counter to get averages

            //interesting values
            let AdmissionRate = 0;
            let Earnings = 0;
            let Region = "";

            //looping over the states to get sums per state

            state.value.forEach(entry => {
                AdmissionRate += +entry['AdmissionRate']
                Earnings += +entry['MedianEarnings']
                counter += 1
                Region = entry['Region']

            })


            //pushing the information into the new dataset
            vis.stateInfo.push({
                state: state.key,
                AvgAdmissionRate: AdmissionRate / counter * 100,
                AvgEarning: Earnings / counter,
                NumColleges: counter,
                Region: Region
            })
        })

       // console.log(vis.stateInfo)




        vis.updateVis();

    }
    updateVis(){
        let vis = this;

        //defining domains based on the state information
        //dont start at 0 for visual purposes as based on the scattervis lab completed in class
        vis.x_scale.domain([d3.min(vis.stateInfo, d => d['AvgAdmissionRate']), d3.max(vis.stateInfo, d => d['AvgAdmissionRate'])])
        vis.y_scale.domain([d3.min(vis.stateInfo, d => d['AvgEarning']), d3.max(vis.stateInfo, d => d['AvgEarning'])])
        vis.r_scale.domain([d3.min(vis.stateInfo, d => d['NumColleges']), d3.max(vis.stateInfo, d => d['NumColleges'])])


        //grabbing regions for legend and creating legend
        let legend_data = [...new Set(vis.stateInfo.map(d => d['Region']))]
        console.log(legend_data)

        vis.legend_boxes = vis.legend.selectAll('.legend-boxes')
            .data(legend_data)

        vis.legend_boxes.enter()
            .append("rect")
            .attr("class", "legend-boxes")
            .attr('height', 15)
            .attr('width', 15)
            .attr('x', vis.width - 2*vis.margin.left - vis.margin.right)
            .attr('y', (d,i) => i*20+10)
            .attr('fill', d => vis.colorPalette(d))

        vis.legend_boxes.selectAll('legend-text')

        vis.legend_boxes.enter().append('text')
            .attr('class', 'legend-text')
            .attr('x', vis.width - 2*vis.margin.left - vis.margin.right + 18)
            .attr('y', (d,i) => i*20+20)
            .text(d => d)


        //appending circles for scattervis and adding tooltips
        vis.circles = vis.circle_group.selectAll('.circles').data(vis.stateInfo)

        vis.circles.enter().append('circle')
            .attr('class', 'circles')
            .attr('cx', d => vis.x_scale(d['AvgAdmissionRate']))
            .attr('cy', d => vis.y_scale(d['AvgEarning']))
            .attr('r', d => vis.r_scale(d['NumColleges']))
            .attr('stroke', 'black')
            .attr('fill', d => vis.colorPalette(d['Region']))
            .attr('opacity', '0.7')
            .on('mouseover', function(event,d) {
                d3.select(this)
                // .attr('stroke-width', '2px')
                .attr('stroke', 'black')
                .attr('fill', 'rgba(100,100,100,0.62)')

            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h3> State: ${d['state']}</h3>  
             <h4> Average Earnings: $${d3.format(0.6)(d['AvgEarning'])}</h4> 
             <h4> Average Admissions Rate: ${d3.format(0.3)(d['AvgAdmissionRate'])}%</h4>
             <h4> Number of Colleges: ${d['NumColleges']}</h4> 
             <h4> Region: ${d['Region']}</h4>  
          

         </div>`);

        }).on('mouseout', function(event, d){
            d3.select(this)
                .attr('fill', d => vis.colorPalette(d['Region']))
            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })

        //calling and appending axes
        vis.xAxis = d3.axisBottom()
            .scale(vis.x_scale)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y_scale);

        vis.xAxis_group = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(" + 0 + "," + vis.height/1.25 + ")")

        vis.xAxis_group.call(vis.xAxis)
            .append("text")
            .attr("fill", "black")
            .attr("transform", "translate(" + vis.width/1.13  + ", 40)")
            .text("Average Admissions Rate")

        vis.yAxis_group = vis.svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate("+ (vis.margin.top) + ",0)")

        vis.yAxis_group.call(vis.yAxis)
            .append("text")
            .attr("fill", "black")
            .attr("transform", "translate(-50," + vis.height/2.5 + ") rotate(270)")
            .text("Average Earnings after College")



    }


}