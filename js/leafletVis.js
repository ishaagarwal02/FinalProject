
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class leafletVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.displayData = [];

        this.initVis();
    }


    /*
     *  Initialize leaflet map
     */
    initVis () {
        let vis = this;

        // Create map
        vis.map = L.map('leaflet-map').setView([39.504041, -99.014061], 5);

        // Specify the path to the Leaflet images
        L.Icon.Default.imagePath = 'img/';

        // Load and display a tile layer on the map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        //console.log(vis.data)

        // Prepare data by looping over colleges and populating empty data structure
        vis.data.forEach(function (d) {
            let collegeInfo = {
                "name": d['Institution (entity) name'],
                "lat": d["Latitude location of institution"],
                "lon": d["Longitude location of institution"],
                "admission": d["AdmissionRate"],
                "enrollment": d["Estimated undergraduate enrollment, total"],
                "tuition": d["Tuition and fees, 2013-14"]
            };
            vis.displayData.push(collegeInfo);
        });

        //console.log(vis.displayData)

        //ensuring that all colleges have lat/long information, otherwise removing them
        let filteredData = vis.displayData.filter(d => d.lat !== undefined)
        vis.displayData = filteredData;
        console.log(vis.displayData)

        // No data wrangling/filtering needed

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        const d = d3.select(this).data()[0]

        // Draw a marker for each college
        vis.displayData.forEach(function (d) {

            let popupContent =  "<h6>" + d.name + "</h6>";
            popupContent += "<strong>Admissions Rate: </strong>" + Math.round((d.admission) * 100) + "%<br/>";
            popupContent += "<strong>Annual Tuition: </strong> $" + Math.round(d.tuition) + "<br/>";
            popupContent += "<strong>Undergraduate Enrollment: </strong>" + Math.round(d.enrollment) + "<br/>";

            //console.log([d.lat, d.lon])


            let markers = L.marker([d.lat, d.lon])
                .bindPopup(popupContent)
                .addTo(vis.map);
        });

        // Add a tile layer to the map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        // If the images are in the directory "/img":
        L.Icon.Default.imagePath = 'img/';


    }
}

