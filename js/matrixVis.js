// MatrixMain()

class MatrixChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        // this.dataFilitered = [...data];
        this.displayData = {};

        // this.colors = {
        //     "white": "#ffffff",
        //     "lightest orange": "#ffaf99",
        //     "light orange": "#f93700ff",
        //     "orange": "#b32700",
        //     "dark orange": "#330b00",
        //     "black": "#191919ff",
        // }

        this.initVis();
    }


    // the function that recognize current section and call visualization function respectively
    initVis() {
        let vis = this;
        console.log(vis.data)
        /**common variables**/
        // Keep track of which visualization we are on and which was the last
        // index activated. When user scrolls quickly, we want to call all the
        // activate functions that they pass.
        //     vis.lastIndex = -1;
        //     vis.activeIndex = 0;
        //
        //     // vis.width = Math.min(document.documentElement.clientHeight,
        //     //     window.innerHeight,
        //     //     document.documentElement.clientWidth,
        //     //     window.innerWidth)*0.6;
        //     // vis.height = vis.width;
        //
        //     vis.width = $("#" + vis.parentElement).width() * 0.8;
        //     vis.height = $("#" + vis.parentElement).width() * 0.8;
        //
        //
        //     // Sizing for the grid visualization
        //     vis.numPerRow = 30;
        //     vis.numPerCol = 30;
        //
        //     vis.circleSize = Math.floor(vis.width / vis.numPerRow * 2 / 3);
        //     vis.circlePad = Math.floor(vis.width / vis.numPerRow / 3);
        //
        //     // constants to define the size and margins of the vis area.
        //     vis.margin = {top: vis.circleSize / 2, bottom: 0, left: vis.circleSize / 2, right: 0};
        //
        //     vis.relative = false;
        //
        //     vis.namelist = [];
        //
        //     vis.wrangleData();
        //
        // }
        //
        // // wrangle and parse data to fit visualization
        // wrangleData() {
        //     let vis = this;
        //     vis.updateVis();
        //
        // }
        //
        // updateVis(location) {
        //     let vis = this;
        //
        //     vis.plot = vis.scrollVis();
        //
        //     d3.select("#" + vis.parentElement)
        //         .datum(vis.displayData)
        //         .call(vis.plot);
        //
        //     // setup scroll functionality
        //     let scroll = scroller()
        //         .container(d3.select('#floatingarea'));
        //
        //     // pass in .step selection as the steps
        //     scroll(d3.selectAll('.step'));
        //
        //     // setup event handling
        //     scroll.on('active', function (index) {
        //         // highlight current step text
        //         d3.selectAll('.step')
        //             .style('opacity', function (d, i) {
        //                 return i === index ? 1 : 0.1;
        //             });
        //
        //         // activate current section
        //         vis.plot.activate(index);
        //     });
        // }
        //
        //
        // //Main function, update visualization upon scrolling
        // scrollVis() {
        //     let vis = this;
        //
        //     let matrixData = vis.displayData;
        //
        //     let svg = d3.select("#" + vis.parentElement);
        //
        //     svg.append("defs")
        //         .append("g")
        //         .attr("id", "iconCustom")
        //         .append("path")
        //         .attr("d", "M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
        //
        //
        //     // d3 selection that will be used for displaying visualizations
        //     let g;
        //
        //     // When scrolling to a new section the activation function for that section is called.
        //     const activateFunctions = [];
        //
        //     // If a section has an update function then it is called while scrolling
        //     // through the section with the current    // progress through the section.
        //     const updateFunctions = [];
        //
        //     /**chart**/
        // }
    }
}

