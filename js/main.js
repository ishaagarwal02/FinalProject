let usaMap;

let promises = [
    //JSON States map projection
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), //dataArray[0]
    d3.csv('data/merged_data.csv')
]

Promise.all(promises)
    .then(function(data){
        console.log(data)
        initMainPage(data)
    })

    .catch(function (err){
        console.log(err)
    });