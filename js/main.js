let UsaMap;

let promises = [
    //JSON States map projection
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), //dataArray[0]

]

Promise.all(promises)
    .then(function(){})
    .catch(function (err){
        console.log(err)
    });