//         let chart = function (selection) {
//             selection.each(function (matrixData) {
//                 svg = d3.select(this).selectAll('svg').data([matrixData.prevalence]);
//                 let svgE = svg.enter().append('svg');
//                 // @v4 use merge to combine enter and existing selection
//                 svg = svg.merge(svgE);
//
//                 svg.attr('width', vis.width);
//                 svg.attr('height', vis.height);
//
//                 svg.append('g');
//
//
//                 // this group element will be used to contain all
//                 // other elements.
//                 g = svg.select('g')
//                     .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');
//
//                 setupVis(matrixData);
//
//                 setupSections();
//             });
//         };
//
//         let circles;
//         let crossH;
//         let crossW;
//         let humans;
//
//         let label;
//
//         /*****  setupVis - creates initial elements for all sections of the visualization.*/
//         let setupVis = function (matrixData) {
//             console.log(matrixData['Institution (entity) name'])
//             let firstdata = matrixData["prevalence"];
//
//
//             humans = g.selectAll('.matrix-symbol-human')
//                 .data(firstdata)
//                 .enter()
//                 .append('text')
//                 .attr('class','matrix-symbol-human')
//                 .attr('y',function (d, i) {
//                     console.log("HI");
//                     let row =Math.floor( i / vis.numPerRow);
//                     return (row*vis.circleSize)+(row*vis.circlePad) + 6;
//                 })
//                 .attr('x',function (d, i)
//                 {
//                     let col = i%vis.numPerRow;
//                     return (col*vis.circleSize) +(col*vis.circlePad) -4;
//                 })
//                 .attr("class", "fa")
//                 .html(function(d) { return '\uf007' })
//                 .attr('fill',vis.colors.white)
//                 .attr('opacity', 0.1);
//
//         };
//
//         let setupSections = function () {
//             // activateFunctions are called each
//             // time the active section changes
//             activateFunctions[0] = showGrid;
//             activateFunctions[1] = highlightPre;
//             activateFunctions[2] = highlightAge;
//             activateFunctions[3] = highlightGender;
//             // activateFunctions[4] = highlightInsurance;
//             // activateFunctions[5] = highlightTreatment;
//             // activateFunctions[6] = highlightLocation;
//
//
//
//             activateFunctions[4] = highlightTreatment;
//             activateFunctions[5] = highlightLocation;
//
//             // updateFunctions are called while in a particular section to update
//             // the scroll progress in that section. Most sections do not need to be updated
//             // for all scrolling and so are set to no-op functions.
//             for (let i = 0; i < 9; i++) {
//                 updateFunctions[i] = function () {};
//             }
//         };
//
//         function showGrid() {
//             // circles
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(800)
//             //     .attr('opacity', function(d,i){
//             //         return i*0.001+0.2
//             //     })
//             //     .attr("fill", vis.colors.white);
//             // crossW.transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(800)
//             //     .attr('opacity', function(d,i){
//             //         return i*0.001+0.2
//             //     })
//             //     .attr("fill", vis.colors.white);
//             // crossH.transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(800)
//             //     .attr('opacity', function(d,i){
//             //         return i*0.001+0.2
//             //     })
//             //     .attr("fill", vis.colors.white);
//
//             humans.transition()
//                 .delay(function (d,i) {
//                     return 20 * getrownum(i);
//                 })
//                 .duration(800)
//                 .attr('opacity', function(d,i){
//                     return i*0.001+0.2
//                 })
//                 .attr("fill", vis.colors.white);
//
//         }
//
//         function getrownum(i){
//             return Math.floor( i / vis.numPerRow);
//         }
//
//         function highlightPre(index) {
//             humans
//                 .data(matrixData["prevalence"])
//                 .classed('age-circle', true)
//                 .transition()
//                 .delay(function (d, i) {
//                     return 15 * getrownum(i);
//                 })
//                 .duration(600)
//                 .attr("opacity", 1)
//                 .attr("fill", function (d) {
//                     if (d.index == 0) {
//                         return vis.colors.white;
//                     } else if (d.index == 1) {
//                         return vis.colors["lightest orange"];
//                     } else if (d.index == 2) {
//                         return vis.colors["light orange"];
//                     } else {
//                         return vis.colors["orange"];
//                     }
//                 })
//             // crossW
//             //     .data(matrixData["prevalence"])
//             //     .classed('age-circle', true)
//             //     .transition()
//             //     .delay(function (d, i) {
//             //         return 15 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d) {
//             //         if (d.index == 0) {
//             //             return vis.colors.white;
//             //         } else if (d.index == 1) {
//             //             return vis.colors["lightest orange"];
//             //         } else if (d.index == 2) {
//             //             return vis.colors["light orange"];
//             //         } else {
//             //             return vis.colors["orange"];
//             //         }
//             //     });
//             //
//             // crossH
//             //     .data(matrixData["prevalence"])
//             //     .classed('age-circle', true)
//             //     .transition()
//             //     .delay(function (d, i) {
//             //         return 15 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d) {
//             //         if (d.index == 0) {
//             //             return vis.colors.white;
//             //         } else if (d.index == 1) {
//             //             return vis.colors["lightest orange"];
//             //         } else if (d.index == 2) {
//             //             return vis.colors["light orange"];
//             //         } else {
//             //             return vis.colors["orange"];
//             //         }
//             //     })
//         }
//
//         function highlightAge() {
//             humans
//                 .data(matrixData["age"])
//                 .classed('age-circle',true)
//                 .transition()
//                 .delay(function (d,i) {
//                     return 12 * getrownum(i);
//                 })
//                 .duration(600)
//                 .attr("opacity", 1)
//                 .attr("fill", function (d){
//                     if(d.index == 0){
//                         return vis.colors["lightest orange"];
//                     } else if(d.index == 1){
//                         return vis.colors["light orange"];
//                     } else if(d.index == 2){
//                         return vis.colors["orange"];
//                     } else {
//                         return vis.colors["black"];
//                     }
//                 })
//
//             // crossW
//             //     .data(matrixData["age"])
//             //     .classed('age-circle',true)
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 12 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return vis.colors["lightest orange"];
//             //         } else if(d.index == 1){
//             //             return vis.colors["light orange"];
//             //         } else if(d.index == 2){
//             //             return vis.colors["orange"];
//             //         } else {
//             //             return vis.colors["dark orange"];
//             //         }
//             //     })
//             //
//             // crossH
//             //     .data(matrixData["age"])
//             //     .classed('age-circle',true)
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 12 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return vis.colors["lightest orange"];
//             //         } else if(d.index == 1){
//             //             return vis.colors["light orange"];
//             //         } else if(d.index == 2){
//             //             return vis.colors["orange"];
//             //         } else {
//             //             return vis.colors["dark orange"];
//             //         }
//             //     })
//
//
//         }
//
//
//
//         function highlightGender() {
//             humans
//                 .data(matrixData["gender"])
//                 .transition()
//                 .delay(function (d,i) {
//                     return 15 * getrownum(i);
//                 })
//                 .duration(600)
//                 .attr("opacity", 1)
//                 .attr("fill", function (d){
//                     if(d.index == 0){
//                         return vis.colors["light orange"];
//                     }
//                     else {
//                         return vis.colors["dark orange"];
//                     }
//                 })
//
//             // crossW
//             //     .data(matrixData["gender"])
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 15 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return vis.colors["orange"];
//             //         }
//             //         else {
//             //             return vis.colors["dark orange"];
//             //         }
//             //     })
//             //
//             //
//             // crossH
//             //     .data(matrixData["gender"])
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 15 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return vis.colors["orange"];
//             //         }
//             //         else {
//             //             return vis.colors["dark orange"];
//             //         }
//             //     })
//         }
//
//         // function highlightInsurance() {
//         //     circles
//         //         .data([...matrixData["insurance"], {"index": 3}])
//         //         .transition()
//         //         .delay(function (d,i) {
//         //             return 15 * getrownum(i);
//         //         })
//         //         .duration(600)
//         //         .attr("opacity", 1)
//         //         .attr("fill", function (d){
//         //             if(d.index == 0){
//         //                 return vis.colors["lightest orange"];
//         //             } else if(d.index == 1){
//         //                 return vis.colors["light orange"];
//         //             } else if(d.index == 2){
//         //                 return vis.colors["orange"];
//         //             } else {
//         //                 return vis.colors["dark orange"];
//         //             }
//         //         })
//         // }
//
//         function highlightTreatment() {
//
//             humans
//                 .data(matrixData["treatment"])
//                 // .classed('age-circle',true)
//                 .transition()
//                 .delay(function (d,i) {
//                     return 20 * getrownum(i);
//                 })
//                 .duration(600)
//                 .attr("opacity", 1)
//                 .attr("fill", function (d){
//                     if(d.index == 0){
//                         return  vis.colors["white"];
//                     }
//                     else {
//                         return vis.colors["orange"];
//
//                     }
//                 })
//
//             // crossH
//             //     .data(matrixData["treatment"])
//             //     // .classed('age-circle',true)
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return  vis.colors["white"];
//             //         }
//             //         else {
//             //             return vis.colors["orange"];
//             //
//             //         }
//             //     })
//             //
//             // crossW
//             //     .data(matrixData["treatment"])
//             //     // .classed('age-circle',true)
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return  vis.colors["white"];
//             //         }
//             //         else {
//             //             return vis.colors["orange"];
//             //
//             //         }
//             //     })
//         }
//
//         function highlightLocation() {
//             // create way to show other location if have time!
//             humans
//                 .data(matrixData["Self-Help Group"])
//                 //.classed('age-circle',true)
//                 .transition()
//                 .delay(function (d,i) {
//                     return 20 * getrownum(i);
//                 })
//                 .duration(600)
//                 .attr("opacity", 1)
//                 .attr("fill", function (d){
//                     if(d.index == 0){
//                         return "#ffffff";
//                     }
//                     else {
//                         return vis.colors["light orange"];
//                     }
//                 })
//
//             // crossH
//             //     .data(matrixData["Self-Help Group"])
//             //     //.classed('age-circle',true)
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return "#ffffff";
//             //         }
//             //         else {
//             //             return vis.colors["light orange"];
//             //         }
//             //     })
//             //
//             // crossW
//             //     .data(matrixData["Self-Help Group"])
//             //     //.classed('age-circle',true)
//             //     .transition()
//             //     .delay(function (d,i) {
//             //         return 20 * getrownum(i);
//             //     })
//             //     .duration(600)
//             //     .attr("opacity", 1)
//             //     .attr("fill", function (d){
//             //         if(d.index == 0){
//             //             return "#ffffff";
//             //         }
//             //         else {
//             //             return vis.colors["light orange"];
//             //         }
//             //     })
//         }
//
//         chart.activate = function (index) {
//             vis.activeIndex = index;
//             let sign = (vis.activeIndex - vis.lastIndex) < 0 ? -1 : 1;
//             let scrolledSections = d3.range(vis.lastIndex + sign, vis.activeIndex + sign, sign);
//             scrolledSections.forEach(function (i) {
//                 activateFunctions[i](index);
//             });
//             vis.lastIndex = vis.activeIndex;
//         };
//
//
//         chart.update = function (index, progress) {
//             updateFunctions[index](progress);
//         };
//
//         return chart;
//     };
//
// }
//
// function scroller() {
//     var container = d3.select('#section8');
//     // event dispatcher
//     var dispatch = d3.dispatch('active', 'progress');
//
//     // d3 selection of all the
//     // text sections that will
//     // be scrolled through
//     var sections = null;
//
//     // array that will hold the
//     // y coordinate of each section
//     // that is scrolled through
//     var sectionPositions = [];
//     var currentIndex = -1;
//     // y coordinate of
//     var containerStart = 0;
//
//     /**
//      * scroll - constructor function.
//      * Sets up scroller to monitor
//      * scrolling of els selection.
//      *
//      * @param els - d3 selection of
//      *  elements that will be scrolled
//      *  through by user.
//      */
//     function scroll(els) {
//         sections = els;
//
//         // when window is scrolled call
//         // position. When it is resized
//         // call resize.
//         d3.select(window)
//             .on('scroll.scroller', position)
//             .on('resize.scroller', resize);
//
//         // manually call resize
//         // initially to setup
//         // scroller.
//         resize();
//
//         // hack to get position
//         // to be called once for
//         // the scroll position on
//         // load.
//         // @v4 timer no longer stops if you
//         // return true at the end of the callback
//         // function - so here we stop it explicitly.
//         var timer = d3.timer(function () {
//             position();
//             timer.stop();
//         });
//     }
//
//     /**
//      * resize - called initially and
//      * also when page is resized.
//      * Resets the sectionPositions
//      *
//      */
//     function resize() {
//         // sectionPositions will be each sections
//         // starting position relative to the top
//         // of the first section.
//         sectionPositions = [];
//         var startPos;
//         sections.each(function (d, i) {
//             var top = this.getBoundingClientRect().top;
//             if (i === 0) {
//                 startPos = top;
//             }
//             sectionPositions.push(top - startPos);
//         });
//         containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
//     }
//
//     /**
//      * position - get current users position.
//      * if user has scrolled to new section,
//      * dispatch active event with new section
//      * index.
//      *
//      */
//     function position() {
//         var pos = window.pageYOffset - 10 - containerStart;
//         var sectionIndex = d3.bisect(sectionPositions, pos);
//         sectionIndex = Math.min(sections.size() - 1, sectionIndex);
//
//         if (currentIndex !== sectionIndex) {
//             // @v4 you now `.call` the dispatch callback
//             dispatch.call('active', this, sectionIndex);
//             currentIndex = sectionIndex;
//         }
//
//         var prevIndex = Math.max(sectionIndex - 1, 0);
//         var prevTop = sectionPositions[prevIndex];
//         var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
//         // @v4 you now `.call` the dispatch callback
//         dispatch.call('progress', this, currentIndex, progress);
//     }
//
//     /**
//      * container - get/set the parent element
//      * of the sections. Useful for if the
//      * scrolling doesn't start at the very top
//      * of the page.
//      *
//      * @param value - the new container value
//      */
//     scroll.container = function (value) {
//         if (arguments.length === 0) {
//             return container;
//         }
//         container = value;
//         return scroll;
//     };
//
//     // @v4 There is now no d3.rebind, so this implements
//     // a .on method to pass in a callback to the dispatcher.
//     scroll.on = function (action, callback) {
//         dispatch.on(action, callback);
//     };
//
//     return scroll;
// }