/*
 * CS171
 *
 * Bubble Vis
 *
 */

class BubbleVis {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.displayData = [];


        this.initVis();
    }


    initVis() {
        let vis = this;
        const formatPercentAxis = d3.format(".0%");

        vis.colors = {Public: '#36C5F0', Private: '#E01E5A'};
        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width/5])
            .paddingInner(0.2)
            .domain([0,2]);

        vis.y = d3.scaleLinear()
            .range([vis.height/8, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Votes");

        vis.wrangleData();
    }


    wrangleData() {
        let vis = this

        console.log("hi")

        console.log(vis.data)

        let filteredData = []

        vis.selectedState = document.getElementById('state').value;
        console.log(vis.selectedState)

        vis.data.forEach(function (d,i) {
            if (vis.selectedState === d["State abbreviation_x"]) {
                filteredData.push(d)
            }

        })

        vis.displayData = filteredData;

        console.log(vis.displayData)

        let maxEndowment = d3.max(filteredData, d =>+d['Endowment assets (year end) per FTE enrollment (FASB)']);
        let minEndowment =  d3.min(filteredData, d =>+d['Endowment assets (year end) per FTE enrollment (FASB)']);

        console.log(maxEndowment)
        console.log(minEndowment)

        vis.sizeScale = d3.scaleSqrt()
            .domain([minEndowment, maxEndowment])
            .range([1, 20]);

        vis.updateVis();

    }

    updateVis() {
        let vis = this;


        // TO DO FOR NEXT WEEK => continue implementing circular positioning through d3.pack()

        const bubble = data => d3.pack()
            .size([vis.width, vis.height])
            //.padding(2)(d3.hierarchy({ children: data }).sum(d => d.score));

        const root = bubble(vis.data);
        const svg = d3.select('#bubbleDiv')
            .style('width', vis.width)
            .style('height', vis.height);

        /*const node = svg.selectAll()
            .data(root.children)
            .enter().append('g')
            //.attr('transform', `translate(100, 100)`);
            //.attr('transform', d => `translate(${d.x}, ${d.y})`);

        const circle = node.append('circle')
            /!*.attr('r', function(d) {
                return vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)'])
            })*!/
            .attr('r', 10)
            .style('fill', "black")
            .attr('cx', function(d,i) {
                return 10 + i * 20;
            })
            .attr('cy', function(d,i) {
                return 10 + i * 20;
            })*/

        /*svg.selectAll()
            .data(vis.displayData)
            .enter()
            .append('circle')
            /!*.attr('r', function(d) {
                return vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)'])
            })*!/
            .attr('r', 10)
            .style('fill', "black")
            .attr('cx', function(d,i) {
                return 10 + i * 20;
            })
            .attr('cy', function(d,i) {
                return 10 + i * 20;
            })*/



            /*.attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y;
            })*/

            //.style('fill', d => colors[d.data.category])

        vis.colors = {Public: '#36C5F0', Private: '#E01E5A'};


        let bubbles = vis.svg.selectAll('.bubbles')
            .data(vis.displayData);

        bubbles.exit().remove();

        bubbles.enter()
            .append('circle')
            .attr('class', 'bubbles')
            .attr("fill", function(d,i) {
                if (vis.displayData[i]["Control of institution_x"] === "Public") {
                    return "#36C5F0";
                }
                else if (vis.displayData[i]["Control of institution_x"] === "Private not-for-profit") {
                    return '#E01E5A';
                }
            })
            .attr("padding", 10)
            .attr("cx", (d,i) => 50 + i*10)
            .attr("cy", (d,i) => 50 + i*10)
            .attr('r', function(d) {
                return vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)'])
            })

        // Append legend boxes and text
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')

        vis.legend
            .append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "#36C5F0")
            .attr("transform", `translate(400,100)`)

        vis.legend
            .append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", '#E01E5A')
            .attr("transform", `translate(550,100)`)

        vis.legend
            .append("text")
            .text("Public")
            .attr("transform", `translate(435,115)`)

        vis.legend
            .append("text")
            .text("Private, Not-for-Profit")
            .attr("transform", `translate(585,115)`)


        // CREATE BAR CHART

        //TO DO FOR NEXT WEEK: Finish draft of bar charts

        // Update domains
        /*vis.x.domain(vis.displayData.map(d => d["Control of institution_x"]));
        vis.y.domain([0, d3.max(vis.displayData, d => d['Endowment assets (year end) per FTE enrollment (FASB)'])]);

        let bars = vis.svg.selectAll(".bar")
            .data(this.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")

            .merge(bars)
            .transition()
            .attr("width", vis.x.bandwidth())
            .attr("height", function (d,i) {
                let average_public = 0
                let average_private = 0

                if (vis.displayData[i]["Control of institution_x"] === "Public") {
                    average_public += d['Endowment assets (year end) per FTE enrollment (FASB)']
                    return average_public
                }
                else if (vis.displayData[i]["Control of institution_x"] === "Private not-for-profit") {
                    average_private += d['Endowment assets (year end) per FTE enrollment (FASB)']
                    return average_private
                }
            })
            .attr("x", function (d, index) {
                return vis.x(index);
            })
            .attr("y", function (d) {
                return vis.y(d);
            })

        bars.exit().remove();

        // Call axis function with the new domain
        vis.svg.select(".y-axis").call(vis.yAxis);


        vis.svg.select(".x-axis").call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });*/


    }
}