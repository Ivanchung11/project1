// More info on https://www.npmjs.com/package/gpxparser?activeTab=readme


let gpxParser = require('gpxparser'); 
let fs = require('fs'); 

var gpx = new gpxParser(); //Create gpxParser Object

let data = fs.readFileSync('./2023-01-23-150805.gpx');      //import the gpx file as string

gpx.parse(data);       
console.log(gpx)
console.log(typeof(gpx))

var totalDistance = gpx.tracks[0].distance.total;

console.log(totalDistance)

// let geoJSON = gpx.toGeoJSON();

// console.log(geoJSON)
