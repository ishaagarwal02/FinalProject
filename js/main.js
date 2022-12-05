let usaMap, matrixChartGender, matrixChartRace, matrixChartEnrollment, bubbleChart, leafletMap;

let selectedCategory_map = document.getElementById('mapCategorySelector').value;
let radar1, scatterPlot, barChart;

let selectedCategory = ""

let selectedCollege = "Harvard University"

//uploading the data
let promises = [
    //JSON States map projection for mapVis
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), //dataArray[0]
    d3.csv('data/merged_data.csv') //dataArray[1]
]

//running through the data to then do things with it
Promise.all(promises)
  
    .then(function(data){
      //  console.log(data)
        initMainPage(data)
    })
    .catch(function (err){
        console.log(err)
    });

//initializing the main page of the website
function initMainPage(allDataArray){
    let eventHandler = {
        bind: (eventName, handler) => {
            document.body.addEventListener(eventName, handler);
        },
        trigger: (eventName, extraParameters) => {
            document.body.dispatchEvent(new CustomEvent(eventName, {
                detail: extraParameters
            }));
        }
    }

    usaMap = new MapVis('mapDiv', allDataArray[0], allDataArray[1])
    // Instantiate visualization object (bike-sharing stations in Boston)
    leafletMap = new leafletVis("station-map", allDataArray[1], [39.504041, -99.014061]);
    radar1 = new RadarVis('radarDiv', allDataArray[1])

    console.log(allDataArray[1])
    //matrixChart = new MatrixChart('matrixvis', allDataArray[1]);
    bubbleChart = new BubbleVis('bubbleDiv', allDataArray[1]);
    // populate college selector
    populateCollegeSelector(allDataArray[1])

    scatterPlot = new ScatterVis('scatterDiv', allDataArray[1], eventHandler)
    barChart = new BarChart('barDiv', allDataArray[1])

    // init matrix chart
    matrixChartGender = new MatrixChart('matrixDiv', allDataArray[1], 'gender');
    matrixChartRace = new MatrixChart('matrixDiv', allDataArray[1], 'race');
    matrixChartEnrollment= new MatrixChart('matrixDiv', allDataArray[1], 'enrollment');

    //eventhandler for brush on scatterVis
    eventHandler.bind("selectionChanged", function(event){
       // console.log('hello!')
        let rangeStart = event.detail[0];
        let rangeEnd = event.detail[1];
        console.log(rangeEnd)
        barChart.onSelectionChange(rangeStart, rangeEnd);


    })

}

//category change for the map selector
function categoryChange(){
    selectedCategory_map =  document.getElementById('mapCategorySelector').value;

    // Wrangle data each time the dropdown menu gets changed (triggered in index.html)
    usaMap.wrangleData()
    bubbleChart.wrangleData()
   // console.log("category change happened");


}

//score change for radarVis test score checker
function scoreChange(){

    radar1.testSelector()
    radar1.scoreChecker()
    // console.log("category change happened");

    document.getElementById('inputScore').value = "";

}

//creating nav bar on lefthand side of webpage
var navBtnWidth = $('.navbar a').css('width');

$('.navbar a').mouseenter(e => {
    $(e.target).clearQueue();
    $(e.target).animate({
        width: $(e.target).get(0).scrollWidth
    }, 300, () => {
        $(e.target).width('auto');
    });
});

$('.navbar a').mouseout(e => {
    $(e.target).animate({
        width: navBtnWidth
    }, 300);
});