/*
 * CS171
 *
 * Bubble Vis
 *
 */

class BubbleVis {
    constructor(parentElement, controlsElement, econData, acsData, isIncome) {
        this.parentElement = parentElement;
        this.controlsElement = controlsElement;
        this.econData = econData;
        this.acsData = acsData;
        this.isIncome = isIncome

        this.initVis();
    }


    initVis() {
        let vis = this;
        const formatPercentAxis = d3.format(".0%");

        vis.colors = {Brooklyn: '#36C5F0', Bronx: '#6967CE', Manhattan: '#E01E5A', Quenns: '#2EB67D', Staten: '#ECB22E'};
        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // append tooltip
        vis.toolTip = d3.select("body").append('div')
            .attr('class', "toolTip");

        // Cirles to show colors of Bourough
        vis.svg.append("circle").attr("cx",vis.width - 175).attr("cy", vis.height*2/3).attr("r", 6).style("fill", vis.colors.Brooklyn).style('stroke', 'white')
        vis.svg.append("circle").attr("cx",vis.width - 175).attr("cy",  vis.height*2/3 + 30).attr("r", 6).style("fill", vis.colors.Bronx).style('stroke', 'white')
        vis.svg.append("circle").attr("cx",vis.width - 175).attr("cy", vis.height*2/3 + 60).attr("r", 6).style("fill", vis.colors.Manhattan).style('stroke', 'white')
        vis.svg.append("circle").attr("cx",vis.width - 175).attr("cy",  vis.height*2/3 + 90).attr("r", 6).style("fill", vis.colors.Quenns).style('stroke', 'white')
        vis.svg.append("circle").attr("cx",vis.width - 175).attr("cy",  vis.height*2/3 + 120).attr("r", 6).style("fill", vis.colors.Staten).style('stroke', 'white')

        // Labels for Circles
        vis.svg.append("text").attr("x", vis.width - 155).attr("y", vis.height*2/3).text("Brooklyn").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill', 'white')
        vis.svg.append("text").attr("x", vis.width - 155).attr("y",  vis.height*2/3 + 30).text("Bronx").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill', 'white')
        vis.svg.append("text").attr("x", vis.width - 155).attr("y", vis.height*2/3 + 60).text("Manhattan").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill', 'white')
        vis.svg.append("text").attr("x", vis.width - 155).attr("y",  vis.height*2/3 + 90).text("Queens").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill', 'white')
        vis.svg.append("text").attr("x", vis.width - 155).attr("y",  vis.height*2/3 +  120).text("Staten Island").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill', 'white')

        vis.wrangleData();
    }


