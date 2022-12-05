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
        //const formatPercentAxis = d3.format(".0%");

        //defining margins
        vis.colors = { Public: '#005670', Private: '#fe5000' };
        vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')



        vis.wrangleData();
    }


    wrangleData() {
        let vis = this
        console.log(vis.data)

        //filtering data by each state
        vis.selectedState = document.getElementById('state').value;
        console.log(vis.selectedState)

        let filteredData = vis.data.filter(d => vis.selectedState === d["State abbreviation_x"])
        vis.displayData = filteredData;
        console.log(vis.displayData)

        //finding min and maxes for radii scale
        let maxEndowment = d3.max(filteredData, d => +d['Endowment assets (year end) per FTE enrollment (FASB)']);
        let minEndowment = d3.min(filteredData, d => +d['Endowment assets (year end) per FTE enrollment (FASB)']);

        console.log(maxEndowment)
        console.log(minEndowment)


        vis.sizeScale = d3.scaleSqrt()
            .domain([minEndowment, maxEndowment])
            .range([5, 30]);

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // creating circles by each university
        vis.node_enter = vis.svg
            .selectAll("g.university")
            .data(vis.displayData, d => d['Unique identification number of the institution'])
            .enter()
            .append("g")
            .attr('class', 'university')

        //appending text to circles
        vis.node_enter
            .append("circle");
        vis.node_enter
            .append('text')
            .attr('class', 'text_name text_center');
        vis.node_enter
            .append('text')
            .attr('class', 'text_cnt text_center');
        // console.log(vis.node_enter);

        // update + enter + adding tooltip information
        vis.node = vis.svg
            .selectAll("g.university")
            .data(vis.displayData)
            .on('mouseover', function (event) {
                d3.select(this)
                    .select('circle')
                    //.attr('r', d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) + 20);
                    .attr('r', function (d) {
                        if (d["Control of institution_x"] === "Public") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (GASB)']) + 20);
                        }
                        else if (d["Control of institution_x"] === "Private not-for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) + 20);
                        }
                        else if (d["Control of institution_x"] === "Private for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) + 20);
                        }
                    });
                d3.select(this).selectAll('text')
                    .attr('opacity', 1)
                    .attr('font-size', function (d) {
                        if (d["Control of institution_x"] === "Public") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (GASB)']) / 2 + 8);
                        }
                        else if (d["Control of institution_x"] === "Private not-for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 + 8);
                        }
                        else if (d["Control of institution_x"] === "Private for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 + 8);
                        }
                    });
                d3.select(this).select('.text_name').attr("y", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 * 0.1 - 2);
                d3.select(this).select('.text_cnt').attr("y", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 * 1.9 + 2);

                const d = d3.select(this).data()[0]
                let endowment = ""
                if (d["Control of institution_x"] === "Public") {
                    endowment =  +d['Endowment assets (year end) per FTE enrollment (GASB)']
                }
                else if (d["Control of institution_x"] === "Private not-for-profit") {
                    endowment = +d['Endowment assets (year end) per FTE enrollment (FASB)']
                }
                else if (d["Control of institution_x"] === "Private for-profit") {
                    endowment = +d['Endowment assets (year end) per FTE enrollment (FASB)']
                }
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    // HELP: Fix HTML
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                         <h3>${d['Institution (entity) name']}<h3>
                          <h4>Endowment: $${d3.format(",")(endowment)}<h4>        
                     </div>`);
            })
            .on('mouseleave', function (event) {
                d3.select(this).select('circle')
                    .attr('r', function (d) {
                        if (d["Control of institution_x"] === "Public") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (GASB)']));
                        }
                        else if (d["Control of institution_x"] === "Private not-for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']));
                        }
                        else if (d["Control of institution_x"] === "Private for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']));
                        }
                    });
                d3.select(this).selectAll('text').attr('opacity', 0.5)
                    .attr('font-size', function (d) {
                        if (d["Control of institution_x"] === "Public") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (GASB)']) / 2);
                        }
                        else if (d["Control of institution_x"] === "Private not-for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2);
                        }
                        else if (d["Control of institution_x"] === "Private for-profit") {
                            return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2);
                        }
                    });
                d3.select(this).select('.text_name').attr("y", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 * 0.5 - 2);
                d3.select(this).select('.text_cnt').attr("y", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 * 1.5 + 2);

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        // exit - removing circles as filter
        vis.node.exit().remove();
        // console.log(vis.node.select('circle'));

        //scaling circles and filling based on endowment information
        vis.node.select('circle')
            .attr('r', function (d) {
                if (d["Control of institution_x"] === "Public") {
                    return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (GASB)']));
                }
                else if (d["Control of institution_x"] === "Private not-for-profit") {
                    return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']));
                }
                else if (d["Control of institution_x"] === "Private for-profit") {
                    return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']));
                }
            })
            // .attr("cx", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) * 40 / 2)
            // .attr("cy", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) * 40 / 2)
            .attr("fill", function (d, i) {
                //console.log(i, d)
                if (d["Control of institution_x"] === "Public") {
                    return "#005670";
                }
                else if (d["Control of institution_x"] === "Private not-for-profit") {
                    return '#fe5000';
                }
                else if (d["Control of institution_x"] === "Private for-profit") {
                    return '#fe5000';
                }
            })
            .style("fill-opacity", 0.3)
            .attr("stroke", function (d, i) {
                if (d["Control of institution_x"] === "Public") {
                    return "#005670";
                }
                else if (d["Control of institution_x"] === "Private not-for-profit") {
                    return '#fe5000';
                }
                else if (d["Control of institution_x"] === "Private for-profit") {
                    return '#fe5000';
                }
            })
            .style("stroke-width", 4);

        //appending text and fonts
        vis.node.select('text.text_name')
            .attr("x", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2)
            .attr("y", d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2 * 0.5 - 2)
            .text((d, i) => d['Institution (entity) name'])
            .attr("fill", "black")
            .attr('opacity', 0.5)
            //.attr('font-size', d => vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2);
            .attr('font-size', function (d) {
                if (d["Control of institution_x"] === "Public") {
                    return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (GASB)']) / 2);
                }
                else if (d["Control of institution_x"] === "Private not-for-profit") {
                    return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2);
                }
                else if (d["Control of institution_x"] === "Private for-profit") {
                    return (vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']) / 2);
                }
            });


        //packing the circles together on the screen
        vis.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(vis.width / 2).y(vis.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(0.4)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().radius(d => 40 + vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)']))); // Force that avoids circle overlapping

        vis.simulation
            .nodes(vis.displayData)
            .on("tick", function (d) {

                vis.node
                    .attr('transform', d => {
                        // console.log(`translate(${d.x-vis.scale(d.info[vis.cat])}, ${d.y-vis.scale(d.info[vis.cat])})`);
                        return `translate(${d.x - vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)'])}, ${d.y - vis.sizeScale(d['Endowment assets (year end) per FTE enrollment (FASB)'])})`
                    })
            });

        // Append legend boxes and text
        if (!vis.legend) {
            vis.legend = vis.svg.append("g")
                .attr('class', 'legend')

            vis.legend
                .append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", "#005670")
                .attr("transform", `translate(900,60)`)

            vis.legend
                .append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", '#fe5000')
                .attr("transform", `translate(900,100)`)

            vis.legend
                .append("text")
                .text("Public")
                .attr("transform", `translate(935,75)`)

            vis.legend
                .append("text")
                .text("Private")
                .attr("transform", `translate(935,115)`)
        }


    }
}