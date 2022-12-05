/* * * * * * * * * * * * * *
*          barChartVis     *
* * * * * * * * * * * * * */

class BarChart{
    constructor(parentElement, collegeData){
        this.parentElement = parentElement;
        this.collegeData = collegeData;
        this.data = collegeData;

        this.displayData = collegeData;


        this.initVis();

    }
    initVis(){
        let vis = this;

        //defining margins

        vis.margin = {top: 60, right: 60, bottom: 60, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("div").append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Overlay with path clipping
        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);


        //x and y scales:
        vis.x = d3.scaleBand().paddingInner(0.2).rangeRound([0, vis.width/1.25])

        vis.y = d3.scaleLinear().range([vis.height/1.25, 0])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis_group = vis.svg.append("g")
                .attr("class", "x-axis axis")
                .attr("transform", "translate(" + vis.margin.top + "," + vis.height/1.25 + ")");

        vis.yAxis_group = vis.svg.append("g")
                .attr("class", "y-axis axis")
                .attr("transform", "translate("+ (vis.margin.top) + ",0)")


        //creating bar group
        vis.bar_group = vis.svg.append('g').attr('class', 'bar_group')
            .attr('transform', 'translate(' + vis.margin.top + ',0)')

        //re-ordering x-axis in a more logical order manually
        vis.x_keys = [...new Set(vis.displayData.map(d => d['Institution size category']))]
        vis.x_keys = Array.from(vis.x_keys).sort()
        console.log(vis.x_keys)
        vis.x_keys.splice(0, 0, vis.x_keys[4])
        vis.x_keys.splice(2, 0, vis.x_keys[4])

        vis.x.domain(vis.x_keys)

        //creating axis labels
        vis.yAxis_group
            .append("text")
            .attr("fill", "black")
            .attr("transform", "translate(-50," + vis.height/2.5 + ") rotate(270)")
            .text("Number of Colleges")


        vis.xAxis_group.append("text")
            .attr("fill", "black")
            .attr("transform", "translate(" + vis.width/1.25 + 20 + ", 40)")
            .attr('class', 'x-label')
            .text("Size of Institution")

        vis.wrangleData();

    }

    wrangleData(){
        let vis = this;


        //counting number of universities based on their size
        vis.countbytype = d3.rollup(vis.displayData, leaves => leaves.length, d=> d['Institution size category'])
        console.log(vis.countbytype)

        //turning data into an array
        vis.databytype = Array.from(vis.countbytype, ([key, value]) => ({key, value}))


        console.log(vis.databytype)

        vis.updateVis();

    }
    updateVis(){
        let vis = this;

        //creating the y-domain based on the data-wrangling of number of universities
        vis.newset = new Set()
        vis.databytype.forEach(d => vis.newset.add(d.value))

        vis.y.domain([0, d3.max(vis.newset)])


        //console.log(d3.max(vis.newset))

        //drawing the bars for barchart
        vis.bars = vis.bar_group.selectAll('.bars')
            .data(vis.databytype)

        vis.bars.enter()
            .append("rect")
            .attr("class", "bars")
            .merge(vis.bars)
            .attr("height", d => vis.height/1.25 - vis.y(d.value))
            .attr("x", d => vis.x(d.key))
            .attr("y", d => vis.y(d.value))
            .attr("fill", "#a51890")
            .transition()
            .duration(200)
            .attr("width", vis.x.bandwidth())

        vis.bars.exit().remove();

        //creating the text labels for each bar in the bar charts
        vis.labels = vis.svg.selectAll(".labels")
            .data(vis.databytype)

        vis.labels.enter()
            .append("text")
            .attr("class", "labels")
            .merge(vis.labels)
            .attr("text-anchor", "middle")
            .transition()
            .duration(700)
            .attr("x", d => vis.x(d.key) + 94)
            .attr("y", d => vis.y(d.value) -10)
            .style("fill", "black")
            .text(d => d.value);

        vis.labels.exit().remove();

        //calling axes and modifying text

        vis.yAxis_group.call(vis.yAxis)

        vis.xAxis_group.call(vis.xAxis)

        vis.xAxis_group.selectAll('text:not(.x-label)')
            .attr('transform', 'translate(-27, 17) rotate(-30)')


    }

    onSelectionChange(selectionStart, selectionEnd){
        let vis = this;

        //filtering data based on scatterVis brushing
        vis.displayData = vis.data.filter(function (d){
            console.log(d)
            return d['AdmissionRate']*100 >= selectionStart && d['AdmissionRate']*100 <= selectionEnd;

        })

        vis.wrangleData()


    }


}