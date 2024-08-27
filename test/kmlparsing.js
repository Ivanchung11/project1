// using togeojson in nodejs

var tj = require("@mapbox/togeojson"),
  fs = require("fs"),
  // node doesn't have xml parsing or a dom. use xmldom
  DOMParser = require("xmldom").DOMParser;

var kml = new DOMParser().parseFromString(
  fs.readFileSync("./multitrack.kml", "utf8")
);

// ./KML_Samples.kml
// ./multitrack.kml

var converted = tj.kml(kml);

var convertedWithStyles = tj.kml(kml, { styles: true });

var theLine = converted.features[1];

let geopoints = theLine.geometry.coordinates;

for (let i = 0; i < geopoints.length; i++) {
  let lat = geopoints[i][0];
  let lng = geopoints[i][1];
  let ele = geopoints[i][2];
  let coordTimes = theLine.properties.coordTimes[i];

  console.log(`POINT(${lat} ${lng}), ${ele}, ${coordTimes}`);
}

// console.log(convertedWithStyles.features[0])
