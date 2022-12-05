//helper javascript for matrix vis

//updating colleges
function updateSelectedCollege(){
    selectedCollege = document.getElementById('collegeSelector').value

    // call to filter for selectedCollege
    matrixChartGender.wrangleData()
    matrixChartRace.wrangleData()
    matrixChartEnrollment.wrangleData()

}

//creating dropdown with all university names
function populateCollegeSelector(colleges){

    colleges.forEach(function(d){
        document.getElementById('datalistOptions').innerHTML +=
            `<option value="${d['Institution (entity) name']}">${d['Institution (entity) name']}</option>`

    })
}

//defining races and obtaining values
function pick_race (vis, i){
    if (i < vis.circlesAI) {
        return('AIAN')
    }
    else if (i < vis.circlesAI + vis.circlesA){
        return('Asian')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesAA){
        return('Black')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesAA + vis.circlesH){
        return('HL')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesAA + vis.circlesH + vis.circlesHPI){
        return('HPI')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesAA + vis.circlesH + vis.circlesHPI
        + vis.circlesW){
        return('W')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesH + vis.circlesAA + vis.circlesW +
        vis.circlesHPI + vis.circlesTwoR){
        return('twor')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesH + vis.circlesAA + vis.circlesW +
        vis.circlesHPI + vis.circlesTwoR + vis.circlesANHPI){
        return('ANPI')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesH + vis.circlesAA + vis.circlesW +
        vis.circlesHPI + vis.circlesTwoR + vis.circlesANHPI + vis.circlesNA){
        return('NA')
    }
    else if (i < vis.circlesAI + vis.circlesA + vis.circlesH + vis.circlesAA + vis.circlesW +
        vis.circlesHPI + vis.circlesTwoR + vis.circlesANHPI + vis.circlesNA + vis.circlesU) {
        return ('U')
    }
}

function pick_color (vis, i) {

    if(i<vis.circlesPartTime){
        return('PT')
    }
    else{
        return('FT')
    }
}

//colors for matrices
function colorManager(vis, selectedMatrixCategoryKey){
    vis.lookupTable = {
        men: '#fe5000',
        women:'#005670',


        //input race colors
        AIAN: '#00bce4',
        Asian: '#037ef3',
        Black: '#005670',
        HL:'#00205b',
        W:'#009f4d',
        HPI:'#84bd00',
        twor: '#efdf00',
        ANPI: '#fe5000',
        NA: '#da1884',
        U: '#a51890',

        PT: '#fe5000',
        FT:'#005670'


    }

    return(vis.lookupTable[selectedMatrixCategoryKey])}