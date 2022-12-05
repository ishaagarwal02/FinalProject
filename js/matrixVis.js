// MatrixMain()

class MatrixChart {
    constructor(parentElement, data, selectedMatrixCategory) {
        this.parentElement = parentElement;
        this.data = data;
        this.selectedMatrixCategory = selectedMatrixCategory
        this.displayData = [];
        this.initVis();
    }


    // the function that recognize current section and call visualization function respectively
    initVis() {
        let vis = this;
        vis.margin = {top:40, right: 40, bottom: 0, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //extra space before enrollment
        if (vis.selectedMatrixCategory == 'enrollment'){
            vis.svg = d3.select("#" + vis.parentElement)
                .append('div')
                .attr('class', 'svg-matrix')
                .append("svg")
                .attr("width", vis.width + vis.margin.left + vis.margin.right)
                .attr("height", vis.height)
                .append("g")
                .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
        }


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement)
            .append('div')
            .attr('class', 'svg-matrix')
            .attr('id',"svg-matrix" + vis.selectedMatrixCategory)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
    }

    // wrangle and parse data to fit visualization
    wrangleData() {
        let vis = this;

        // filter for selected college
        vis.selectedCollegeData = vis.data.filter(function(d){
            return d['Institution (entity) name'] === selectedCollege
        })
        console.log(vis.selectedCollegeData)

        // convert to numerical values
        vis.selectedCollegeData.forEach(function(d){
            d['Enrolled  men'] = + d['Enrolled  men']
            d['Enrolled_women'] = + d['enrolled_women']
            d['Enrolled total_x'] = + d['Enrolled total_x']

            d['Enrolled part time total'] = + d['Enrolled part time total']

            d['Percent of first-time undergraduates - foreign countries'] = + d['Percent of first-time undergraduates - foreign countries']
            d['Percent of first-time undergraduates - in-state'] = + d['Percent of first-time undergraduates - in-state']
            d['Percent of first-time undergraduates - out-of-state'] = + d['Percent of first-time undergraduates - out-of-state']

            d['Percent of undergraduate enrollment that are American Indian or Alaska Native'] = + d['Percent of undergraduate enrollment that are American Indian or Alaska Native']
            d['Percent of undergraduate enrollment that are Asian'] = + d['Percent of undergraduate enrollment that are Asian']
            d['Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander'] = + d['Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander']
            d['Percent of undergraduate enrollment that are Black or African American'] = + d['Percent of undergraduate enrollment that are Black or African American']
            d['Percent of undergraduate enrollment that are Hispanic/Latino'] = + d['Percent of undergraduate enrollment that are Hispanic/Latino']
            d['Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander'] = + d['Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander']
            d['Percent of undergraduate enrollment that are Nonresident Alien'] = + d['Percent of undergraduate enrollment that are Nonresident Alien']
            d['Percent of undergraduate enrollment that are Race/ethnicity unknown'] = + d['Percent of undergraduate enrollment that are Race/ethnicity unknown']
            d['Percent of undergraduate enrollment that are White'] = + d['Percent of undergraduate enrollment that are White']
            d['Percent of undergraduate enrollment that are two or more races'] = + d['Percent of undergraduate enrollment that are two or more races']

            //Part-time undergraduate enrollment
        })

        // grab info we need
        let enrolledMen = vis.selectedCollegeData[0]['Enrolled  men']
        let enrolledWomen = vis.selectedCollegeData[0]['Enrolled_women']
        let enrolledTotal = vis.selectedCollegeData[0]['Enrolled total_x']

        let circlesMen = Math.round(enrolledMen / enrolledTotal * 1000)

        vis.circlesAI = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are American Indian or Alaska Native'] * 10)
        vis.circlesA = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Asian'] * 10)
        vis.circlesANHPI = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander'] * 10)
        vis.circlesAA = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Black or African American'] * 10)
        vis.circlesH = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Hispanic/Latino'] * 10)
        vis.circlesHPI = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander'] * 10)
        vis.circlesNA = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Nonresident Alien'] * 10)
        vis.circlesU = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are Race/ethnicity unknown']* 10)
        vis.circlesW = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are White'] * 10)
        vis.circlesTwoR = Math.round(vis.selectedCollegeData[0]['Percent of undergraduate enrollment that are two or more races']* 10)

        console.log(vis.circlesANHPI)
        console.log(vis.circlesTwoR)

        let enrolledPartTime = vis.selectedCollegeData[0]['Enrolled part time total']

        vis.circlesPartTime = Math.round(enrolledPartTime / enrolledTotal * 1000)

        vis.displayData = []
        //creating circles in matrix
        d3.range(0,1000).forEach(function(i) {
            let gender = (circlesMen <= i) ? 'men': 'women'
            let race = pick_race(vis, i)
            let enrollment= pick_color(vis, i)
            vis.displayData.push(
                {
                    gender : gender,
                    race : race,
                    enrollment : enrollment
                }
            )
        })

        //obtaining information to populate legend
        let percMaleText = d3.select('#percMale')
        let percFemaleText = d3.select('#percFemale')

        let percAIANText = d3.select('#percAIAN')
        let percAText = d3.select('#percA')
        let percBText = d3.select('#percB')
        let percHLText = d3.select('#percHL')
        let percNHText = d3.select('#percNH')
        let percWText = d3.select('#percW')
        let percTwoText = d3.select('#percTwo')
        let percANPHIText = d3.select('#percANHPI')
        let percNRText = d3.select('#percNR')
        let percUText = d3.select('#percU')

        let percPartTimeText = d3.select('#percPartTime')
        let percFullTimeText = d3.select('#percFullTime')

        vis.margin = {top: 40, right: 40, bottom: 60, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        //appending text for legend with appropriate percentages
        if (vis.selectedMatrixCategory == 'gender'){
            percMaleText.enter()
                .append('text')
                .merge(percMaleText)
                .text(`${Math.round(enrolledMen / enrolledTotal*100)}%`)
            percFemaleText.enter()
                .append('text')
                .merge(percFemaleText)
                .text(`${100 - Math.round(enrolledMen / enrolledTotal*100)}%`)
        }
        if (vis.selectedMatrixCategory == 'race') {
            percAIANText.enter()
                .append('text')
                .merge(percAIANText)
                .text(`${vis.circlesAI/10}%`)
            percAText.enter()
                .append('text')
                .merge(percAText)
                .text(`${vis.circlesA/10}%`)
            percBText.enter()
                .append('text')
                .merge(percBText)
                .text(`${vis.circlesAA/10}%`)
            percHLText.enter()
                .append('text')
                .merge(percHLText)
                .text(`${vis.circlesH/10}%`)
            percNHText.enter()
                .append('text')
                .merge(percNHText)
                .text(`${vis.circlesHPI/10}%`)
            percWText.enter()
                .append('text')
                .merge(percWText)
                .text(`${vis.circlesW/10}%`)
            percTwoText.enter()
                .append('text')
                .merge(percTwoText)
                .text(`${vis.circlesTwoR/10}%`)
            percANPHIText.enter()
                .append('text')
                .merge(percANPHIText)
                .text(`${vis.circlesANHPI/10}%`)
            percNRText.enter()
                .append('text')
                .merge(percNRText)
                .text(`${vis.circlesNA/10}%`)
            percUText.enter()
                .append('text')
                .merge(percUText)
                .text(`${vis.circlesU/10}%`)
        }

        if (vis.selectedMatrixCategory == 'enrollment'){
            percPartTimeText.enter()
                .append('text')
                .merge(percPartTimeText)
                .text(`${vis.circlesPartTime/10}%`)
            percFullTimeText.enter()
                .append('text')
                .merge(percFullTimeText)
                .text(`${100 - vis.circlesPartTime/10}%`)
        }
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //drawing circles
        let studentCircles = vis.svg.selectAll('.studentCircle')
            .data(vis.displayData)

        studentCircles.enter()
            .append('circle')
            .merge(studentCircles)
            .transition()
            .delay(function (d,i) {
                return 50 * (i%20);
            })
            .duration(1000)
            .attr('class', 'studentCircle')
            .attr('cx', (d, i) => 8 * (i % 20))
            .attr('cy', (d, i) => 6 * Math.floor(i / 20))
            .attr('r', 3)
            .attr('fill', d => colorManager(vis, d[vis.selectedMatrixCategory]));

        studentCircles.exit().remove();
    }}

