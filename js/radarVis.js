/* * * * * * * * * * * * * *
*          RadarVis          *
* * * * * * * * * * * * * */

class RadarVis{
    constructor(parentElement, collegeData){
        this.parentElement = parentElement;
        this.collegeData = collegeData;
        this.displayData = [];

        this.initVis()
    }
    initVis(){
        let vis = this;

        //defining margins
        vis.margin = {top: 30, right: 10, bottom: 30, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //defining extra distance variables based on svg
        vis.center = {'x': vis.width / 2, 'y': vis.height /2}
        vis.edge_length = vis.width/4
        vis.text_buffer = vis.edge_length/5
       // console.log(vis.edge_length)

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        //creating groups
        vis.circle_group = vis.svg.append('g').attr('class', 'circle_group')
            .attr('transform', `translate (${vis.center.x}, ${vis.center.y})`);

        vis.axes_group = vis.svg.append('g').attr('class', 'axes_group')
            .attr('transform', `translate (${vis.center.x}, ${vis.center.y})`);

        vis.dots_group = vis.svg.append('g').attr('class', 'dots_group')
            .attr('transform', `translate (${vis.center.x}, ${vis.center.y})`);

        vis.polygon_group = vis.svg.append('g').attr('class', 'polygon_group')
            .attr('transform', `translate (${vis.center.x}, ${vis.center.y})`);


        vis.ticks = d3.range( vis.edge_length/5, vis.edge_length+vis.edge_length/5, vis.edge_length/5)

        vis.circles = vis.circle_group.selectAll('.circles').data(vis.ticks)

        //drawing circle axes and adding the precentage labels
        vis.circles.enter().append('circle').attr('class', 'circles')
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", d => d)
            .attr("id", (d,i) => "axis_"+i)

        vis.circle_labels = vis.circle_group.selectAll('.circle-text').data(vis.ticks)

        vis.circle_labels.enter().append('text').attr('class', 'circle-text').attr('x', 6)
            .attr('y', d => -d-4)
            .text((d,i) => (20*(i+1)).toString()+'%')


        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;

        //grabbing information we want for the axes
        vis.displayData =  vis.collegeData.map(function(d){
            return {
                name: d['Institution (entity) name'],
                '% on Financial Aid': +d['Percent of freshmen receiving any financial aid'],
                '% Female': +d['Percent of undergraduate enrollment that are women'],
                '% In-State': +d['Percent of first-time undergraduates - in-state'],
                'Admissions Yield': +d['Admissions yield - total'],
                'Admissions Rate': +d['AdmissionRate'] * 100}
        })
      //  console.log(vis.displayData)
        //count has one extra because of the name so subtracting that off
        vis.count = Object.keys(vis.displayData[0]).length-1

        vis.angles = d3.range(vis.count).map(i => i*2*Math.PI / vis.count);

        vis.list_of_ranges = []

        //did this originally to grab ranges, but now am just using to store keys
        for (let j = 0; j < vis.count; j++){
            //gives the value of each key for one school.
            //console.log(Object.keys(vis.displayData[0])[j+1])
            let key = Object.keys(vis.displayData[0])[j+1];
           // console.log(key)
            let range = d3.extent(vis.displayData.map((function (d){
                return (d[key])
            })))
            let key_range = {
                "key": key,
                "range": range
            }
            vis.list_of_ranges.push(key_range)

            //console.log(list_of_ranges)
        }

        vis.updateVis();

    }

    updateVis(){
        let vis = this;
        vis.draw_axes();

        //creating data structure for the sliders to pull information
        vis.slider_data = vis.angles.map(
            (rads, i) => {
                return {
                    'feature': vis.list_of_ranges[i].key,
                    'value': 6,
                    'rank': i+1
                }
            }
        )
        console.log(vis.slider_data)

        //drawing dots on the axes
        vis.dots = vis.dots_group.selectAll('.vertices').data(vis.slider_data)

        vis.dots.enter().append('circle').attr('class', 'vertices')
            .attr('cx', function(d,i){
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                //the 10 gives the max value of the line.
                let line_coordinate = vis.angleToCoordinate(angle, vis.edge_length)
                return line_coordinate.x
            })
            .attr('cy', function(d,i){
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                //the 10 gives the max value of the line.
                let line_coordinate = vis.angleToCoordinate(angle, vis.edge_length)
                return line_coordinate.y
            })
            .attr('fill', 'black')
            .attr('r', 10)
            .attr('id', (d,i) => 'circle_'+i)
            .call(d3.drag()
                .on('start', dragstart)
                .on('end', dragend)
                .on('drag', dragmove))

        //allowing for drag events
        function dragstart(event,d){
            let circle = d3.select(this)
            circle.attr('stroke', 'red').attr('opacity', '0.5');
           // console.log('hello', this)
        }
        function dragend(event,d){
            let circle = d3.select(this);
            circle.attr('stroke', 'none').attr('opacity', '1');
            vis.circle_index = +circle.attr('id').replace("circle_", "")

            vis.angle = (Math.PI / 2) + (2 * Math.PI * vis.circle_index / vis.count)
            vis.r_dist = vis.edge_length/5

            //forcing the dots to only land on the intersections of the circles and axes

            vis.r = Math.sqrt(event.x**2 + event.y**2)
            vis.closest_r = Math.min(Math.round(vis.r / vis.r_dist) * vis.r_dist, 5 * vis.r_dist)
            vis.new_pos = vis.angleToCoordinate(vis.angle, vis.closest_r)

            d.value = Math.round(vis.closest_r / vis.edge_length *5);

            //moving the circle
            circle.attr("cx", vis.new_pos.x)
                .attr("cy", vis.new_pos.y)

            vis.createOutput()

        }

        function dragmove(event,d){
            let circle = d3.select(this);
            vis.circle_index = +circle.attr('id').replace("circle_", "")

            vis.angle = (Math.PI / 2) + (2 * Math.PI * vis.circle_index / vis.count)
            vis.r_dist = vis.edge_length/5

            vis.r = Math.sqrt(event.x**2 + event.y**2)
            vis.closest_r = Math.min(Math.round(vis.r / vis.r_dist) * vis.r_dist, 5 * vis.r_dist)

            vis.new_pos = vis.angleToCoordinate(vis.angle, vis.closest_r)

             circle.attr("cx", event.x)
                .attr("cy", event.y)

        }
    }
    draw_axes(){
        let vis = this;
        //plotting axes within the circles.
        vis.axes = vis.axes_group.selectAll('.lines').data(vis.list_of_ranges)

        vis.axes.enter().append('line').attr('class', 'lines')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', function(d,i){
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                let line_coordinate = vis.angleToCoordinate(angle, vis.edge_length)
                return line_coordinate.x
            })
            .attr('y2', function(d,i){
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                let line_coordinate = vis.angleToCoordinate(angle, vis.edge_length)
                return line_coordinate.y
            })
            .attr('stroke', 'black')

