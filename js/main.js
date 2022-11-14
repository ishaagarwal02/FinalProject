let usaMap;
let matrixChart;
let bubbleChart;

//uploading the data
let promises = [
    //JSON States map projection
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), //dataArray[0]
    d3.csv('data/merged_data.csv') //dataArray[1]
]

//running through the data to then do things with it
Promise.all(promises)
  
    .then(function(data){
        console.log(data)
        initMainPage(data)
    })
    .catch(function (err){
        console.log(err)
    });

//initializing the main page of the website
function initMainPage(allDataArray){
    usaMap = new MapVis('mapDiv', allDataArray[0], allDataArray[1])
    console.log(allDataArray[1])
    matrixChart = new MatrixChart('matrixvis', allDataArray[1]);
    bubbleChart = new BubbleVis('bubbleDiv', allDataArray[1]);


};

//updating the matrix
function switchMatrixView() {
    matrixChart.updateChart();
}

//category change for the map selector
function categoryChange(){
    // Wrangle data each time the dropdown menu gets changed (triggered in index.html)
    bubbleChart.wrangleData()
    console.log("category change happened");
}