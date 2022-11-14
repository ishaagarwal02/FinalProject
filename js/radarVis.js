/* * * * * * * * * * * * * *
*          RadarVis          *
* * * * * * * * * * * * * */

class RadarVis{
    constructor(parentElement, collegeData){
        this.parentElement = parentElement;
        this.collegeData = collegeData;

        this.initVis()
    }
    initVis(){
        let vis = this;

        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;

        vis.updateVis();

    }
    updateVis(){
        let vis = this;

    }
}