// More info on https://www.npmjs.com/package/gpxparser?activeTab=readme



let gpxParser = require('gpxparser'); 
let fs = require('fs'); 

var gpx = new gpxParser(); //Create gpxParser Object

let file1 = './2023-01-23-150805.gpx'
let file2 = 'small_round.gpx'
let file3 = '2024-08-25-120124.gpx'

let data = fs.readFileSync(file3);      //import the gpx file as string

gpx.parse(data);       
console.log(gpx)

var totalDistance = gpx.tracks[0].distance.total;
// var eleInfo = gpx.tracks[0].elevation;

console.log(totalDistance)

var ptInfo = gpx.tracks[0].points

let duration = 0;
let longseg = [];
for (i=0; i<ptInfo.length-1;i++){
    let timeseg = (ptInfo[i+1].time - ptInfo[i].time)/1000;
    if (timeseg > 60){
        duration += timeseg;
        // longseg.push({item:i,seg:timeseg})
    }
}
console.log(duration)
// console.log(longseg)

// console.log(gpx.xmlSource.location)

// let geoJSON = gpx.toGeoJSON();

// console.log(geoJSON)