        //adding axes labels
        vis.axes.enter().append('text').attr('class', 'line_text')
            .attr('x', function(d,i){
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                //the 10 gives the max value of the line.
                let line_coordinate = vis.angleToCoordinate(angle, vis.edge_length + vis.text_buffer)
                return line_coordinate.x - vis.text_buffer
            })
            .attr('y', function(d,i){
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                //the 10 gives the max value of the line.
                let line_coordinate = vis.angleToCoordinate(angle, vis.edge_length + vis.text_buffer)
                console.log(line_coordinate)
                return line_coordinate.y
            })
            .text(d => d.key)
            .style('fill', 'black')
    }
    angleToCoordinate(angle, value){
        //using this to convert values between rectangular and polar coordiantes
        let vis = this;

        let x = Math.cos(angle) * value
        let y = Math.sin(angle) * value

        return {"x": x, "y": -y};
    }

    createOutput(){
        let vis = this;

        vis.outputData = [];

        //converting drag value into a percentage
        vis.slider_data.forEach(obj => obj['percentage'] = obj.value*20)
        let summing_array = [];

        //using least squares to find a best fit to the user's input
        vis.displayData.forEach(function(d,i){
           // console.log(vis.displayData[i])
            vis.slider_data.forEach(function(j){
              //  console.log(j.feature)
              //  console.log(vis.displayData[i])
                if (vis.displayData[i].hasOwnProperty(j.feature)) {
                    summing_array.push({
                        'name': vis.displayData[i].name,
                        'value': (vis.displayData[i][j.feature] - j.percentage)**2
                    })
                }

            })
        })

        //summing together all of the squares
        let squaresbyState = d3.rollup(summing_array, leaves => d3.sum(leaves, d => d['value']), d => d['name'])
        squaresbyState = Array.from(squaresbyState, ([key, value]) => ({key, value}))


        //finding the best match using d3.least
        vis.best_fit = d3.least(squaresbyState, d => d.value).key
        console.log(vis.best_fit)

        //take best fit and put all its values back into the output array
        vis.outputData = vis.displayData.filter(d => d.name === vis.best_fit)
        vis.outputData = Object.values(vis.outputData)
        console.log(vis.outputData[0].name)

        //grabbing extra data for extra text outputs
        vis.extraData = vis.collegeData.filter(d => d['Institution (entity) name'] === vis.best_fit)
        vis.extraData = Object.values(vis.extraData)

        console.log(vis.extraData)

        //creating data structure to draw the polygon
        vis.pathPoints = Object.entries(vis.outputData[0])
            .filter(([attr, value]) => attr !== 'name')
        console.log(vis.pathPoints)


        vis.drawPolygon();
        vis.addHTML();


    }

    drawPolygon(){
        //need to take output data and plot polygon!
        let vis = this;

        vis.polygon = vis.polygon_group.selectAll('.polygon')
            .data(vis.pathPoints)

        //drawing paths to make the polygon
        vis.polygon.enter().append('path')
            .attr('class', 'polygon')
            .merge(vis.polygon)
            .attr('d', function(d, i){
                console.log(d[1])
                console.log(vis.pathPoints[i])

                let value = d[1] / 20 * vis.r_dist;
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.count)
                let line_coordinate = vis.angleToCoordinate(angle, value)

                let end_line_coordinate;
                if (i == vis.count - 1){
                    let end_value = vis.pathPoints[0][1] / 20 * vis.r_dist;
                    let end_angle = (Math.PI / 2) + (2 * Math.PI * (0) / vis.count)
                    end_line_coordinate = vis.angleToCoordinate(end_angle, end_value)
                }
                else{
                    let end_value = vis.pathPoints[i+1][1] / 20 * vis.r_dist;
                    let end_angle = (Math.PI / 2) + (2 * Math.PI * (i+1) / vis.count)
                    end_line_coordinate = vis.angleToCoordinate(end_angle, end_value)
                }

                return 'M ' + line_coordinate.x + ' '+ line_coordinate.y + ' l ' + (end_line_coordinate.x - line_coordinate.x) + ' ' + (end_line_coordinate.y - line_coordinate.y) + ' z'
            })
            .attr('stroke-width', '4')
            .attr('stroke', '#a51890')

        vis.polygon.exit().remove();




    }
    addHTML(){
        let vis = this;

        //vis.best_fit = college name
        //vis.outputData = all info with name

        //appending text based on output!
        document.getElementById("radar-schoolname").innerHTML = 'Your best match is <strong>' + vis.outputData[0].name + '</strong> !';
        document.getElementById("radar-finaid").innerHTML = '<b><span style="color: #005670">' + d3.format("0.4")(vis.outputData[0]['% on Financial Aid'])
        + '% </span></b>' + vis.outputData[0].name + ' students are on any type of <b><span style="color: #005670"> financial aid</span></b>.';
        document.getElementById("radar-women").innerHTML = '<b><span style="color: #00205b">' + d3.format("0.4")(vis.outputData[0]['% Female'])
            + '% </span></b>' + vis.outputData[0].name + ' enrolled students identify as <b><span style="color: #00205b"> women</span></b>.';
        document.getElementById("radar-instate").innerHTML = vis.outputData[0].name + ' has <b><span style="color: #009f4d">' + d3.format("0.4")(vis.outputData[0]['% In-State'])
        + '% </span></b> of their students from within <b><span style="color: #009f4d">' + vis.extraData[0]['State abbreviation_y'] + '</span></b>.';
        document.getElementById("radar-yield").innerHTML = 'Once admitted, <b><span style="color: #fe5000">' + d3.format("0.4")(vis.outputData[0]['Admissions Yield']) + '% </span></b>of admitted students ' +
            'actually <b><span style="color: #fe5000"> enroll </b></span> to attend.'
        document.getElementById("radar-admitrate").innerHTML = '<b><span style="color: #da1884">' + d3.format("0.4")(vis.outputData[0]['Admissions Rate']) + '% </span></b>of applicants <b><span style="color: #da1884"> receive admission </span></b>' +
            'into ' + vis.outputData[0].name + '.';

        console.log(vis.extraData[0]["SATAverage"])
        console.log(vis.extraData[0]["ACTMedian"])

        vis.testSelector();

    }

    testSelector() {
        let vis = this;


    }

    scoreChecker() {
        let vis = this;


        //taking user inputs and storing them
        vis.selectedTest = document.getElementById('testType').value;
        console.log(vis.selectedTest)


        vis.inputScore = document.getElementById('inputScore').value;
        console.log(vis.inputScore)


        console.log(typeof vis.inputScore)

        //appending appropriate text based on user input for SAT/act score and comparing to best fit college
        if (vis.extraData === undefined){
            document.getElementById("textOutput").innerHTML = '<p style="color: red"><strong>Oh no! You haven\'t completed the radar above to find your best fit school. Do so before continuing.</p></strong>'
        }
        else if (vis.selectedTest === "ACT") {
            if (vis.inputScore === "") {
                document.getElementById("textOutput").innerHTML = '<p style="color: red"><strong>Input your ACT score.</p></strong>'
            }
            else if (vis.inputScore > 36 || vis.inputScore < 0 || isNaN(vis.inputScore)) {
                document.getElementById("textOutput").innerHTML = '<p style="color: red"><strong>Please input a numerical score between 0 and 36.</p></strong>'
            }
            else if (Number(vis.inputScore) < vis.extraData[0]["ACTMedian"]) {
                document.getElementById("textOutput").innerHTML = 'Sorry! Your ACT score is <strong> below </strong>' +  vis.outputData[0].name +'\'s average ACT score of ' + vis.extraData[0]["ACTMedian"] + '. Keep working hard!'
            }
            else if ( vis.inputScore === vis.extraData[0]["ACTMedian"]) {
                document.getElementById("textOutput").innerHTML = 'Congratulations! Your ACT score is exactly <strong> equal </strong> to ' +  vis.outputData[0].name +'\'s average ACT score. Great work!'
            }
            else if ( Number(vis.inputScore) > vis.extraData[0]["ACTMedian"]) {
                // console.log(vis.inputScore)
                // console.log(vis.extraData[0]["ACTMedian"])
                document.getElementById("textOutput").innerHTML = 'Congratulations! Your ACT score is <strong> above </strong>' +  vis.outputData[0].name +'\'s average ACT score of ' + vis.extraData[0]["ACTMedian"] + '. Outstanding job!'
            }
        }
        else if (vis.selectedTest === "SAT") {
            if (vis.inputScore === "") {
                document.getElementById("textOutput").innerHTML = '<p style="color: red"><strong>Input your SAT score.</p></strong>'
            }
            else if (vis.inputScore > 1600 || vis.inputScore < 0 || isNaN(vis.inputScore)) {
                console.log(vis.inputScore)
                console.log(vis.extraData[0]["SATAverage"])
                document.getElementById("textOutput").innerHTML = '<p style="color: red"><strong>Please input a numerical score between 0 and 1600.</p></strong>'
            }
            else if (Number(vis.inputScore) < vis.extraData[0]["SATAverage"]) {
                console.log(vis.inputScore)
                console.log(vis.extraData[0]["SATAverage"])
                document.getElementById("textOutput").innerHTML = 'Sorry! Your SAT score is <strong>below </strong>' +  vis.outputData[0].name +'\'s average SAT score of ' + vis.extraData[0]["SATAverage"] + '. Keep working hard!'
            }
            else if ( vis.inputScore === vis.extraData[0]["SATAverage"]) {
                console.log(vis.inputScore)
                console.log(vis.extraData[0]["SATAverage"])
                document.getElementById("textOutput").innerHTML = 'Congratulations! Your SAT score is exacty <strong>equal </strong> to' +  vis.outputData[0].name +'\'s average SAT score. Great work!'
            }
            else if ( Number(vis.inputScore) > vis.extraData[0]["SATAverage"]) {
                console.log(vis.inputScore)
                document.getElementById("textOutput").innerHTML = 'Congratulations! Your SAT score is <strong>above </strong>' +  vis.outputData[0].name +'\'s average SAT score of ' + vis.extraData[0]["SATAverage"] + '. Outstanding job!'
            }
        }





    }

}


