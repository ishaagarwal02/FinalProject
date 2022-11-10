// MatrixMain()

class MatrixChart
{
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.dataFilitered = [...data];
        this.displayData = {};

        this.colors = {
            "white": "#ffffff",
            "lightest orange": "#ffaf99",
            "light orange": "#f93700ff",
            "orange": "#b32700",
            "dark orange": "#330b00",
            "black": "#191919ff",
        }

        this.initVis();
    }


    // the function that recognize current section and call visualization function respectively
    initVis(data) {
        let vis = this;

        /**common variables**/
        // Keep track of which visualization we are on and which was the last
        // index activated. When user scrolls quickly, we want to call all the
        // activate functions that they pass.
        vis.lastIndex = -1;
        vis.activeIndex = 0;

        // vis.width = Math.min(document.documentElement.clientHeight,
        //     window.innerHeight,
        //     document.documentElement.clientWidth,
        //     window.innerWidth)*0.6;
        // vis.height = vis.width;

        vis.width = $("#" + vis.parentElement).width()*0.8;
        vis.height = $("#" + vis.parentElement).width()*0.8;



        // Sizing for the grid visualization
        vis.numPerRow = 30;
        vis.numPerCol = 30;

        vis.circleSize = Math.floor(vis.width/vis.numPerRow*2/3);
        vis.circlePad =  Math.floor(vis.width/vis.numPerRow/3);

        // constants to define the size and margins of the vis area.
        vis.margin = { top: vis.circleSize/2, bottom: 0, left: vis.circleSize/2, right: 0 };

        vis.relative = false;

        vis.namelist = [];

        vis.wrangleData();

    }

    // wrangle and parse data to fit visualization
    wrangleData()
    {
        let vis = this;


        vis.updateVis();

    }

    updateVis(location) {
        let vis = this;

        vis.plot = vis.scrollVis();

        d3.select("#" + vis.parentElement)
            .datum(vis.displayData)
            .call(vis.plot);

        // setup scroll functionality
        let scroll = scroller()
            .container(d3.select('#floatingarea'));

        // pass in .step selection as the steps
        scroll(d3.selectAll('.step'));

        // setup event handling
        scroll.on('active', function (index) {
            // highlight current step text
            d3.selectAll('.step')
                .style('opacity', function (d, i) {
                    return i === index ? 1 : 0.1;
                });

            // activate current section
            vis.plot.activate(index);
        });
    }



    //Main function, update visualization upon scrolling
    scrollVis() {
        let vis = this;

        let matrixData = vis.displayData;

        let svg = d3.select("#"+vis.parentElement);

        svg.append("defs")
            .append("g")
            .attr("id","iconCustom")
            .append("path")
            .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");


        // d3 selection that will be used for displaying visualizations
        let g;

        // When scrolling to a new section the activation function for that section is called.
        const activateFunctions = [];

        // If a section has an update function then it is called while scrolling
        // through the section with the current    // progress through the section.
        const updateFunctions = [];

        /**chart**/

        let chart = function (selection) {
            selection.each(function (matrixData) {
                svg = d3.select(this).selectAll('svg').data([matrixData.prevalence]);
                let svgE = svg.enter().append('svg');
                // @v4 use merge to combine enter and existing selection
                svg = svg.merge(svgE);

                svg.attr('width', vis.width);
                svg.attr('height', vis.height);

                svg.append('g');


                // this group element will be used to contain all
                // other elements.
                g = svg.select('g')
                    .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');

                setupVis(matrixData);

                setupSections();
            });
        };

        let circles;
        let crossH;
        let crossW;
        let humans;

        let label;

        /*****  setupVis - creates initial elements for all sections of the visualization.*/
        let setupVis = function (matrixData) {

            let firstdata = matrixData["prevalence"];


            humans = g.selectAll('.matrix-symbol-human')
                .data(firstdata)
                .enter()
                .append('text')
                .attr('class','matrix-symbol-human')
                .attr('y',function (d, i) {
                    console.log("HI");
                    let row =Math.floor( i / vis.numPerRow);
                    return (row*vis.circleSize)+(row*vis.circlePad) + 6;
                })
                .attr('x',function (d, i)
                {
                    let col = i%vis.numPerRow;
                    return (col*vis.circleSize) +(col*vis.circlePad) -4;
                })
                .attr("class", "fa")
                .html(function(d) { return '\uf007' })
                .attr('fill',vis.colors.white)
                .attr('opacity', 0.1);

        };

        let setupSections = function () {
            // activateFunctions are called each
            // time the active section changes
            activateFunctions[0] = showGrid;
            activateFunctions[1] = highlightPre;
            activateFunctions[2] = highlightAge;
            activateFunctions[3] = highlightGender;
            // activateFunctions[4] = highlightInsurance;
            // activateFunctions[5] = highlightTreatment;
            // activateFunctions[6] = highlightLocation;



            activateFunctions[4] = highlightTreatment;
            activateFunctions[5] = highlightLocation;

            // updateFunctions are called while in a particular section to update
            // the scroll progress in that section. Most sections do not need to be updated
            // for all scrolling and so are set to no-op functions.
            for (let i = 0; i < 9; i++) {
                updateFunctions[i] = function () {};
            }
        };

        function showGrid() {
            // circles
            //     .transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(800)
            //     .attr('opacity', function(d,i){
            //         return i*0.001+0.2
            //     })
            //     .attr("fill", vis.colors.white);
            // crossW.transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(800)
            //     .attr('opacity', function(d,i){
            //         return i*0.001+0.2
            //     })
            //     .attr("fill", vis.colors.white);
            // crossH.transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(800)
            //     .attr('opacity', function(d,i){
            //         return i*0.001+0.2
            //     })
            //     .attr("fill", vis.colors.white);

            humans.transition()
                .delay(function (d,i) {
                    return 20 * getrownum(i);
                })
                .duration(800)
                .attr('opacity', function(d,i){
                    return i*0.001+0.2
                })
                .attr("fill", vis.colors.white);

        }

        function getrownum(i){
            return Math.floor( i / vis.numPerRow);
        }

        function highlightPre(index) {
            humans
                .data(matrixData["prevalence"])
                .classed('age-circle', true)
                .transition()
                .delay(function (d, i) {
                    return 15 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", 1)
                .attr("fill", function (d) {
                    if (d.index == 0) {
                        return vis.colors.white;
                    } else if (d.index == 1) {
                        return vis.colors["lightest orange"];
                    } else if (d.index == 2) {
                        return vis.colors["light orange"];
                    } else {
                        return vis.colors["orange"];
                    }
                })
            // crossW
            //     .data(matrixData["prevalence"])
            //     .classed('age-circle', true)
            //     .transition()
            //     .delay(function (d, i) {
            //         return 15 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d) {
            //         if (d.index == 0) {
            //             return vis.colors.white;
            //         } else if (d.index == 1) {
            //             return vis.colors["lightest orange"];
            //         } else if (d.index == 2) {
            //             return vis.colors["light orange"];
            //         } else {
            //             return vis.colors["orange"];
            //         }
            //     });
            //
            // crossH
            //     .data(matrixData["prevalence"])
            //     .classed('age-circle', true)
            //     .transition()
            //     .delay(function (d, i) {
            //         return 15 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d) {
            //         if (d.index == 0) {
            //             return vis.colors.white;
            //         } else if (d.index == 1) {
            //             return vis.colors["lightest orange"];
            //         } else if (d.index == 2) {
            //             return vis.colors["light orange"];
            //         } else {
            //             return vis.colors["orange"];
            //         }
            //     })
        }

        function highlightAge() {
            humans
                .data(matrixData["age"])
                .classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 12 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", 1)
                .attr("fill", function (d){
                    if(d.index == 0){
                        return vis.colors["lightest orange"];
                    } else if(d.index == 1){
                        return vis.colors["light orange"];
                    } else if(d.index == 2){
                        return vis.colors["orange"];
                    } else {
                        return vis.colors["black"];
                    }
                })

            // crossW
            //     .data(matrixData["age"])
            //     .classed('age-circle',true)
            //     .transition()
            //     .delay(function (d,i) {
            //         return 12 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return vis.colors["lightest orange"];
            //         } else if(d.index == 1){
            //             return vis.colors["light orange"];
            //         } else if(d.index == 2){
            //             return vis.colors["orange"];
            //         } else {
            //             return vis.colors["dark orange"];
            //         }
            //     })
            //
            // crossH
            //     .data(matrixData["age"])
            //     .classed('age-circle',true)
            //     .transition()
            //     .delay(function (d,i) {
            //         return 12 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return vis.colors["lightest orange"];
            //         } else if(d.index == 1){
            //             return vis.colors["light orange"];
            //         } else if(d.index == 2){
            //             return vis.colors["orange"];
            //         } else {
            //             return vis.colors["dark orange"];
            //         }
            //     })


        }



        function highlightGender() {
            humans
                .data(matrixData["gender"])
                .transition()
                .delay(function (d,i) {
                    return 15 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", 1)
                .attr("fill", function (d){
                    if(d.index == 0){
                        return vis.colors["light orange"];
                    }
                    else {
                        return vis.colors["dark orange"];
                    }
                })

            // crossW
            //     .data(matrixData["gender"])
            //     .transition()
            //     .delay(function (d,i) {
            //         return 15 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return vis.colors["orange"];
            //         }
            //         else {
            //             return vis.colors["dark orange"];
            //         }
            //     })
            //
            //
            // crossH
            //     .data(matrixData["gender"])
            //     .transition()
            //     .delay(function (d,i) {
            //         return 15 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return vis.colors["orange"];
            //         }
            //         else {
            //             return vis.colors["dark orange"];
            //         }
            //     })
        }

        // function highlightInsurance() {
        //     circles
        //         .data([...matrixData["insurance"], {"index": 3}])
        //         .transition()
        //         .delay(function (d,i) {
        //             return 15 * getrownum(i);
        //         })
        //         .duration(600)
        //         .attr("opacity", 1)
        //         .attr("fill", function (d){
        //             if(d.index == 0){
        //                 return vis.colors["lightest orange"];
        //             } else if(d.index == 1){
        //                 return vis.colors["light orange"];
        //             } else if(d.index == 2){
        //                 return vis.colors["orange"];
        //             } else {
        //                 return vis.colors["dark orange"];
        //             }
        //         })
        // }

        function highlightTreatment() {

            humans
                .data(matrixData["treatment"])
                // .classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 20 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", 1)
                .attr("fill", function (d){
                    if(d.index == 0){
                        return  vis.colors["white"];
                    }
                    else {
                        return vis.colors["orange"];

                    }
                })

            // crossH
            //     .data(matrixData["treatment"])
            //     // .classed('age-circle',true)
            //     .transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return  vis.colors["white"];
            //         }
            //         else {
            //             return vis.colors["orange"];
            //
            //         }
            //     })
            //
            // crossW
            //     .data(matrixData["treatment"])
            //     // .classed('age-circle',true)
            //     .transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return  vis.colors["white"];
            //         }
            //         else {
            //             return vis.colors["orange"];
            //
            //         }
            //     })
        }

        function highlightLocation() {
            // create way to show other location if have time!
            humans
                .data(matrixData["Self-Help Group"])
                //.classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 20 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", 1)
                .attr("fill", function (d){
                    if(d.index == 0){
                        return "#ffffff";
                    }
                    else {
                        return vis.colors["light orange"];
                    }
                })

            // crossH
            //     .data(matrixData["Self-Help Group"])
            //     //.classed('age-circle',true)
            //     .transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return "#ffffff";
            //         }
            //         else {
            //             return vis.colors["light orange"];
            //         }
            //     })
            //
            // crossW
            //     .data(matrixData["Self-Help Group"])
            //     //.classed('age-circle',true)
            //     .transition()
            //     .delay(function (d,i) {
            //         return 20 * getrownum(i);
            //     })
            //     .duration(600)
            //     .attr("opacity", 1)
            //     .attr("fill", function (d){
            //         if(d.index == 0){
            //             return "#ffffff";
            //         }
            //         else {
            //             return vis.colors["light orange"];
            //         }
            //     })
        }

        chart.activate = function (index) {
            vis.activeIndex = index;
            let sign = (vis.activeIndex - vis.lastIndex) < 0 ? -1 : 1;
            let scrolledSections = d3.range(vis.lastIndex + sign, vis.activeIndex + sign, sign);
            scrolledSections.forEach(function (i) {
                activateFunctions[i](index);
            });
            vis.lastIndex = vis.activeIndex;
        };


        chart.update = function (index, progress) {
            updateFunctions[index](progress);
        };

        return chart;
    };

}