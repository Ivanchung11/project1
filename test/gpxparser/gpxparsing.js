// More info on https://www.npmjs.com/package/gpxparser?activeTab=readme

//GPX format (From Wikipedia)
//Latitude and longitude are expressed in decimal degrees, and elevation in meters, 
//both using the WGS 84 datum. Dates and times are expressed in Coordinated Universal Time (UTC) using ISO 8601 format.

let gpxParser = require('gpxparser'); 
let fs = require('fs'); 

var gpx = new gpxParser(); //Create gpxParser Object

let file1 = './data/2023-01-23-150805.gpx'
let file2 = 'small_round.gpx'
let file3 = '2024-08-25-120124.gpx'

let data = fs.readFileSync(file1);      //import the gpx file as string

gpx.parse(data);
// console.log(gpx)


var distanceArr = gpx.tracks[0].distance;
var elevationArr = gpx.tracks[0].elevation;
var slopeArr = gpx.tracks[0].slopes;
var geopoints = gpx.tracks[0].points;


// var simpleInfoObj = {
//     "distance" : distanceArr,
//     "elevation" : elevationArr,
//     "slopes" : slopeArr,
//     "points" : points
// }

console.log(distanceArr.cumul.length, slopeArr.length, geopoints.length) 
console.log(geopoints[0], distanceArr.cumul[0])
console.log(geopoints[geopoints.length-1], distanceArr.cumul[geopoints.length-1])

console.log("total: ", distanceArr.total, "\ncumul: ", distanceArr.cumul)

// var jsonInfoObj = JSON.stringify(simpleInfoObj)

// fs.writeFileSync("./gpxparsed.json", jsonInfoObj);


// for (let i = 0; i < geopoints.length; i++) {
//     let lat = geopoints[i].lat;
//     let lng = geopoints[i].lon;
//     let ele = geopoints[i].ele;
//     let coordTimes = geopoints[i].time;
  
    // console.log(`POINT(${lat} ${lng}), ${ele}, ${coordTimes}`);
//   }

  
let duration = 0;
let longseg = [];
for (i=0; i<geopoints.length-1;i++){
    let timeseg = (geopoints[i+1].time - geopoints[i].time)/1000;
    if (timeseg > 60){
        duration += timeseg;
    }
}
// console.log(duration)

// console.log(gpx.xmlSource.location)

// let geoJSON = gpx.toGeoJSON();

// console.log(geoJSON)