    wrangleData() {
        let vis = this

        vis.displayData = []
        vis.borough;
        vis.sizeScale;
        vis.catagory;
        vis.Bronx;
        vis.name;
        vis.toolText;
        vis.boroughbtn;
        vis.combinebtn;

        if (vis.isIncome == true) {
            vis.displayData = vis.econData
            vis.borough = 'Borough';
            vis.catagory ='MdHHIncE';
            let maxIncome =  d3.max(vis.displayData, d =>+d['MdHHIncE']);
            let minIncome =  d3.min(vis.displayData, d =>+d['MdHHIncE']);
            vis.sizeScale = d3.scaleSqrt()
                .domain([minIncome, maxIncome])
                .range([1, 20]);
            vis.Bronx = 'The Bronx'
            vis.name = 'GeogName'
            vis.toolText = 'Median Income'
            vis.boroughbtn = '#borough-income'
            vis.combinebtn = '#combine-income'
        }
        else{
            vis.displayData = vis.acsData
            vis.borough = 'borough'
            vis.catagory = 'greater_than_50_percent_income_on_rent_p';
            let maxBurden = d3.max(vis.displayData, d =>+d['greater_than_50_percent_income_on_rent_p']);
            let minBurden =  d3.min(vis.displayData, d =>+d['greater_than_50_percent_income_on_rent_p']);
            vis.sizeScale = d3.scaleSqrt()
                .domain([minBurden, maxBurden])
                .range([1, 20]);
            vis.Bronx = 'Bronx'
            vis.name = 'nta_name'
            vis.toolText = 'Percentage Rent Burdened'
            vis.boroughbtn = '#borough-rent'
            vis.combinebtn = '#combine-rent'
        }

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        let forceXBorough = d3.forceX(function(d) {
            switch(d[vis.borough]) {
                case 'Brooklyn':
                    return vis.width / 4 - 20;
                case vis.Bronx:
                    return vis.width / 4 * 2;
                case 'Staten Island':
                    return vis.width / 4*3 + 10;
                case 'Manhattan':
                    return vis.width / 4 - 20 ;
                case 'Queens':
                    return vis.width / 4 * 2;
            }
        }).strength(0.5);

        let forceYBorough = d3.forceY(function(d) {
            switch(d[vis.borough]) {
                case 'Brooklyn':
                    return vis.height / 3 - 10;
                case vis.Bronx:
                    return vis.height / 3 -10;
                case 'Staten Island':
                    return vis.height / 3 -10;
                case 'Manhattan':
                    return vis.height / 3 * 2 + 50;
                case 'Queens':
                    return vis.height / 3 * 2 + 50;
            }
        }).strength(0.5);

        let forceXCombine = d3.forceX(vis.width / 2).strength(.2);

        let forceYCombine = d3.forceY(vis.height / 2).strength(.2)

        let forceCollide = d3.forceCollide(function(d){
            return vis.sizeScale(d[vis.catagory]) + 1
        });

        vis.simulation = d3.forceSimulation()
            .force('x', forceXCombine)
            .force('y', forceYCombine)
            .force('collide', forceCollide);

        let bubbles = vis.svg.selectAll('.bubbles')
            .data(vis.displayData)
            .enter().append('circle')
            .attr('class', 'bubbless')
            .attr("fill", function(d) {
                switch(d[vis.borough]) {
                    case 'Brooklyn':
                        return vis.colors.Brooklyn;
                    case vis.Bronx:
                        return vis.colors.Bronx;
                    case 'Staten Island':
                        return vis.colors.Staten;
                    case 'Manhattan':
                        return vis.colors.Manhattan;
                    case 'Queens':
                        return vis.colors.Quenns;
                }})
            .attr('opacity', 0.8)
            .attr('r', function(d) {
                return vis.sizeScale(d[vis.catagory])
            })
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke', 'white');

                vis.toolTip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                            <div class="toolTip" style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
                                <h6> Neighborhood: ${d[vis.name]} </h6>
                                <h7> ${vis.toolText}: ${d3.format('.0%')(d[vis.catagory])} </h7>
                            </div>`);

            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke', 'none');

                vis.toolTip
                    .style("left", 0)
                    .style("opacity", 0)
                    .style("top", 0)
                    .html(``);
            })

        d3.select(vis.boroughbtn).on('click', function() {
            vis.simulation
                .force('x', forceXBorough)
                .force('y', forceYBorough)
                .alphaTarget(0.05)
                .restart()
        })

        d3.select(vis.combinebtn).on('click', function() {
            vis.simulation
                .force('x', forceXCombine)
                .force('y',forceYCombine)
                .alphaTarget(0.05)
                .restart()
        })

        vis.simulation.nodes(vis.displayData)
            .on('tick', ticked)

        function ticked() {
            bubbles
                .attr('cx', function(d) {
                    return d.x
                })
                .attr('cy', function(d) {
                    return d.y;
                })
        }

    }

    show() {
        let vis = this;
        d3.select(`#${vis.parentElement}`).style('display', 'block');
        d3.select(`#${vis.controlsElement}`).style('display', 'block');
    }

    hide() {
        let vis = this;
        d3.select(`#${vis.parentElement}`).style('display', 'none');
        d3.select(`#${vis.controlsElement}`).style('display', 'none');
    }
}