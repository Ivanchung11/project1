const fs = require('fs');
function pairUpScatter(xAxis, yAxis) {
    let pair;
    let data = [];
    for (let i = 0; i < xAxis.length; i++) {
        pair = { x: xAxis[i] / 1000, y: yAxis[i] };
        data.push(pair);
    }
    return data;
}
let gpxFile = fs.readFileSync('gpxparsed.json');
gpxFile = JSON.parse(gpxFile);
let dist1 = gpxFile.distance.cumul;
let points = gpxFile.points;
let ele1 = points.map((point) => point.ele);
export const eleProfile = pairUpScatter(dist1, ele1);
// console.log(eleProfile)
